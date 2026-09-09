"use client";

import { ArrowRight } from "lucide-react";
import { requestBooking } from "@/lib/booking";

export default function BookButton({
  serviceId,
  label = "Réserver",
  variant = "dark",
  className = "",
}: {
  serviceId?: string;
  label?: string;
  variant?: "dark" | "light";
  className?: string;
}) {
  const base =
    "group inline-flex items-center gap-3 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300";
  const styles =
    variant === "dark"
      ? "bg-espresso text-ivory hover:bg-bronze"
      : "bg-ivory text-espresso hover:bg-bronze hover:text-ivory";

  return (
    <button onClick={() => requestBooking(serviceId)} className={`${base} ${styles} ${className}`}>
      {label}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}
