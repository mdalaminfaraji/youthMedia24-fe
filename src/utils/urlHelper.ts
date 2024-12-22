// utils/urlHelpers.ts
export const createReadableUrl = (text: string): string => {
  // Remove any special characters except Bengali unicode range and basic punctuation
  const cleanText = text.replace(/[^\u0980-\u09FF\w\s-]/g, '')

  // Replace spaces with hyphens
  return cleanText.replace(/\s+/g, '-')
}

export const decodeReadableUrl = (url: string): string => {
  // First decode the URI components
  const decoded = decodeURIComponent(url)

  // Replace hyphens with spaces
  return decoded.replace(/-/g, ' ')
}
