import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Midlertidig åpen CORS (ok i test)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const { priceId, returnUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    if (!returnUrl) {
      return res.status(400).json({ error: "Missing returnUrl" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ui_mode: "embedded",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      return_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`
    });

    res.status(200).json({
      clientSecret: session.client_secret
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

