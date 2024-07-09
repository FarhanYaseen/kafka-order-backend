const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-app",
  brokers: ["localhost:29092"],
  logLevel: logLevel.DEBUG,
});

const consumer = kafka.consumer({ groupId: "order-group" });

const processOrder = async (order) => {
  // Simulate order processing
  console.log("Processing order:", order);
};

const consumeOrders = async () => {
  try {
    await consumer.connect();
    console.log("Connected to Kafka broker");

    await consumer.subscribe({ topic: "orders", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const order = JSON.parse(message.value.toString());
        await processOrder(order);
        console.log({
          partition,
          offset: message.offset,
          value: order,
        });
      },
    });
    console.log("Order consumer running");
  } catch (error) {
    console.error("Failed to consume orders:", error);
  }
};

consumeOrders().catch(console.error);
