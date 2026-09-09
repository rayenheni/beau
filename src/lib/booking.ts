import { SALON } from "./salon";

/** Re-export : les composants importent la config depuis "@/lib/booking" ou "@/lib/salon". */
export { SALON };

export const BOOKING_EVENT = "salon:booking";

export function requestBooking(serviceId?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BOOKING_EVENT, { detail: { serviceId: serviceId ?? null } }));
  const el = document.getElementById("reservation");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Lien WhatsApp vers le salon avec message pré-rempli. */
export function whatsappLink(text: string) {
  return `https://wa.me/${SALON.phoneWhatsApp}?text=${encodeURIComponent(text)}`;
}

/** Lien WhatsApp vers une cliente (rappel manuel depuis l'espace pro). */
export function clientWhatsAppLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Message de rappel J-1 / confirmation, envoyé en 1 clic depuis l'espace pro. */
export function buildReminderText(opts: {
  name: string;
  service: string;
  date: string;
  time: string;
  reference: string;
}) {
  const first = opts.name.trim().split(/\s+/)[0] || opts.name;
  return [
    `Bonjour ${first} 👋`,
    `Petit rappel de votre rendez-vous ${SALON.shortName} :`,
    `• ${opts.service}`,
    `• ${formatFrDate(opts.date)} à ${opts.time}`,
    `Réf : ${opts.reference}`,
    `Merci de nous prévenir en cas d'empêchement 🙏`,
  ].join("\n");
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
    `PRODID:-//${SALON.shortName}//Reservation//FR`,
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${opts.reference}@${SALON.domain}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${opts.service} — ${SALON.name}`,
    `LOCATION:${SALON.address}`,
    `DESCRIPTION:Référence ${opts.reference} · Réservation en ligne ${SALON.name} · ${SALON.phoneDisplay}`,
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
  a.download = `${SALON.slug}-${opts.reference}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
