require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { sendOrder, disconnectProducer } = require("./kafka/orderProducer");
const { orderSchema } = require("./validations/order");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3001" }));
app.use(bodyParser.json());
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: { error: "Too many requests, please try again later." },
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/v1/order", async (req, res) => {
  try {
    const validated = await orderSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    await sendOrder(validated);
    res.status(202).json({ message: "Order accepted", order: validated });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    console.error(JSON.stringify({ event: "order_submit_error", error: err.message }));
    res.status(500).json({ error: "Failed to process order. Please try again." });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const server = app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

const shutdown = async () => {
  console.log("Server shutting down...");
  server.close(async () => {
    await disconnectProducer();
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
