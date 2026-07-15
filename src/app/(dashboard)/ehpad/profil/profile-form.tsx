"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { saveEhpadProfileAction } from "./actions";
import { ehpadProfileSchema } from "@/lib/validations/profiles";
import { REGIONS } from "@/lib/constants/regions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import type { EhpadProfile } from "@/lib/types";

type FormValues = z.infer<typeof ehpadProfileSchema>;

export function EhpadProfileForm({ profile }: { profile: EhpadProfile | null }) {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(ehpadProfileSchema),
    defaultValues: {
      facilityName: profile?.facilityName ?? "",
      address: profile?.address ?? "",
      city: profile?.city ?? "",
      postalCode: profile?.postalCode ?? "",
      region: (profile?.region as FormValues["region"]) ?? REGIONS[0],
      description: profile?.description ?? "",
      contactPhone: profile?.contactPhone ?? "",
      contactEmail: profile?.contactEmail ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveEhpadProfileAction(values);
    setStatus(result.error ? "error" : "saved");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Nom de l'établissement" htmlFor="facilityName" error={errors.facilityName?.message}>
        <Input id="facilityName" {...register("facilityName")} />
      </FormField>

      <FormField label="Adresse" htmlFor="address" error={errors.address?.message}>
        <Input id="address" {...register("address")} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ville" htmlFor="city" error={errors.city?.message}>
          <Input id="city" {...register("city")} />
        </FormField>
        <FormField label="Code postal" htmlFor="postalCode" error={errors.postalCode?.message}>
          <Input id="postalCode" {...register("postalCode")} />
        </FormField>
      </div>

      <FormField label="Région" htmlFor="region" error={errors.region?.message}>
        <Select id="region" {...register("region")}>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" rows={4} {...register("description")} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Téléphone" htmlFor="contactPhone" error={errors.contactPhone?.message}>
          <Input id="contactPhone" {...register("contactPhone")} />
        </FormField>
        <FormField label="Email de contact" htmlFor="contactEmail" error={errors.contactEmail?.message}>
          <Input id="contactEmail" type="email" {...register("contactEmail")} />
        </FormField>
      </div>

      {status === "error" && <p className="text-sm text-destructive">Une erreur est survenue.</p>}
      {status === "saved" && <p className="text-sm text-secondary-foreground">Profil enregistré.</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
