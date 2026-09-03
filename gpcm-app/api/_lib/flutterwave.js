const FLW_BASE = 'https://api.flutterwave.com/v3';

/** Low-level authenticated call to the Flutterwave v3 API. Throws on network/HTTP failure. */
export async function flwFetch(path, options = {}) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Missing FLUTTERWAVE_SECRET_KEY env var');
  }

  const res = await fetch(`${FLW_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json) {
    const message = json?.message || `Flutterwave request failed (${res.status})`;
    throw new Error(message);
  }

  return json;
}

/** Verify a transaction by its Flutterwave transaction_id (most reliable — prefer this when available). */
export async function verifyTransactionById(transactionId) {
  return flwFetch(`/transactions/${encodeURIComponent(transactionId)}/verify`);
}

/** Verify a transaction by tx_ref (fallback when only the client-side reference is known). */
export async function verifyTransactionByRef(txRef) {
  return flwFetch(`/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`);
}

/** Create a recurring payment plan. interval: 'weekly' | 'monthly'. amount/currency define one billing cycle. */
export async function createPaymentPlan({ amount, currency, interval, name }) {
  return flwFetch('/payment-plans', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      currency,
      interval,
      name: name || `GPCM Giving - ${interval} - ${currency} ${amount}`,
    }),
  });
}
