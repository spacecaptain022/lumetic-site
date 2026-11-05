/** Lets any CTA on the page pre-select a service or seed the message in the contact form. */
export type ContactPrefill = { service?: string; message?: string };

export const CONTACT_PREFILL_EVENT = "lumetic:contact-prefill";

export function prefillContact(detail: ContactPrefill) {
  window.dispatchEvent(new CustomEvent<ContactPrefill>(CONTACT_PREFILL_EVENT, { detail }));
}

/** For links from other pages, where the form is not mounted yet. */
export function contactHref(prefill: ContactPrefill) {
  const params = new URLSearchParams();
  if (prefill.service) params.set("service", prefill.service);
  if (prefill.message) params.set("message", prefill.message);
  const query = params.toString();
  return `/${query ? `?${query}` : ""}#contact`;
}
