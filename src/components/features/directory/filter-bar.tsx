"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DISCIPLINES, DISCIPLINE_LABELS } from "@/lib/constants/disciplines";
import { REGIONS } from "@/lib/constants/regions";
import { Select } from "@/components/ui/select";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/ehpad/artistes?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        defaultValue={searchParams.get("discipline") ?? ""}
        onChange={(event) => updateParam("discipline", event.target.value)}
        className="max-w-xs"
      >
        <option value="">Toutes les disciplines</option>
        {DISCIPLINES.map((discipline) => (
          <option key={discipline} value={discipline}>
            {DISCIPLINE_LABELS[discipline]}
          </option>
        ))}
      </Select>
      <Select
        defaultValue={searchParams.get("region") ?? ""}
        onChange={(event) => updateParam("region", event.target.value)}
        className="max-w-xs"
      >
        <option value="">Toutes les régions</option>
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </Select>
    </div>
  );
}
