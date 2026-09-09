export type LegalSection = { heading: string; body: string[] };

export type LegalDoc = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

export const legalDocs: LegalDoc[] = [
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    eyebrow: "Informations éditeur",
    updated: "Janvier 2026",
    intro:
      "Les présentes mentions légales identifient l'éditeur du site et les conditions d'utilisation du service de réservation en ligne.",
    sections: [
      {
        heading: "Éditeur du site",
        body: [
          "Salon Salwa de Coiffure & d'Esthétique — entreprise individuelle exerçant une activité de coiffure et de soins esthétiques.",
          "Adresse : Rue Houcine Bouzaiene, à côté du Théâtre de l'Étoile du Nord, Centre-Ville, Tunis, Tunisie.",
          "Téléphone : +216 29 311 109.",
          "Le salon est joignable du lundi au samedi, de 9h00 à 19h00.",
        ],
      },
      {
        heading: "Objet du site",
        body: [
          "Le site présente les prestations du salon et permet aux clientes d'adresser une demande de rendez-vous en ligne.",
          "Toute demande transmise via le site constitue une simple sollicitation : elle ne vaut pas confirmation. Le rendez-vous n'est définitivement acquis qu'après confirmation téléphonique par l'équipe du salon.",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        body: [
          "L'ensemble des éléments composant le site (structure, textes, identité visuelle, photographies, animations) est protégé par le droit d'auteur.",
          "Toute reproduction, représentation ou adaptation, totale ou partielle, sans autorisation écrite préalable de l'éditeur est interdite.",
        ],
      },
      {
        heading: "Responsabilité",
        body: [
          "Les tarifs et durées affichés sont indicatifs et susceptibles d'évoluer. Un devis personnalisé est systématiquement confirmé avant toute prestation.",
          "L'éditeur ne saurait être tenu responsable des interruptions temporaires du service de réservation, notamment pour maintenance technique.",
        ],
      },
    ],
  },
  {
    slug: "confidentialite",
    title: "Politique de confidentialité",
    eyebrow: "Vos données personnelles",
    updated: "Janvier 2026",
    intro:
      "Nous recueillons uniquement les données strictement nécessaires à la gestion de vos rendez-vous. Cette politique explique ce que nous collectons, pourquoi, et quels sont vos droits.",
    sections: [
      {
        heading: "Données collectées",
        body: [
          "Lors d'une demande de rendez-vous : votre nom, votre numéro de téléphone, la prestation souhaitée, la date et l'heure, ainsi que les précisions que vous choisissez de nous transmettre.",
          "Nous ne demandons jamais de données bancaires : aucun paiement n'est effectué en ligne.",
        ],
      },
      {
        heading: "Finalité et base légale",
        body: [
          "Ces données servent exclusivement à vous contacter pour confirmer votre rendez-vous, à organiser le planning du salon et à assurer le suivi de la relation commerciale.",
          "Le traitement repose sur votre consentement, matérialisé par l'envoi volontaire du formulaire de réservation.",
        ],
      },
      {
        heading: "Durée de conservation",
        body: [
          "Les demandes de rendez-vous sont conservées pendant une durée n'excédant pas vingt-quatre mois à compter du dernier contact, puis supprimées.",
        ],
      },
      {
        heading: "Destinataires",
        body: [
          "Seule l'équipe du Salon Salwa accède à ces informations, via un espace d'administration protégé par mot de passe.",
          "Aucune donnée n'est vendue, louée ou transmise à des tiers à des fins commerciales.",
        ],
      },
      {
        heading: "Vos droits",
        body: [
          "Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression des données vous concernant.",
          "Vous pouvez exercer ces droits en nous appelant au +216 29 311 109 ou directement au salon. Vous pouvez également annuler librement un rendez-vous depuis la rubrique « Retrouver ou annuler ma demande » du site.",
          "Conformément à la loi n° 2004-63 relative à la protection des données à caractère personnel, vous pouvez saisir l'Autorité de protection des données personnelles (INPDP) en cas de litige.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "Le site ne dépose aucun cookie publicitaire ni traceur tiers. Seuls des éléments techniques strictement nécessaires au fonctionnement de l'interface sont utilisés, conservés temporairement dans votre navigateur.",
        ],
      },
    ],
  },
  {
    slug: "cgv",
    title: "Conditions générales de vente",
    eyebrow: "Prestations du salon",
    updated: "Janvier 2026",
    intro:
      "Les présentes conditions régissent les prestations de coiffure et d'esthétique réalisées au Salon Salwa, ainsi que l'utilisation du service de réservation en ligne.",
    sections: [
      {
        heading: "1. Réservation",
        body: [
          "La demande formulée en ligne n'emporte pas confirmation. Celle-ci est apportée par un rappel téléphonique de l'équipe du salon, dans la mesure du possible dans la journée.",
          "Une référence à cinq caractères est attribuée à chaque demande afin d'en faciliter le suivi. Elle ne constitue pas un titre de paiement.",
        ],
      },
      {
        heading: "2. Tarifs",
        body: [
          "Les tarifs sont exprimés en dinars tunisiens (TND) et indiqués « à partir de » pour les prestations dont le coût dépend de la longueur, de l'épaisseur ou de l'état des cheveux.",
          "Le montant définitif est annoncé à la cliente et recueille son accord avant le début de la prestation.",
        ],
      },
      {
        heading: "3. Annulation",
        body: [
          "L'annulation est gratuite et possible à tout moment, soit depuis le site, soit par téléphone.",
          "Nous remercions les clientes de prévenir le salon au plus tôt en cas d'empêchement, afin de libérer le créneau pour une autre cliente.",
        ],
      },
      {
        heading: "4. Déroulement des prestations",
        body: [
          "Chaque prestation débute par un diagnostic offert afin d'adapter les soins à la nature des cheveux et de la peau.",
          "Les prestations sont réalisées avec des produits professionnels sélectionnés par le salon.",
        ],
      },
      {
        heading: "5. Responsabilité",
        body: [
          "Il appartient à la cliente de signaler, avant la prestation, toute allergie, sensibilité particulière ou contre-indication médicale.",
          "Le salon décline toute responsabilité en cas de déclaration omise ou inexacte.",
        ],
      },
      {
        heading: "6. Litiges",
        body: [
          "Tout différend relatif à l'interprétation ou à l'exécution des présentes conditions est soumis au droit tunisien.",
        ],
      },
    ],
  },
];

export function findLegalDoc(slug: string) {
  return legalDocs.find((d) => d.slug === slug);
}
