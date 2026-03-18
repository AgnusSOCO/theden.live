import { trackEvent } from "./useAnalytics";

/**
 * Checkout utility — creates Stripe Checkout Session via API and redirects.
 */

/**
 * Create a Stripe Checkout Session and redirect to payment.
 * Calls the /api/create-checkout serverless function.
 */
export async function goToCheckout(plan, email = "") {
  trackEvent("checkout_initiated", {
    plan_id: plan.id,
    plan_name: plan.name,
    plan_price: plan.price,
  });

  try {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: plan.id,
        email: email || undefined,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Checkout error:", data.error);
      alert("Something went wrong creating your checkout session. Please try again.");
    }
  } catch (err) {
    console.error("Checkout fetch error:", err);
    alert("Unable to connect to payment system. Please try again.");
  }
}

/**
 * Scroll to pricing section — used by CTAs throughout the page.
 */
export function scrollToPricing() {
  const el = document.getElementById("pricing");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
