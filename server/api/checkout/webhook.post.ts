import { useStripe } from '~~/server/utils/stripe'
import type Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const stripe = useStripe()
  const config = useRuntimeConfig()
  const body = await readRawBody(event)
  const signature = getHeader(event, 'stripe-signature')

  if (!body || !signature) {
    throw createError({ statusCode: 400, message: 'Missing body or signature' })
  }

  let stripeEvent: Stripe.Event

  try {
    if (config.stripeWebhookSecret) {
      stripeEvent = stripe.webhooks.constructEvent(body, signature, config.stripeWebhookSecret)
    } else {
      // In dev without webhook secret, parse directly
      stripeEvent = JSON.parse(body) as Stripe.Event
    }
  } catch (err) {
    throw createError({ statusCode: 400, message: 'Webhook signature verification failed' })
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      await handleSuccessfulPayment(session)
      break
    }
  }

  return { received: true }
})

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const productIds = session.metadata?.productIds
  const customerEmail = session.customer_details?.email

  if (!productIds || !customerEmail) return

  // TODO: When DB is wired up, add purchased products to user's library
  console.log(`[Stripe] Payment successful for ${customerEmail}`, {
    productIds: JSON.parse(productIds),
    amount: session.amount_total,
    paymentIntent: session.payment_intent,
  })
}
