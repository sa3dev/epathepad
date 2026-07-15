import { z } from "zod";
import { DISCIPLINES } from "@/lib/constants/disciplines";
import { REGIONS } from "@/lib/constants/regions";

export const ehpadProfileSchema = z.object({
  facilityName: z.string().min(1, "Nom requis"),
  address: z.string().min(1, "Adresse requise"),
  city: z.string().min(1, "Ville requise"),
  postalCode: z.string().min(4, "Code postal invalide"),
  region: z.enum(REGIONS),
  description: z.string().max(2000).optional(),
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
});

export const artistProfileSchema = z.object({
  stageName: z.string().min(1, "Nom de scène requis"),
  bio: z.string().max(2000).optional(),
  discipline: z.enum(DISCIPLINES),
  regionsServed: z.array(z.enum(REGIONS)).min(1, "Sélectionnez au moins une région"),
  contactPhone: z.string().max(20).optional(),
});
