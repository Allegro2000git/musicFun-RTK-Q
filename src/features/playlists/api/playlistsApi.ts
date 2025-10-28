import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types"
import { baseApi } from "@/app/api/baseApi"
import type { Images } from "@/common/types"

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => ({ url: "playlists", params }),
      providesTags: ["Playlist"],
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({ method: "POST", url: "playlists", body }),
      invalidatesTags: ["Playlist"],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({ method: "DELETE", url: `playlists/${playlistId}` }),
      invalidatesTags: ["Playlist"],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({ method: "PUT", url: `playlists/${playlistId}`, body }),
      invalidatesTags: ["Playlist"],
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append("file", file)
        return { method: "POST", url: `playlists/${playlistId}/images/main`, body: formData }
      },
      invalidatesTags: ["Playlist"],
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
