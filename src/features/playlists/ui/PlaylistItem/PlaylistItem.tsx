import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types"
import { useDeletePlaylistMutation } from "@/features/playlists/api/playlistsApi"
import { PlaylistCover } from "@/features/playlists/ui/PlaylistItem/PlaylistCover/PlaylistCover"
import { PlaylistDescription } from "@/features/playlists/ui/PlaylistItem/PlaylistDescription/PlaylistDescription"

type Props = {
  playlist: PlaylistData
  onEditPlaylist: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, onEditPlaylist }: Props) => {
  const [deletePlaylist] = useDeletePlaylistMutation()

  const handleDeletePlaylist = (playlistId: string) => {
    if (confirm("Are you sure you want to delete the playlist?")) deletePlaylist(playlistId)
  }

  return (
    <div>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
      <PlaylistDescription playlistAttributes={playlist.attributes} />
      <button onClick={() => handleDeletePlaylist(playlist.id)}>delete</button>
      <button onClick={() => onEditPlaylist(playlist)}>update</button>
    </div>
  )
}
