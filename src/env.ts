import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    API_BASE_URL: z.string().url().default('http://localhost:3333'),
    API_URL_PREFIX: z.string().optional(),
    JWT_SECRET: z.string(),
    NEXTAUTH_SECRET: z.string(),
  },
  runtimeEnv: {
    API_BASE_URL: process.env.API_BASE_URL,
    API_URL_PREFIX: process.env.API_URL_PREFIX,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },

  isServer: typeof window === 'undefined',
})
