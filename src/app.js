const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sendOrder } = require("./kafka/orderProducer");
const { generateRandomOrder } = require("./utils/orderGenerator");
const { orderSchema } = require("./validations/order");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/order", async (req, res) => {
  await orderSchema.validate(req.body, { abortEarly: false });
  const order = req.body || generateRandomOrder();
  await sendOrder(order);
  res.send("Order processed");
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});


