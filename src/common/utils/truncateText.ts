export const truncateText = (playlistText: string, maxLength: number = 25) => {
  return playlistText.length > maxLength ? playlistText.slice(0, 22) + "..." : playlistText
}
