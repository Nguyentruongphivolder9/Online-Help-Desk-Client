export default function isObjectEmpty(obj) {
  return !(() => {
    for (const i in obj) {
      return true
    }
    return false
  })()
}
