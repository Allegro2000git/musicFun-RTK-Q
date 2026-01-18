import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistData,
  PlaylistsResponse,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types"
import { baseApi } from "@/app/api/baseApi"
import type { Images } from "@/common/types"
import { withZodCatch } from "@/common/utils"
import { playlistCreateResponseSchema, playlistsGetResponseSchema } from "@/features/playlists/model/playlists.schemas"
import { imagesSchema } from "@/common/schemas"
import { SOCKET_EVENTS } from "@/common/constants"
import { subscribeToEvent } from "@/common/socket"

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => ({ url: "playlists", params }),
      providesTags: ["Playlist"],
      ...withZodCatch(playlistsGetResponseSchema),
      keepUnusedDataFor: 0,
      onCacheEntryAdded: async (_arg, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) => {
        await cacheDataLoaded

        const unsubscribes = [
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (message) => {
            const currentPlaylist = message.payload.data

            updateCachedData((state) => {
              const index = state.data.findIndex((playlist) => playlist.id === currentPlaylist.id)
              if (index !== -1) {
                state.data[index].attributes.images = currentPlaylist.attributes.images
                return
              }

              state.data.pop()
              state.data.unshift(currentPlaylist)
              state.meta.totalCount = state.meta.totalCount + 1
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
            })
          }),
          subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (message) => {
            const updatedPlaylist = message.payload.data
            updateCachedData((state) => {
              const index = state.data.findIndex((playlist) => playlist.id === updatedPlaylist.id)
              if (index !== -1) {
                state.data[index] = { ...state.data[index], ...updatedPlaylist }
              }
            })
          }),
        ]

        await cacheEntryRemoved
        unsubscribes.forEach((unsubscribe) => unsubscribe())
      },
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({ method: "POST", url: "playlists", body }),
      invalidatesTags: ["Playlist"],
      ...withZodCatch(playlistCreateResponseSchema),
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({ method: "DELETE", url: `playlists/${playlistId}` }),
      invalidatesTags: ["Playlist"],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({ method: "PUT", url: `playlists/${playlistId}`, body }),
      onQueryStarted: async ({ playlistId, body }, { queryFulfilled, dispatch, getState }) => {
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), "fetchPlaylists")

        const patchCollection: any[] = []

        args.forEach((arg) => {
          patchCollection.push(
            dispatch(
              playlistsApi.util.updateQueryData(
                "fetchPlaylists",
                { pageNumber: arg.pageNumber, pageSize: arg.pageSize, search: arg.search },
                (state) => {
                  const playlistIndex = state.data.findIndex((playlist) => playlist.id === playlistId)
                  if (playlistIndex !== -1) {
                    state.data[playlistIndex].attributes = { ...state.data[playlistIndex].attributes, ...body }
                  }
                },
              ),
            ),
          )
        })

        try {
          await queryFulfilled
        } catch {
          patchCollection.forEach((patchCollection) => {
            patchCollection.undo()
          })
        }
      },
      invalidatesTags: ["Playlist"],
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append("file", file)
        return { method: "POST", url: `playlists/${playlistId}/images/main`, body: formData }
      },
      invalidatesTags: ["Playlist"],
      ...withZodCatch(imagesSchema),
    }),
    deletePlaylistCover: build.mutation<void, string>({
      query: (playlistId) => ({ method: "DELETE", url: `playlists/${playlistId}/images/main` }),
      invalidatesTags: ["Playlist"],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi
