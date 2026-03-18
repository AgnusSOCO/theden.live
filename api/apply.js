// /api/apply.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || (await req.json?.()) || {});
    const {
      name = '',
      email = '',
      telegram_handle = '',
      instruments = '',
      proof_link = '',
      agree_rules = false,
      user_agent = '',
      ts, // optional client timestamp
    } = body;

    // Minimal validation
    if (!email || !telegram_handle) {
      return res.status(400).json({ ok: false, error: 'missing_fields' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ ok: false, error: 'missing_supabase_env' });
    }

    // Service role client (server only!)
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const { data, error } = await supabase
      .from('applications')
      .insert({
        name,
        email,
        telegram_handle,
        instruments,
        proof_link,
        agree_rules: !!agree_rules,
        user_agent,
        submitted_at: ts || new Date().toISOString(),
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('supabase insert error:', error);
      return res.status(500).json({ ok: false, error: 'db_insert_failed' });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    console.error('apply handler error:', e);
    return res.status(500).json({ ok: false, error: 'server_error', detail: String(e) });
  }
}
