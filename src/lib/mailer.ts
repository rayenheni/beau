import { SALON } from "./booking";

type MailPayload = { subject: string; text: string };

/**
 * Envoi d'e-mail optionnel via l'API Resend.
 * Sans RESEND_API_KEY, MAIL_FROM et MAIL_TO, la fonction ne fait rien et ne
 * renvoie aucune erreur : le site reste pleinement fonctionnel sans fournisseur.
 */
export async function sendMail({ subject, text }: MailPayload): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;

  if (!key || !from || !to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    return res.ok;
  } catch {
    // Ne jamais faire échouer une réservation à cause d'un e-mail.
    return false;
  }
}

export function bookingAlertText(opts: {
  reference: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  minutes: number;
  notes?: string | null;
}) {
  return [
    "NOUVELLE DEMANDE DE RENDEZ-VOUS",
    "",
    `Référence  : ${opts.reference}`,
    `Cliente    : ${opts.name}`,
    `Téléphone  : ${opts.phone}`,
    `Prestation : ${opts.service} (${opts.minutes} min)`,
    `Date       : ${opts.date} à ${opts.time}`,
    opts.notes ? `Précisions : ${opts.notes}` : null,
    "",
    `Confirmez ce rendez-vous dans votre espace pro.`,
    "",
    `${SALON.name} — ${SALON.phoneDisplay}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
