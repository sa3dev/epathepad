"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { addMediaAction, deleteMediaAction } from "./actions";
import { Button } from "@/components/ui/button";
import type { Media } from "@/lib/types";

export function MediaUploader({ initialMedia }: { initialMedia: Media[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const presignResponse = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type }),
      });
      if (!presignResponse.ok) throw new Error("presign failed");
      const { uploadUrl, publicUrl } = await presignResponse.json();

      const putResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putResponse.ok) throw new Error("upload failed");

      const type = file.type.startsWith("video") ? "VIDEO" : "IMAGE";
      const result = await addMediaAction({ url: publicUrl, type });
      if (result.error) throw new Error(result.error);

      setMedia((prev) => [...prev, { id: publicUrl, artistProfileId: "", url: publicUrl, type, order: prev.length, createdAt: new Date() }]);
    } catch {
      setError("Échec de l'envoi du fichier.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    setMedia((prev) => prev.filter((item) => item.id !== id));
    await deleteMediaAction(id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {media.map((item) => (
          <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg border border-border">
            {item.type === "IMAGE" ? (
              <Image src={item.url} alt="" fill className="object-cover" unoptimized />
            ) : (
              <video src={item.url} className="h-full w-full object-cover" muted />
            )}
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
            >
              Suppr.
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          onChange={handleFileChange}
          className="hidden"
          id="media-input"
        />
        <label htmlFor="media-input">
          <Button
            type="button"
            variant="secondary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Envoi…" : "Ajouter une photo ou vidéo"}
          </Button>
        </label>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
