import { useSyncExternalStore } from "react";

/*
 * The home page's logo intro tells the hero when to make its entrance.
 * An inline script sets <html data-intro="play"> before first paint only when the intro
 * should run (first visit this session, motion allowed); every other case counts as done.
 */

let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return done || document.documentElement.dataset.intro !== "play";
}

/** True once the intro has handed off (or was never going to play). */
export function useIntroDone() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
