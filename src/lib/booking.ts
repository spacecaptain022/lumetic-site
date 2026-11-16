/*
 * Booking a call runs on a Google Calendar appointment schedule.
 * Set NEXT_PUBLIC_BOOKING_URL to the schedule's full booking page URL
 * (https://calendar.google.com/calendar/appointments/schedules/…). Until it is set,
 * /book returns 404 and every "Book a call" link stays hidden.
 */

const RAW = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ?? "";

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
