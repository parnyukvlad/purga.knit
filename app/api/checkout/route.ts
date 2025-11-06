import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingAddress, userId } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()
    
    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shippingCost = shippingAddress.country === 'CZ' ? 10 : 10 // €10 flat rate
    
    // Create shipping address in database
    const { data: addressData, error: addressError } = await supabase
      .from('purgaknit_shipping_addresses')
      .insert({
        user_id: userId,
        full_name: shippingAddress.fullName,
        street_address: shippingAddress.streetAddress,
        city: shippingAddress.city,
        postal_code: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        is_default: true,
      })
      .select()
      .single()

    if (addressError) {
      return NextResponse.json(
        { error: 'Failed to save shipping address' },
        { status: 500 }
      )
    }

    // Create order in database
    const { data: orderData, error: orderError } = await supabase
      .from('purgaknit_orders')
      .insert({
        user_id: userId,
        total_amount: subtotal,
        shipping_cost: shippingCost,
        status: 'pending',
        shipping_address_id: addressData.id,
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    await supabase.from('purgaknit_order_items').insert(orderItems)

    // Create Stripe Checkout Session
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(item.price * 100), // Convert to cents
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : [],
        },
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(shippingCost * 100),
        product_data: {
          name: 'Shipping',
        },
      },
      quantity: 1,
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderData.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        order_id: orderData.id.toString(),
        user_id: userId,
      },
      customer_email: shippingAddress.email,
      shipping_address_collection: {
        allowed_countries: ['CZ', 'SK', 'PL', 'DE', 'AT'],
      },
    })

    // Update order with Stripe payment intent ID
    await supabase
      .from('purgaknit_orders')
      .update({ stripe_payment_intent_id: session.id })
      .eq('id', orderData.id)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

