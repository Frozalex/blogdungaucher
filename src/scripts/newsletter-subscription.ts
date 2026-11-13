import { trackEngagement } from "./engagement";

export type NewsletterSubscription = { email: string; website: string; elapsedMs: number };
const placements = new Set(["footer", "article", "article-science", "article-esprit", "article-societe", "article-grand-oral", "letter-example"]);

/** A successful response means server acceptance, not proof of email ownership. */
export async function requestNewsletterSubscription(
  endpoint: string,
  subscription: NewsletterSubscription,
  placement: string,
  dependencies: { send: typeof fetch; track: typeof trackEngagement } = { send: fetch, track: trackEngagement },
) {
  const response = await dependencies.send(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  if (!response.ok) throw new Error("Newsletter request rejected");
  // Never pass the address, page title, URL, or any user-entered text to analytics.
  dependencies.track("newsletter_confirmed", { placement: placements.has(placement) ? placement : "article" });
}
