import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_SERVER_API_URL: z.url(
    "NEXT_PUBLIC_SERVER_API_URL must be a valid URL",
  ),
  // Feature flag: gate the whole Neko Protocol section (all /neko routes + its
  // nav group + landing cards). Off unless explicitly set to "true". Public, so
  // it can be read client-side.
  NEXT_PUBLIC_NEKO_ENABLED: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SERVER_API_URL: process.env.NEXT_PUBLIC_SERVER_API_URL,
  NEXT_PUBLIC_NEKO_ENABLED: process.env.NEXT_PUBLIC_NEKO_ENABLED,
});
