import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types"
import { useDeletePlaylistMutation } from "@/features/playlists/api/playlistsApi"
import { PlaylistCover } from "@/features/playlists/ui/PlaylistItem/PlaylistCover/PlaylistCover"
import { PlaylistDescription } from "@/features/playlists/ui/PlaylistItem/PlaylistDescription/PlaylistDescription"
import { useGetMeQuery } from "@/features/auth/api/authApi"

type Props = {
  playlist: PlaylistData
  onEditPlaylist: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, onEditPlaylist }: Props) => {
  const [deletePlaylist] = useDeletePlaylistMutation()
  const { data } = useGetMeQuery()

  const handleDeletePlaylist = (playlistId: string) => {
    if (confirm("Are you sure you want to delete the playlist?")) deletePlaylist(playlistId)
  }

  return (
    <div>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
      <PlaylistDescription playlistAttributes={playlist.attributes} />
      {data && <button onClick={() => handleDeletePlaylist(playlist.id)}>delete</button>}
      {data && <button onClick={() => onEditPlaylist(playlist)}>update</button>}
    </div>
  )
}
