export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"method_not_allowed" });

  try {
    const payload = await req.json?.() || req.body; // Vercel handles either
    // Basic validation
    if (!payload?.email || !payload?.telegram_handle) {
      return res.status(400).json({ ok:false, error:"missing_fields" });
    }

    // Forward to your bot (set in Vercel env vars)
    const webhook = process.env.DEN_BOT_WEBHOOK; // e.g. https://your-bot-endpoint/ingest
    if (!webhook) return res.status(500).json({ ok:false, error:"missing_webhook" });

    const forward = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        source: "theden.live",
        type: "access_request",
        ...payload
      })
    });

    if (!forward.ok) return res.status(502).json({ ok:false, error:"bot_forward_failed" });

    return res.status(200).json({ ok:true });
  } catch (e) {
    return res.status(500).json({ ok:false, error:"server_error", detail: String(e) });
  }
}
