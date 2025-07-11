require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});
const express = require("express");
const app = express();
const router = express.Router();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { priceId } = req.body;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    ui_mode: "custom",
    // return_url: `${process.env.DOMAIN}/done?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({ clientSecret: session.client_secret });
});

// Get status of checkout session
router.get("/session-status", async (req, res) => {
  const { session_id } = req.query;
  const session = await stripe.checkout.sessions.retrieve(session_id);
  res.send({ status: session.status });
});

app.use("/api", router);

app.listen(4242, () => console.log("Server running on port 4242"));
