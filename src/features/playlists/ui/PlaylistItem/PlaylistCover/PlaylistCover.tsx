import type { ChangeEvent } from "react"
import s from "./PlaylistCover.module.css"
import { useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation } from "@/features/playlists/api/playlistsApi"
import defaultCover from "@/assets/images/default-playlist-cover.png"
import type { Images } from "@/common/types"
import { errorToast } from "@/common/utils"

type Props = {
  playlistId: string
  images: Images
}

export const PlaylistCover = ({ playlistId, images }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const originalCover = images.main.find((img) => img.type === "original")
  const src = originalCover ? originalCover.url : defaultCover

  const handleDeleteCover = () => deletePlaylistCover(playlistId)

  const handleUploadCover = (e: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]

    const file = e.target.files?.length && e.target.files[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      errorToast("Only JPEG, PNG or GIF images are allowed")

      return
    }

    if (file.size > maxSize) {
      errorToast(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
      return
    }

    uploadPlaylistCover({ playlistId, file })
  }

  return (
    <>
      <img src={src} alt={"cover"} width={"240px"} className={s.cover} />
      <input type={"file"} accept={"image/jpeg,image/png,image/gif"} onChange={handleUploadCover} />
      {originalCover && <button onClick={handleDeleteCover}>deleteCover</button>}
    </>
  )
}
