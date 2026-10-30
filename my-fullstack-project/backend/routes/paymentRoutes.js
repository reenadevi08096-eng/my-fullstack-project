const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/authMiddleware');

router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: 'Pro SaaS Upgrade' },
            unit_amount: 50000, // ₹500
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/dashboard',
    });
    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.log("STRIPE PAYMENT ERROR:", err.message); // Yahan terminal me error print hogi
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;