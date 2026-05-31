import { useStripe } from '~~/server/utils/stripe'

interface CheckoutItem {
  id: number
  title: string
  price: number
  image: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { items, customerEmail } = body as {
    items: CheckoutItem[]
    customerEmail?: string
  }

  if (!items?.length) {
    throw createError({ statusCode: 400, message: 'Cart items are required' })
  }

  const config = useRuntimeConfig()
  const stripe = useStripe()

  // Build base URL from request if not configured
  const requestUrl = getRequestURL(event)
  const baseUrl = config.public.baseUrl || `${requestUrl.protocol}//${requestUrl.host}`

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: 1,
  }))

  try {
    console.log('[Stripe] Creating session with', lineItems.length, 'items')
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      ...(customerEmail && { customer_email: customerEmail }),
      metadata: {
        productIds: JSON.stringify(items.map((i) => i.id)),
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    })

    return { sessionId: session.id, url: session.url }
  } catch (err: any) {
    console.error('[Stripe Error]', err.message)
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'Failed to create checkout session',
    })
  }
})
