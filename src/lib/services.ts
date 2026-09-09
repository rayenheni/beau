export type CategoryId = "coiffure" | "esthetique" | "mariee";

export type CatalogService = {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceValue: number;
  minutes: number;
  category: CategoryId;
  image: string;
  tags: string[];
};

export const categories: { id: CategoryId; label: string; sub: string }[] = [
  { id: "coiffure", label: "Coiffure", sub: "Coupe, couleur, soin" },
  { id: "esthetique", label: "Esthétique", sub: "Visage, makeup, mains" },
  { id: "mariee", label: "Mariées", sub: "Le grand jour" },
];

export const catalog: CatalogService[] = [
  {
    id: "brushing",
    name: "Brushing & coiffage",
    desc: "Mise en forme lisse, wavy ou bouclée, finition miroir",
    price: "25 DT",
    priceValue: 25,
    minutes: 45,
    category: "coiffure",
    image: "/images/service-coiffure.jpg",
    tags: ["styling", "express", "shine"],
  },
  {
    id: "coupe",
    name: "Coupe signature",
    desc: "Coupe sur-mesure adaptée à la morphologie du visage",
    price: "50 DT",
    priceValue: 50,
    minutes: 60,
    category: "coiffure",
    image: "/images/service-coiffure.jpg",
    tags: ["cut"],
  },
  {
    id: "coloration",
    name: "Coloration complète",
    desc: "Couleur de la racine aux pointes, couvrance parfaite",
    price: "dès 100 DT",
    priceValue: 100,
    minutes: 120,
    category: "coiffure",
    image: "/images/hair-color.jpg",
    tags: ["color", "grey"],
  },
  {
    id: "balayage",
    name: "Balayage & mèches",
    desc: "Éclaircissement naturel, effet retour de vacances",
    price: "dès 150 DT",
    priceValue: 150,
    minutes: 150,
    category: "coiffure",
    image: "/images/hair-color.jpg",
    tags: ["color", "light", "shine"],
  },
  {
    id: "ombre",
    name: "Ombré hair & AirTouch",
    desc: "Dégradé lumineux haute précision, sans ligne marquée",
    price: "dès 220 DT",
    priceValue: 220,
    minutes: 180,
    category: "coiffure",
    image: "/images/hair-color.jpg",
    tags: ["color", "light"],
  },
  {
    id: "keratine",
    name: "Lissage à la kératine",
    desc: "Cheveux lisses, souples et brillants jusqu'à 6 mois",
    price: "dès 300 DT",
    priceValue: 300,
    minutes: 180,
    category: "coiffure",
    image: "/images/service-coiffure.jpg",
    tags: ["smooth", "frizz", "damage"],
  },
  {
    id: "botox",
    name: "Botox capillaire",
    desc: "Soin régénérant profond, anti-frisottis longue durée",
    price: "dès 180 DT",
    priceValue: 180,
    minutes: 120,
    category: "coiffure",
    image: "/images/service-coiffure.jpg",
    tags: ["care", "damage", "dry", "shine"],
  },
  {
    id: "chignon",
    name: "Chignon soirée",
    desc: "Attaches raffinées, tresses et coiffures d'événement",
    price: "dès 80 DT",
    priceValue: 80,
    minutes: 60,
    category: "coiffure",
    image: "/images/bride.jpg",
    tags: ["event", "updo"],
  },

  {
    id: "soin-visage",
    name: "Soin du visage éclat",
    desc: "Nettoyage profond, exfoliation & masque hydratant",
    price: "dès 70 DT",
    priceValue: 70,
    minutes: 60,
    category: "esthetique",
    image: "/images/service-esthetique.jpg",
    tags: ["skin", "glow", "care"],
  },
  {
    id: "maquillage-jour",
    name: "Maquillage jour",
    desc: "Teint frais et lumineux pour le quotidien",
    price: "40 DT",
    priceValue: 40,
    minutes: 45,
    category: "esthetique",
    image: "/images/makeup.jpg",
    tags: ["makeup", "express"],
  },
  {
    id: "maquillage-soiree",
    name: "Maquillage soirée",
    desc: "Regard intense et teint parfait longue tenue",
    price: "80 DT",
    priceValue: 80,
    minutes: 60,
    category: "esthetique",
    image: "/images/makeup.jpg",
    tags: ["makeup", "event"],
  },
  {
    id: "brow",
    name: "Brow lift & teinture",
    desc: "Sourcils restructurés, disciplinés et redessinés",
    price: "40 DT",
    priceValue: 40,
    minutes: 30,
    category: "esthetique",
    image: "/images/makeup.jpg",
    tags: ["brow", "express"],
  },
  {
    id: "epilation",
    name: "Épilation visage & corps",
    desc: "Cire douce, peau satinée, gestes délicats",
    price: "dès 15 DT",
    priceValue: 15,
    minutes: 30,
    category: "esthetique",
    image: "/images/service-esthetique.jpg",
    tags: ["epilation", "express"],
  },
  {
    id: "manucure",
    name: "Manucure & semi-permanent",
    desc: "Soin des mains, forme parfaite & vernis longue tenue",
    price: "dès 30 DT",
    priceValue: 30,
    minutes: 45,
    category: "esthetique",
    image: "/images/nails.jpg",
    tags: ["nails"],
  },
  {
    id: "pedicure",
    name: "Pédicure spa",
    desc: "Rituel pieds exfoliant, massage & vernis",
    price: "dès 35 DT",
    priceValue: 35,
    minutes: 60,
    category: "esthetique",
    image: "/images/nails.jpg",
    tags: ["nails", "care"],
  },

  {
    id: "formule-mariee",
    name: "Formule Mariée — mise en beauté complète",
    desc: "Coiffure, maquillage et essai inclus pour le grand jour",
    price: "dès 350 DT",
    priceValue: 350,
    minutes: 240,
    category: "mariee",
    image: "/images/bride.jpg",
    tags: ["bridal", "event", "updo", "makeup"],
  },
  {
    id: "essai-mariee",
    name: "Essai coiffure & maquillage mariée",
    desc: "Essayages et ajustements avant les festivités",
    price: "150 DT",
    priceValue: 150,
    minutes: 120,
    category: "mariee",
    image: "/images/bride.jpg",
    tags: ["bridal"],
  },
  {
    id: "cortege",
    name: "Mise en beauté invitée / cortège",
    desc: "Pour la famille, les proches et les témoins",
    price: "120 DT",
    priceValue: 120,
    minutes: 90,
    category: "mariee",
    image: "/images/makeup.jpg",
    tags: ["event", "makeup"],
  },
];

export const coiffureServices = catalog.filter((s) => s.category === "coiffure");
export const esthetiqueServices = catalog.filter((s) => s.category === "esthetique");

export function findService(id: string | null | undefined) {
  return catalog.find((s) => s.id === id);
}

export const SLOT_CAPACITY = 3;

export function allSlots() {
  const slots: string[] = [];
  for (let h = 9; h <= 19; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h !== 19) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}
