"use client";

import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { SALON, requestBooking, whatsappLink } from "@/lib/booking";

export default function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[96] border-t border-espresso/10 bg-ivory/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-3 gap-2">
        <a
          href={`tel:${SALON.phone}`}
          className="flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-espresso/70 transition-colors active:bg-cream"
        >
          <Phone className="h-4.5 w-4.5 text-bronze" />
          Appeler
        </a>
        <a
          href={whatsappLink(`Bonjour ${SALON.shortName} 👋 je souhaite des informations.`)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-espresso/70 transition-colors active:bg-cream"
        >
          <MessageCircle className="h-4.5 w-4.5 text-bronze" />
          WhatsApp
        </a>
        <button
          onClick={() => requestBooking()}
          className="flex flex-col items-center gap-1 rounded-xl bg-espresso py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ivory transition-colors active:bg-bronze"
        >
          <CalendarCheck className="h-4.5 w-4.5" />
          Réserver
        </button>
      </div>
    </div>
  );
}
