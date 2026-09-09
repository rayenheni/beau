"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Download, Printer } from "lucide-react";
import type { AdminRow } from "@/app/admin/page";
import { SALON, formatFrDate } from "@/lib/booking";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  done: "Terminée",
  cancelled: "Annulée",
};

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Tunis" });
}

function escCsv(v: unknown) {
  const s = String(v ?? "");
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: AdminRow[]) {
  const head = [
    "Référence",
    "Cliente",
    "Téléphone",
    "Prestation",
    "Date",
    "Heure",
    "Durée (min)",
    "Prix (TND)",
    "Statut",
    "Message",
  ];
  const lines = rows.map((r) =>
    [
      r.reference,
      r.name,
      r.phone,
      r.service,
      r.date,
      r.time,
      r.minutes,
      r.priceValue,
      STATUS_LABEL[r.status] ?? r.status,
      r.notes ?? "",
    ]
      .map(escCsv)
      .join(";")
  );
  // \ufeff = BOM pour qu'Excel ouvre correctement les accents.
  return "\ufeff" + [head.join(";"), ...lines].join("\r\n");
}

function escHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSheetHtml(title: string, rows: AdminRow[]) {
  const trs = rows
    .map(
      (r) => `<tr>
        <td><strong>${escHtml(r.time)}</strong></td>
        <td>${escHtml(r.name)}<br><small>${escHtml(r.phone)}</small></td>
        <td>${escHtml(r.service)}</td>
        <td>${escHtml(r.reference)}</td>
        <td>${escHtml(STATUS_LABEL[r.status] ?? r.status)}</td>
        <td><span class="box"></span></td>
      </tr>`
    )
    .join("");
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>${escHtml(title)}</title>
<style>
  body{font-family:Georgia,serif;color:#211710;margin:32px}
  h1{font-size:22px;margin:0} p.sub{color:#8a7360;font-size:13px;margin:6px 0 20px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;text-transform:uppercase;font-size:10px;letter-spacing:.12em;color:#8a7360;border-bottom:2px solid #211710;padding:8px}
  td{border-bottom:1px solid #e2d3bd;padding:8px;vertical-align:top}
  .box{display:inline-block;width:12px;height:12px;border:1.5px solid #211710;border-radius:3px}
  small{color:#8a7360}
  @media print{body{margin:0}}
</style></head><body>
<h1>${escHtml(title)}</h1>
<p class="sub">${escHtml(SALON.name)} — ${rows.length} rendez-vous</p>
<table><thead><tr><th>Heure</th><th>Cliente</th><th>Prestation</th><th>Réf</th><th>Statut</th><th>Venue ✓</th></tr></thead>
<tbody>${trs || '<tr><td colspan="6">Aucun rendez-vous.</td></tr>'}</tbody></table>
<script>window.onload=()=>{window.print()}<\/script>
</body></html>`;
}

export default function AdminExport({ rows }: { rows: AdminRow[] }) {
  const [day, setDay] = useState(todayKey());
  const [scope, setScope] = useState<"day" | "all">("day");

  const filtered = useMemo(() => {
    const list = scope === "day" ? rows.filter((r) => r.date === day) : [...rows];
    return [...list].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [rows, day, scope]);

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${SALON.slug}-rdv-${scope === "day" ? day : "tout"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function printSheet() {
    const title =
      scope === "day" ? `Planning du ${formatFrDate(day)}` : "Planning complet";
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) {
      alert("Veuillez autoriser les fenêtres pop-up pour imprimer la fiche du jour.");
      return;
    }
    w.document.write(buildSheetHtml(title, filtered));
    w.document.close();
  }

  return (
    <div className="mt-6 rounded-2xl border border-espresso/8 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-espresso/45">
            <CalendarDays className="h-4 w-4 text-bronze" />
            Export &amp; fiche du jour
          </p>
          <p className="mt-1.5 text-sm text-espresso/60">
            {filtered.length} rendez-vous sélectionné{filtered.length > 1 ? "s" : ""}
            {scope === "day" && ` · ${formatFrDate(day)}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-espresso/12 bg-ivory p-1">
            {(["day", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  scope === s ? "bg-espresso text-ivory" : "text-espresso/55 hover:text-espresso"
                }`}
              >
                {s === "day" ? "Jour" : "Tout"}
              </button>
            ))}
          </div>
          {scope === "day" && (
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value || todayKey())}
              aria-label="Jour à exporter"
              className="rounded-full border border-espresso/12 bg-ivory px-4 py-2 text-xs font-semibold text-espresso outline-none focus:border-bronze"
            />
          )}
          <button
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-espresso/15 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-espresso transition-colors enabled:hover:border-bronze enabled:hover:text-bronze disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            CSV (Excel)
          </button>
          <button
            onClick={printSheet}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ivory transition-colors enabled:hover:bg-bronze disabled:opacity-40"
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
}
