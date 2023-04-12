export function ignoredPatternsCheck(path: string, patterns: RegExp) {
  //Handle static file extensions
  let result = patterns.test(path)
  return result
}