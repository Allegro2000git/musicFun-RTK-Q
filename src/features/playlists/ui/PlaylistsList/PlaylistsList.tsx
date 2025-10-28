import { EditPlaylistForm } from "@/features/playlists/ui/EditPlaylistForm/EditPlaylistForm"
import { PlaylistItem } from "@/features/playlists/ui/PlaylistItem/PlaylistItem"
import type { PlaylistData, UpdatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types"
import { useState } from "react"
import { useForm } from "react-hook-form"
import s from "./PlaylistsList.module.css"

type Props = {
  playLists: PlaylistData[]
  isPlaylistsLoading: boolean
}

export const PlaylistsList = ({ playLists, isPlaylistsLoading }: Props) => {
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const handleEditPlaylist = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((tag) => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }

  return (
    <div className={s.items}>
      {!playLists.length && !isPlaylistsLoading && <h2>Playlists not found</h2>}
      {playLists.map((playlist) => {
        const isEditing = playlistId === playlist.id

        return (
          <div className={s.item} key={playlist.id}>
            {isEditing ? (
              <EditPlaylistForm
                playlistId={playlistId}
                setPlaylistId={setPlaylistId}
                editPlaylist={handleEditPlaylist}
                register={register}
                handleSubmit={handleSubmit}
              />
            ) : (
              <PlaylistItem playlist={playlist} onEditPlaylist={handleEditPlaylist} />
            )}
          </div>
        )
      })}
    </div>
  )
}
