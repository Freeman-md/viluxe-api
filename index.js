const express = require('express');
const cors = require("cors")
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_SK_KEY);

const app = express();
app.use(express.json());
app.use(cors())

app.post('/create-payment-intent', async (req, res) => {
  const { amount, metadata } = req.body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      metadata,
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

app.get('/get-payment-intent', async (req, res) => {
  const { payment_intent_client_secret } = req.query

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_client_secret)
    
    res.json({ paymentIntent })
  } catch (error) {
    console.error('Error getting payment intent:', error);
    res.status(500).json({ error: 'Error getting payment intent' });
  }
})

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});