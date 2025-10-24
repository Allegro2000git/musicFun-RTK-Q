import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types"
import { useDeletePlaylistMutation } from "@/features/playlists/api/playlistsApi"
import defaultCover from "@/assets/images/default-playlist-cover.png"
import s from "./PlaylistItem.module.css"

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
      <img src={defaultCover} alt={"cover"} width={"240px"} className={s.cover} />
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={() => handleDeletePlaylist(playlist.id)}>delete</button>
      <button onClick={() => onEditPlaylist(playlist)}>update</button>
    </div>
  )
}
