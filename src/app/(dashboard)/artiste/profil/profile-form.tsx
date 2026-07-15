"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { saveArtistProfileAction } from "./actions";
import { artistProfileSchema } from "@/lib/validations/profiles";
import { DISCIPLINES, DISCIPLINE_LABELS } from "@/lib/constants/disciplines";
import { REGIONS } from "@/lib/constants/regions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import type { ArtistProfile } from "@/lib/types";

type FormValues = z.infer<typeof artistProfileSchema>;

export function ArtistProfileForm({ profile }: { profile: ArtistProfile | null }) {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(artistProfileSchema),
    defaultValues: {
      stageName: profile?.stageName ?? "",
      bio: profile?.bio ?? "",
      discipline: profile?.discipline ?? DISCIPLINES[0],
      regionsServed: (profile?.regionsServed as FormValues["regionsServed"]) ?? [],
      contactPhone: profile?.contactPhone ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveArtistProfileAction(values);
    setStatus(result.error ? "error" : "saved");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Nom de scène" htmlFor="stageName" error={errors.stageName?.message}>
        <Input id="stageName" {...register("stageName")} />
      </FormField>

      <FormField label="Discipline" htmlFor="discipline" error={errors.discipline?.message}>
        <Select id="discipline" {...register("discipline")}>
          {DISCIPLINES.map((discipline) => (
            <option key={discipline} value={discipline}>
              {DISCIPLINE_LABELS[discipline]}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Bio" htmlFor="bio" error={errors.bio?.message}>
        <Textarea id="bio" rows={4} {...register("bio")} />
      </FormField>

      <div className="flex flex-col gap-1.5">
        <Label>Régions desservies</Label>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3">
          {REGIONS.map((region) => (
            <label key={region} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" value={region} {...register("regionsServed")} />
              {region}
            </label>
          ))}
        </div>
        {errors.regionsServed && (
          <p className="text-sm text-destructive">{errors.regionsServed.message}</p>
        )}
      </div>

      <FormField label="Téléphone" htmlFor="contactPhone" error={errors.contactPhone?.message}>
        <Input id="contactPhone" {...register("contactPhone")} />
      </FormField>

      {status === "error" && <p className="text-sm text-destructive">Une erreur est survenue.</p>}
      {status === "saved" && <p className="text-sm text-secondary-foreground">Profil enregistré.</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
