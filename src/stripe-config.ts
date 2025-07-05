export const STRIPE_PRODUCTS = {
  T2S: {
    priceId: 'price_1RKO9yGdcdtia3mjqUuMk8Km',
    name: 'T2S',
    description: 'School Management System',
    mode: 'subscription' as const,
  },
} as const;

export type ProductId = keyof typeof STRIPE_PRODUCTS;