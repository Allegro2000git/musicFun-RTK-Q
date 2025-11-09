import z from "zod/v4"
import { LoginResponseSchema, MeResponseSchema } from "@/features/auth/model/auth.schemas"

export type MeResponse = z.infer<typeof MeResponseSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>

export type LoginArgs = {
  code: string
  redirectUri: string
  rememberMe: boolean
  accessTokenTTL?: string
}
