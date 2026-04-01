import { redirect } from "next/navigation";

/** About route disabled for now — remove redirect when the page ships. */
export default function About() {
  redirect("/");
}
