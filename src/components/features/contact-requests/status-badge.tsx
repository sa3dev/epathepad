import { Badge } from "@/components/ui/badge";
import type { ContactRequestStatus } from "@/lib/types";

const LABELS: Record<ContactRequestStatus, string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  DECLINED: "Déclinée",
};

const VARIANTS: Record<ContactRequestStatus, "pending" | "success" | "destructive"> = {
  PENDING: "pending",
  ACCEPTED: "success",
  DECLINED: "destructive",
};

export function StatusBadge({ status }: { status: ContactRequestStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
