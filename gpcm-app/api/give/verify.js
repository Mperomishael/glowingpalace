import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
import { verifyTransactionById, verifyTransactionByRef } from '../_lib/flutterwave.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transaction_id, tx_ref } = req.query || {};

  if (!transaction_id && !tx_ref) {
    return res.status(400).json({ error: 'transaction_id or tx_ref is required' });
  }

  try {
    // Never trust the client-side callback status — re-verify directly with Flutterwave.
    const verified = transaction_id
      ? await verifyTransactionById(transaction_id)
      : await verifyTransactionByRef(tx_ref);

    const tx = verified?.data;
    const isSuccessful = verified?.status === 'success' && tx?.status === 'successful';

    if (!tx) {
      return res.status(502).json({ error: 'Unexpected Flutterwave response' });
    }

    const donation = {
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
    };

    await supabaseAdmin.from('donations').upsert(donation, { onConflict: 'tx_ref' });

    res.json({
      status: isSuccessful ? 'successful' : donation.status,
      amount: tx.amount,
      currency: tx.currency,
    });
  } catch (err) {
    console.error('give/verify', err);
    res.status(500).json({ error: err.message || 'Verification failed' });
  }
}
