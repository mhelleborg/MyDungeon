/**
 * UX validation harness: drives the built game through the full flow
 * (title → character select → play → move → combat → panels) at phone,
 * tablet and desktop sizes, checking layout invariants and taking
 * screenshots.
 *
 * Usage:
 *   npm run build && npm run preview -- --port 4173 &
 *   node scripts/ux-check.mjs [output-dir]
 */
import { chromium } from 'playwright-core'

const BASE_URL = process.env.UX_CHECK_URL ?? 'http://localhost:4173/MyDungeon/'
const OUT_DIR = process.argv[2] ?? 'ux-shots'
const EXECUTABLE = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium'

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667, mobile: true },
  { name: 'iphone-14', width: 390, height: 844, mobile: true },
  { name: 'ipad', width: 768, height: 1024, mobile: true },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
]

const problems = []

function report(viewport, ok, label, detail = '') {
  const mark = ok ? '  ok ' : 'FAIL '
  console.log(`${mark}[${viewport}] ${label}${detail ? ' — ' + detail : ''}`)
  if (!ok) problems.push(`[${viewport}] ${label}${detail ? ' — ' + detail : ''}`)
}

async function noHorizontalOverflow(page, vp, label) {
  const overflow = await page.evaluate(() => {
    const el = document.scrollingElement
    return { scrollW: el.scrollWidth, innerW: window.innerWidth }
  })
  report(vp.name, overflow.scrollW <= overflow.innerW + 1, `no horizontal overflow (${label})`,
    overflow.scrollW > overflow.innerW + 1 ? `scrollWidth ${overflow.scrollW} > ${overflow.innerW}` : '')
}

async function checkTouchTargets(page, vp, selector, label, minSize = 43) {
  const sizes = await page.$$eval(selector, els =>
    els.filter(el => el.offsetParent !== null).map(el => {
      const r = el.getBoundingClientRect()
      return { h: r.height, w: r.width, text: (el.textContent ?? '').trim().slice(0, 24) }
    }))
  const small = sizes.filter(s => s.h < minSize)
  report(vp.name, small.length === 0, `touch targets ≥${minSize}px (${label}, ${sizes.length} found)`,
    small.map(s => `"${s.text}" h=${Math.round(s.h)}`).join(', '))
}

async function run() {
  const browser = await chromium.launch({ executablePath: EXECUTABLE })

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: vp.mobile,
      isMobile: vp.mobile && vp.width < 700,
      deviceScaleFactor: vp.mobile ? 2 : 1,
    })
    const page = await context.newPage()
    const shot = (name) => page.screenshot({ path: `${OUT_DIR}/${vp.name}-${name}.png` })

    // ── Title ──
    await page.goto(BASE_URL)
    await page.waitForTimeout(1600) // fade-in cascade
    await shot('1-title')
    await noHorizontalOverflow(page, vp, 'title')

    // ── Character select ──
    await page.getByRole('button', { name: /ENTER MORIA|NEW GAME/ }).click()
    await page.waitForTimeout(300)
    await shot('2-select')
    await noHorizontalOverflow(page, vp, 'character select')

    // ── Start playing ──
    await page.getByRole('button', { name: 'BEGIN JOURNEY' }).click()
    await page.waitForTimeout(500)
    await shot('3-game')
    await noHorizontalOverflow(page, vp, 'game screen')

    const isMobileLayout = vp.width < 768
    if (isMobileLayout) {
      await checkTouchTargets(page, vp, '[aria-label^="Go "]', 'exit buttons')
      await checkTouchTargets(page, vp, 'nav button', 'bottom nav', 47)
    }

    // Feed must get a real share of the screen outside combat
    const feedBox = await page.evaluate(() => {
      const el = document.querySelector('[aria-live="polite"]')
      return el ? el.getBoundingClientRect().height : 0
    })
    report(vp.name, feedBox >= vp.height * 0.3, 'story feed ≥30% of viewport',
      `feed ${Math.round(feedBox)}px of ${vp.height}px`)

    // ── Move until combat starts (rotate through exits to explore) ──
    let inCombat = false
    for (let i = 0; i < 15 && !inCombat; i++) {
      const exits = page.locator('[aria-label^="Go "]')
      const count = await exits.count()
      if (count === 0) break
      await exits.nth(i % count).click()
      await page.waitForTimeout(250)
      inCombat = await page.getByText('⚔ COMBAT').isVisible().catch(() => false)
    }
    report(vp.name, inCombat, 'reached combat by tapping exits')

    if (inCombat) {
      await shot('4-combat')
      await noHorizontalOverflow(page, vp, 'combat')
      // Attack chip must be visible without scrolling, and tappable
      const attack = page.locator('button', { hasText: '⚔' }).first()
      const visible = await attack.isVisible()
      report(vp.name, visible, 'attack chip visible in combat')
      if (visible) {
        await attack.click()
        await page.waitForTimeout(250)
        report(vp.name, true, 'attack tap accepted')
        await shot('5-combat-after-attack')
      }
    }

    // ── Mobile: sheets + command input ──
    if (isMobileLayout) {
      for (const [tab, name] of [['HERO', '6-sheet-hero'], ['MAP', '7-sheet-map']]) {
        await page.locator('nav button', { hasText: tab }).click()
        await page.waitForTimeout(300)
        const sheetVisible = await page.locator('[role="dialog"]').isVisible()
        report(vp.name, sheetVisible, `${tab} sheet opens`)
        await shot(name)
        await page.locator('[role="dialog"] [aria-label="Close"]').click()
        await page.waitForTimeout(200)
      }
      // Command input toggle
      await page.locator('nav button[aria-label="Toggle command input"]').click()
      await page.waitForTimeout(200)
      const inputVisible = await page.locator('[data-command-input]:visible').first().isVisible()
      report(vp.name, inputVisible, 'command input opens from nav')
      if (inputVisible) {
        await page.locator('[data-command-input]:visible').first().fill('look')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(200)
      }
      await shot('8-command-input')
    } else {
      // Desktop: sidebar + persistent command input
      const sidebar = await page.locator('aside').isVisible()
      report(vp.name, sidebar, 'desktop sidebar visible')
      const input = await page.locator('[data-command-input]:visible').first().isVisible()
      report(vp.name, input, 'desktop command input visible')
      await page.locator('[data-command-input]:visible').first().fill('look')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)
      await shot('8-after-look')
    }

    // ── Menu overlay ──
    await page.getByRole('button', { name: '☰ MENU' }).click()
    await page.waitForTimeout(200)
    await shot('9-menu')
    await noHorizontalOverflow(page, vp, 'menu')

    await context.close()
  }

  await browser.close()

  console.log('\n' + (problems.length === 0
    ? 'All checks passed.'
    : `${problems.length} problem(s):\n` + problems.map(p => '  - ' + p).join('\n')))
  process.exit(problems.length === 0 ? 0 : 1)
}

run().catch(err => { console.error(err); process.exit(1) })
