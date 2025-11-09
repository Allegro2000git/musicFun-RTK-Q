import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types"
import { baseApi } from "@/app/api/baseApi"
import type { Images } from "@/common/types"
import { withZodCatch } from "@/common/utils"
import { playlistCreateResponseSchema, playlistsGetResponseSchema } from "@/features/playlists/model/playlists.schemas"
import { imagesSchema } from "@/common/schemas"

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => ({ url: "playlists", params }),
      providesTags: ["Playlist"],
      ...withZodCatch(playlistsGetResponseSchema),
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
