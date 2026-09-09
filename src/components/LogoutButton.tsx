"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await fetch("/api/admin/session", { method: "DELETE" }).catch(() => undefined);
        router.replace("/admin/login");
        router.refresh();
      }}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-espresso/15 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-espresso/60 transition-colors hover:border-rose-300 hover:text-rose-600 disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
      Quitter
    </button>
  );
}
