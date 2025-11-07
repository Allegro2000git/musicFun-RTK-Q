import type { PlaylistAttributes } from "@/features/playlists/api/playlistsApi.types"
import { truncateText } from "@/common/utils"

type Props = {
  playlistAttributes: PlaylistAttributes
}
export const PlaylistDescription = ({ playlistAttributes }: Props) => {
  return (
    <>
      <div>title: {truncateText(playlistAttributes.title)}</div>
      <div>description: {truncateText(playlistAttributes.description)}</div>
      <div>userName: {playlistAttributes.user.name}</div>
    </>
  )
}
