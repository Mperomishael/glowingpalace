import crypto from 'crypto';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';
import { createPaymentPlan, verifyTransactionById, verifyTransactionByRef } from './_lib/flutterwave.js';

const ALLOWED_INTERVALS = new Set(['weekly', 'monthly']);

/**
 * Single endpoint handling all three giving operations, to stay within Vercel Hobby's
 * 12-serverless-function-per-deployment limit:
 *   - GET  /api/give?transaction_id=... or ?tx_ref=...   → verify a transaction
 *   - POST /api/give  (no verif-hash header)              → create/reuse a payment plan
 *   - POST /api/give  (with verif-hash header)             → Flutterwave webhook
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleVerify(req, res);
  }

  if (req.method === 'POST') {
    if (req.headers['verif-hash']) {
      return handleWebhook(req, res);
    }
    return handlePlan(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handlePlan(req, res) {
  const { amount, currency, interval } = req.body || {};
  const numericAmount = Number(amount);

  if (!numericAmount || numericAmount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (!currency || typeof currency !== 'string') {
    return res.status(400).json({ error: 'Invalid currency' });
  }
  if (!ALLOWED_INTERVALS.has(interval)) {
    return res.status(400).json({ error: 'Interval must be weekly or monthly' });
  }

  try {
    const { data: existing } = await supabaseAdmin
      .from('payment_plans')
      .select('flw_plan_id')
      .eq('amount', numericAmount)
      .eq('currency', currency)
      .eq('interval', interval)
      .maybeSingle();

    if (existing?.flw_plan_id) {
      return res.json({ planId: existing.flw_plan_id });
    }

    const created = await createPaymentPlan({ amount: numericAmount, currency, interval });
    const planId = created?.data?.id;

    if (!planId) {
      return res.status(502).json({ error: 'Flutterwave did not return a plan id' });
    }

    await supabaseAdmin.from('payment_plans').insert({
      flw_plan_id: String(planId),
      amount: numericAmount,
      currency,
      interval,
    });

    res.json({ planId });
  } catch (err) {
    console.error('give(plan)', err);
    res.status(500).json({ error: err.message || 'Failed to create payment plan' });
  }
}

async function handleVerify(req, res) {
  const { transaction_id, tx_ref } = req.query || {};

  if (!transaction_id && !tx_ref) {
    return res.status(400).json({ error: 'transaction_id or tx_ref is required' });
  }

  try {
    const verified = transaction_id
      ? await verifyTransactionById(transaction_id)
      : await verifyTransactionByRef(tx_ref);

    const tx = verified?.data;
    const isSuccessful = verified?.status === 'success' && tx?.status === 'successful';

    if (!tx) {
      return res.status(502).json({ error: 'Unexpected Flutterwave response' });
    }

    await supabaseAdmin.from('donations').upsert(
      {
        tx_ref: tx.tx_ref,
        flw_transaction_id: String(tx.id),
        flw_plan_id: tx.payment_plan ? String(tx.payment_plan) : null,
        amount: tx.amount,
        currency: tx.currency,
        status: isSuccessful ? 'successful' : (tx.status || 'failed'),
        donor_name: tx.customer?.name || null,
        donor_email: tx.customer?.email || null,
        donor_phone: tx.customer?.phone_number || null,
        frequency: tx.payment_plan ? 'recurring' : 'one_time',
        payment_method: 'card',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'tx_ref' },
    );

    res.json({
      status: isSuccessful ? 'successful' : (tx.status || 'failed'),
      amount: tx.amount,
      currency: tx.currency,
    });
  } catch (err) {
    console.error('give(verify)', err);
    res.status(500).json({ error: err.message || 'Verification failed' });
  }
}

async function handleWebhook(req, res) {
  const expected = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
  const received = req.headers['verif-hash'];

  if (!expected) {
    console.error('give(webhook): FLUTTERWAVE_WEBHOOK_SECRET_HASH not configured');
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
    console.error('give(webhook)', err);
    res.status(200).json({ received: true, logged: false });
  }
}
