import { trackEvent } from "./useAnalytics";

/**
 * Checkout utility — handles routing to Stripe Checkout.
 *
 * Usage:
 *   import { goToCheckout } from "../hooks/useCheckout";
 *   goToCheckout(plan);
 *
 * To configure:
 *   1. Create Stripe Payment Links at https://dashboard.stripe.com/payment-links
 *   2. Replace the URLs in Pricing.jsx with your actual links
 *   3. Optionally, use Stripe Checkout Sessions via your API for more control
 */

/**
 * Redirect to Stripe Payment Link for the given plan.
 * Appends prefilled email if provided.
 */
export function goToCheckout(plan, email = "") {
  trackEvent("checkout_initiated", {
    plan_id: plan.id,
    plan_name: plan.name,
    plan_price: plan.price,
  });

  let url = plan.checkoutUrl;

  // Append prefilled email if available
  if (email) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}prefilled_email=${encodeURIComponent(email)}`;
  }

  // Open Stripe checkout
  window.location.href = url;
}

/**
 * For more advanced Stripe Checkout Sessions (server-side):
 * 1. Create an API endpoint at /api/create-checkout-session
 * 2. Call it with the plan info
 * 3. Redirect to the returned session URL
 *
 * Example:
 *   export async function createCheckoutSession(planId, email) {
 *     const res = await fetch("/api/create-checkout-session", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ planId, email }),
 *     });
 *     const { url } = await res.json();
 *     window.location.href = url;
 *   }
 */

/**
 * Scroll to pricing section — used by CTAs throughout the page.
 */
export function scrollToPricing() {
  const el = document.getElementById("pricing");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
