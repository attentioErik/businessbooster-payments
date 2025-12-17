import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  res.status(200).json({
    status: session.status,
    payment_status: session.payment_status,
    customer: session.customer,
    subscription: session.subscription
  });
}
