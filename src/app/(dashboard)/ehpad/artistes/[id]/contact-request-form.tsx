"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendContactRequestAction } from "./actions";
import { contactRequestSchema } from "@/lib/validations/contact-request";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

type FormValues = z.infer<typeof contactRequestSchema>;

export function ContactRequestForm({ artistProfileId }: { artistProfileId: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(contactRequestSchema),
    defaultValues: { artistProfileId, message: "" },
  });

  async function onSubmit(values: FormValues) {
    const result = await sendContactRequestAction(values);
    if (!result.error) reset({ artistProfileId, message: "" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <input type="hidden" {...register("artistProfileId")} />
      <FormField label="Votre message" htmlFor="message" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={4}
          placeholder="Décrivez votre projet d'animation, la date envisagée, le contexte…"
          {...register("message")}
        />
      </FormField>
      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Envoi…" : "Envoyer la demande"}
      </Button>
      {isSubmitSuccessful && (
        <p className="text-sm text-secondary-foreground">Demande envoyée avec succès.</p>
      )}
    </form>
  );
}
