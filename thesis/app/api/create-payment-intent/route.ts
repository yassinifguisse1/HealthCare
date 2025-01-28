import { NextResponse, NextRequest } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})
/**
 * @method POST
 * @route ~/api/create-payment-intent
 * @desc   Create a payment intent for the given amount in USD
 * @access public
 **/

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

