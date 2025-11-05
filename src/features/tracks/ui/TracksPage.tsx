import { useFetchTracksInfiniteQuery } from "@/features/tracks/api/tracksApi"
import { useInfiniteScroll } from "@/common/hooks"
import { TracksList } from "@/features/tracks/ui/TracksList"
import { LoadingTrigger } from "@/features/tracks/ui/LoadingTrigger/LoadingTrigger"

export const TracksPage = () => {
  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useFetchTracksInfiniteQuery()

  const { observerRef } = useInfiniteScroll({ hasNextPage, isFetching, fetchNextPage })

  const pagesTracks = data?.pages.flatMap((page) => page.data) || []

  return (
    <div>
      <h1>Tracks page</h1>
      <TracksList tracks={pagesTracks} />
      {hasNextPage && <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage} />}
      {!hasNextPage && pagesTracks.length > 0 && <p>Nothing more to load</p>}
    </div>
  )
}
