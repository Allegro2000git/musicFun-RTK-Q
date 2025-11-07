import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi"
import s from "./PlaylistsPage.module.css"
import { CreatePlaylistForm } from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm"
import { type ChangeEvent, useState } from "react"
import { useDebounceValue } from "@/common/hooks"
import { Pagination } from "@/common/components/Pagination/Pagination"
import { PlaylistsList } from "@/features/playlists/ui/PlaylistsList/PlaylistsList"

export const PlaylistsPage = () => {
  const [search, setSearch] = useState("")
  const debounceSearch = useDebounceValue(search)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)

  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageSize,
    pageNumber: currentPage,
  })

  const changePageSizeHandler = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  if (isLoading) {
    return <h2>Skeleton...</h2>
  }

  /*  if (error) {
    if ("status" in error) {
      const errMsg = "error" in error ? error.error : (error.data as { error: string }).error
      toast(errMsg, { type: "error", theme: "colored" })
    } else {
      const errMsg = error.message || "some error occurred"
      toast(errMsg, { type: "error", theme: "colored" })
    }
  }*/

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm setPlaylistPage={setCurrentPage} />
      <input type="search" placeholder={"Search playlist by title"} onChange={(e) => searchPlaylistHandler(e)} />
      <PlaylistsList playLists={data?.data || []} isPlaylistsLoading={isLoading} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
        pagesCount={data?.meta.pagesCount || 1}
      />
    </div>
  )
}
