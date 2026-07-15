import { z } from "zod";

export const contactRequestSchema = z.object({
  artistProfileId: z.string().uuid(),
  message: z.string().min(10, "Décrivez votre demande (10 caractères minimum)").max(2000),
});

export const contactRequestResponseSchema = z.object({
  requestId: z.string().uuid(),
  status: z.enum(["ACCEPTED", "DECLINED"]),
  artistReply: z.string().max(2000).optional(),
});
