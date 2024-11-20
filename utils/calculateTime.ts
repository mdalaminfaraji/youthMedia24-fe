export const calculateTimeSince = (createdAt: string): string => {
  const createdDate = new Date(createdAt)
  const currentDate = new Date()
  const differenceInMs = currentDate.getTime() - createdDate.getTime()

  const seconds = Math.floor(differenceInMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d`
  if (hours > 0) return `${hours}h`
  if (minutes > 0) return `${minutes}m`
  return `${seconds}s`
}
