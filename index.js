const express = require('express');
const cors = require("cors")
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_SK_KEY);

const app = express();
app.use(express.json());
app.use(cors())

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).json({ error: 'Error creating Payment Intent' });
  }
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
