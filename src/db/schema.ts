import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    service: text("service").notNull(),
    serviceId: text("service_id"),
    /** Durée prévue de la prestation, figée au moment de la réservation (minutes). */
    minutes: integer("minutes").notNull().default(60),
    /** Prix de référence, figé au moment de la réservation (TND). */
    priceValue: integer("price_value").notNull().default(0),
    date: text("date").notNull(),
    time: text("time").notNull(),
    notes: text("notes"),
    status: text("status").notNull().default("pending"),
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("appointments_reference_key").on(t.reference),
    index("appointments_slot_idx").on(t.date, t.time),
    index("appointments_created_idx").on(t.createdAt),
    index("appointments_status_idx").on(t.status),
  ]
);

/** Paramètres d'exploitation du salon (ligne unique, id = 1). */
export const salonSettings = pgTable("salon_settings", {
  id: integer("id").primaryKey().default(1),
  /** Nombre de clientes traitées simultanément (fauteuils / postes). */
  maxParallel: integer("max_parallel").notNull().default(2),
  /** Marge de nettoyage entre deux clientes (minutes). */
  bufferMinutes: integer("buffer_minutes").notNull().default(10),
  /** Ouverture (minute de la journée). */
  openMinutes: integer("open_minutes").notNull().default(540),
  /** Fermeture (minute de la journée). */
  closeMinutes: integer("close_minutes").notNull().default(1140),
  /** Jours fermés, 0 = dimanche … 6 = samedi. */
  closedWeekdays: text("closed_weekdays").notNull().default("0"),
  /** E-mail du salon pour les alertes de nouvelle réservation. */
  notifyEmail: text("notify_email"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Alertes internes destinées à l'équipe du salon. */
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appointmentId: uuid("appointment_id"),
    type: text("type").notNull().default("new_booking"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    /** 0 = non lue */
    read: integer("read").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("notifications_read_idx").on(t.read, t.createdAt)]
);

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type SalonSettings = typeof salonSettings.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
