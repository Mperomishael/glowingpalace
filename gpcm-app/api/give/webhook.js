import crypto from 'crypto';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';

/**
 * Flutterwave calls this for every charge event, including the automatic charges it makes
 * on later billing cycles of a recurring plan (those never touch our frontend, so this
 * webhook is the only place we hear about them).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expected = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
  const received = req.headers['verif-hash'];

  if (!expected) {
    console.error('give/webhook: FLUTTERWAVE_WEBHOOK_SECRET_HASH not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const validHash =
    typeof received === 'string' &&
    received.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));

  if (!validHash) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, data } = req.body || {};

  // Always 200 once the signature checks out, so Flutterwave doesn't keep retrying
  // events we intentionally ignore.
  if (event !== 'charge.completed' || !data) {
    return res.status(200).json({ received: true });
  }

  try {
    await supabaseAdmin.from('donations').upsert(
      {
        tx_ref: data.tx_ref,
        flw_transaction_id: String(data.id),
        flw_plan_id: data.payment_plan ? String(data.payment_plan) : null,
        amount: data.amount,
        currency: data.currency,
        status: data.status === 'successful' ? 'successful' : (data.status || 'failed'),
        donor_name: data.customer?.name || null,
        donor_email: data.customer?.email || null,
        donor_phone: data.customer?.phone_number || null,
        frequency: data.payment_plan ? 'recurring' : 'one_time',
        payment_method: 'card',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'tx_ref' },
    );

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('give/webhook', err);
    // Still 200 — we verified the signature, a DB hiccup shouldn't trigger endless retries.
    res.status(200).json({ received: true, logged: false });
  }
}
