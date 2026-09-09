const words = [
  "Balayage",
  "Lissage Kératine",
  "Chignon de Mariée",
  "Maquillage",
  "Soin du Visage",
  "Manucure",
  "Botox Capillaire",
  "Ombré Hair",
  "Épilation",
  "Brow Lift",
];

export default function Marquee() {
  const row = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-espresso/10 bg-espresso py-4 text-ivory">
      <div className="animate-marquee flex w-max items-center">
        {row.map((w, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap text-xs font-semibold uppercase tracking-[0.3em]"
          >
            {w}
            <span aria-hidden className="mx-8 inline-block h-1.5 w-1.5 rotate-45 bg-bronze-light" />
          </span>
        ))}
      </div>
    </div>
  );
}
