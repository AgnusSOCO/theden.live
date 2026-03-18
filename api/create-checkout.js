/**
 * /api/create-checkout — Vercel serverless function
 * Creates a Stripe Checkout Session and returns the URL.
 *
 * POST body: { planId: "monthly" | "quarterly" | "lifetime" }
 */

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

const PLANS = {
  monthly: {
    product: "prod_UAnlirp6Ddkjwt",
    name: "The Den — Monthly",
    amount: 4900, // $49.00
    currency: "usd",
    mode: "subscription",
    interval: "month",
    interval_count: 1,
  },
  quarterly: {
    product: "prod_UAnmGiznrjRc2k",
    name: "The Den — Quarterly",
    amount: 9900, // $99.00
    currency: "usd",
    mode: "subscription",
    interval: "month",
    interval_count: 3,
  },
  lifetime: {
    product: "prod_UAnmuP5gjS1Cbw",
    name: "The Den — Lifetime",
    amount: 29900, // $299.00
    currency: "usd",
    mode: "payment",
  },
};

const DOMAIN = process.env.DOMAIN || "https://theden.live";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { planId, email } = req.body || {};
    const plan = PLANS[planId];

    if (!plan) {
      return res.status(400).json({ error: "Invalid plan. Use: monthly, quarterly, or lifetime" });
    }

    // Build Stripe Checkout Session payload
    const params = new URLSearchParams();
    params.append("success_url", `${DOMAIN}/thank-you?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${DOMAIN}/#pricing`);
    params.append("mode", plan.mode);

    if (email) {
      params.append("customer_email", email);
    }

    // Use inline price_data (no pre-created price needed)
    if (plan.mode === "subscription") {
      params.append("line_items[0][price_data][product]", plan.product);
      params.append("line_items[0][price_data][unit_amount]", plan.amount);
      params.append("line_items[0][price_data][currency]", plan.currency);
      params.append("line_items[0][price_data][recurring][interval]", plan.interval);
      params.append("line_items[0][price_data][recurring][interval_count]", plan.interval_count);
      params.append("line_items[0][quantity]", "1");
    } else {
      // one-time payment
      params.append("line_items[0][price_data][product]", plan.product);
      params.append("line_items[0][price_data][unit_amount]", plan.amount);
      params.append("line_items[0][price_data][currency]", plan.currency);
      params.append("line_items[0][quantity]", "1");
    }

    // Allow promotion codes
    params.append("allow_promotion_codes", "true");

    // Collect billing address
    params.append("billing_address_collection", "auto");

    // Metadata
    params.append("metadata[plan]", planId);
    params.append("metadata[source]", "theden.live");

    // Create Checkout Session via Stripe API
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await response.json();

    if (session.error) {
      console.error("Stripe error:", session.error);
      return res.status(400).json({ error: session.error.message });
    }

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
