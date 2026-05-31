import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function useStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY || useRuntimeConfig().stripeSecretKey

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
    }

    _stripe = new Stripe(secretKey)
  }

  return _stripe
}
