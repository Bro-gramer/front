import { STRIPE_PRODUCTS } from '../stripe-config';

export async function createCheckoutSession({
  priceId,
  mode,
  successUrl,
  cancelUrl,
  token,
}: {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  token: string;
}) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      price_id: priceId,
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  const { url } = await response.json();
  return url;
}

export function getProductByPriceId(priceId: string) {
  return Object.values(STRIPE_PRODUCTS).find((product) => product.priceId === priceId);
}