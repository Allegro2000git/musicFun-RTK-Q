import { baseApi } from "@/app/api/baseApi"
import type { LoginArgs, LoginResponse, MeResponse } from "@/features/auth/api/authApi.types"
import { AUTH_KEYS } from "@/common/constants"
import { withZodCatch } from "@/common/utils"
import { LoginResponseSchema, MeResponseSchema } from "@/features/auth/model/auth.schemas"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
      providesTags: ["Auth"],
      ...withZodCatch(MeResponseSchema),
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: (body) => ({ method: "post", url: "auth/login", body: { ...body, accessTokenTTL: "15m" } }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        // Invalidate after saving tokens
        dispatch(authApi.util.invalidateTags(["Auth"]))
      },
      ...withZodCatch(LoginResponseSchema),
    }),
    logout: build.mutation<void, void>({
      query: () => {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        return { method: "post", url: "auth/logout", body: { refreshToken } }
      },
      onQueryStarted: async (_args, { queryFulfilled, dispatch }) => {
        await queryFulfilled
        localStorage.removeItem(AUTH_KEYS.accessToken)
        localStorage.removeItem(AUTH_KEYS.refreshToken)
        dispatch(baseApi.util.resetApiState())
      },
    }),
  }),
})

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi
