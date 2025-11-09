import z from "zod/v4"

export const MeResponseSchema = z.object({
  userId: z.string(),
  login: z.string(),
})

export const LoginResponseSchema = z.object({
  refreshToken: z.jwt(),
  accessToken: z.jwt(),
})
