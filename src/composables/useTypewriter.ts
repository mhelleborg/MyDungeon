import { ref, onUnmounted } from 'vue'

/**
 * Composable that types out text character by character.
 * Call `start(text)` to begin, `skip()` to show immediately.
 */
export function useTypewriter(charsPerTick = 2, tickMs = 25) {
  const displayText = ref('')
  const isTyping = ref(false)
  let fullText = ''
  let pos = 0
  let timer: ReturnType<typeof setInterval> | null = null

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isTyping.value = false
  }

  function start(text: string) {
    stop()
    fullText = text
    pos = 0
    displayText.value = ''
    isTyping.value = true

    timer = setInterval(() => {
      pos += charsPerTick
      if (pos >= fullText.length) {
        displayText.value = fullText
        stop()
      } else {
        displayText.value = fullText.slice(0, pos)
      }
    }, tickMs)
  }

  function skip() {
    stop()
    displayText.value = fullText
  }

  onUnmounted(stop)

  return { displayText, isTyping, start, skip }
}
