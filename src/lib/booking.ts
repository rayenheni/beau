export const SALON = {
  name: "Salon Salwa de Coiffure & d'Esthétique",
  phone: "+21629311109",
  phoneDisplay: "+216 29 311 109",
  phoneLocal: "21629311109",
  address: "Rue Houcine Bouzaiene, à côté du Théâtre de l'Étoile du Nord, Centre-Ville, Tunis",
};

export const BOOKING_EVENT = "salwa:booking";

export function requestBooking(serviceId?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BOOKING_EVENT, { detail: { serviceId: serviceId ?? null } }));
  const el = document.getElementById("reservation");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function whatsappLink(text: string) {
  return `https://wa.me/${SALON.phoneLocal}?text=${encodeURIComponent(text)}`;
}

export function formatFrDate(date: string) {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m}`;
}

/** iCalendar file so clients can add the appointment to their own calendar. */
export function buildIcs(opts: {
  reference: string;
  service: string;
  date: string;
  time: string;
  minutes: number;
}) {
  const [h, m] = opts.time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  const start = new Date(`${opts.date}T${opts.time}:00`);
  const end = new Date(start.getTime() + opts.minutes * 60000);
  const stamp = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(
      d.getHours()
    ).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Salon Salwa//Reservation//FR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${opts.reference}@salonsalwa.tn`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${opts.service} — ${SALON.name}`,
    `LOCATION:${SALON.address}`,
    `DESCRIPTION:Référence ${opts.reference} · Réservation en ligne Salon Salwa · ${SALON.phoneDisplay}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(opts: {
  reference: string;
  service: string;
  date: string;
  time: string;
  minutes: number;
}) {
  const ics = buildIcs(opts);
  if (!ics || typeof window === "undefined") return;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `salon-salwa-${opts.reference}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
