import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi"
import s from "./PlaylistsPage.module.css"
import { CreatePlaylistForm } from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm"
import { useState } from "react"
import type { PlaylistData, UpdatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types"
import { PlaylistItem } from "@/features/playlists/ui/PlaylistItem/PlaylistItem"
import { EditPlaylistForm } from "@/features/playlists/ui/EditPlaylistForm/EditPlaylistForm"
import { useForm } from "react-hook-form"

export const PlaylistsPage = () => {
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const { data, isLoading } = useFetchPlaylistsQuery()

  if (isLoading) return <h1>Loading...</h1>

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
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <div className={s.items}>
        {data?.data.map((playlist) => {
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
    </div>
  )
}
