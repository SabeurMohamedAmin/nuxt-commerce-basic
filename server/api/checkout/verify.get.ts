import { useStripe } from '~~/server/utils/stripe'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sessionId = query.session_id as string

  if (!sessionId) {
    throw createError({ statusCode: 400, message: 'session_id is required' })
  }

  const stripe = useStripe()

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== 'paid') {
    throw createError({ statusCode: 402, message: 'Payment not completed' })
  }

  return {
    success: true,
    email: session.customer_details?.email,
    amount: session.amount_total ? session.amount_total / 100 : 0,
    productIds: session.metadata?.productIds ? JSON.parse(session.metadata.productIds) : [],
  }
})
