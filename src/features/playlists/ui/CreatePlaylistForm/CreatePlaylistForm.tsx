import { type SubmitHandler, useForm } from "react-hook-form"
import type { CreatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types"
import { useCreatePlaylistMutation } from "@/features/playlists/api/playlistsApi"

type Props = {
  setPlaylistPage: (page: number) => void
}

export const CreatePlaylistForm = ({ setPlaylistPage }: Props) => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistArgs>()
  const [createPlaylist] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = (data) => {
    createPlaylist(data)
      .unwrap()
      .then(() => {
        setPlaylistPage(1)
        reset()
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register("title")} placeholder={"title"} />
      </div>
      <div>
        <input {...register("description")} placeholder={"description"} />
      </div>
      <button>create playlist</button>
    </form>
  )
}
