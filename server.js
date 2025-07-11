require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// API
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { email, amount } = req.body;

    // let customerId = null;
    // if (saveCard) {
    //   const customer = await stripe.customers.create({ email });
    //   customerId = customer.id;
    // }

    //   const setupIntent = await stripe.setupIntents.create({
    //     customer: customerId,
    //   });
    //   res.send({
    //     clientSecret: setupIntent.client_secret,
    //     customerId: customerId,
    //   });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      receipt_email: email,
      metadata: { integration_check: "accept_a_payment" },
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment intent error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
