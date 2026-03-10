require("dotenv").config();
const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "order-app",
  brokers: (process.env.KAFKA_BROKERS || "localhost:29092").split(","),
  logLevel: logLevel.WARN,
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID || "order-group",
});

const processOrder = async (order) => {
  console.log(JSON.stringify({ event: "order_received", order }));
};

const consumeOrders = async () => {
  await consumer.connect();
  console.log("Kafka consumer connected");

  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC || "orders",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const order = JSON.parse(message.value.toString());
        await processOrder(order);
        console.log(
          JSON.stringify({ event: "order_processed", partition, offset: message.offset, orderId: order.orderId })
        );
      } catch (err) {
        console.error(JSON.stringify({ event: "order_process_error", error: err.message }));
      }
    },
  });

  console.log("Kafka consumer running");
};

const shutdown = async () => {
  console.log("Consumer shutting down...");
  await consumer.disconnect();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

consumeOrders().catch((err) => {
  console.error(JSON.stringify({ event: "consumer_fatal_error", error: err.message }));
  process.exit(1);
});
