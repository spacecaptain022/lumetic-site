/*
 * Booking a call runs on the "Call with Lumetic" appointment schedule in
 * preston@lumetic.io's Google Calendar. NEXT_PUBLIC_BOOKING_URL can point it at another
 * schedule. Set either to "" and /book returns 404 and every "Book a call" link hides.
 */

const SCHEDULE_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ278GheWQLCOc-Ke0ZItL1FX3Pz73Yu0oeTK5chcWk1KkqOAKZ-Muo1lyQ3vRO0XQxjwJFv5aZA";

const RAW = (process.env.NEXT_PUBLIC_BOOKING_URL ?? SCHEDULE_URL).trim();

export const BOOKING_PATH = "/book";

/** The schedule's booking page, or "" when booking is off. */
export const BOOKING_URL = /^https:\/\/calendar\.google\.com\//.test(RAW) ? RAW : "";

export const isBookingEnabled = () => BOOKING_URL !== "";

/** The same page in Google's embed mode (no Google header, made for an iframe). */
export function bookingEmbedUrl() {
  if (!BOOKING_URL) return "";
  const url = new URL(BOOKING_URL);
  url.searchParams.set("gv", "true");
  return url.toString();
}
