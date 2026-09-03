import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
import { createPaymentPlan } from '../_lib/flutterwave.js';

const ALLOWED_INTERVALS = new Set(['weekly', 'monthly']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    // Reuse an existing plan for this exact amount/currency/interval if we already made one.
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
    console.error('give/plan', err);
    res.status(500).json({ error: err.message || 'Failed to create payment plan' });
  }
}
