import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "pending" | "destructive";

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  default: "tag-neutral",
  success: "tag-accent-2",
  pending: "tag-accent",
  destructive: "tag-destructive",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return <span className={cn("tag", VARIANT_CLASS[variant], className)} {...props} />;
}
