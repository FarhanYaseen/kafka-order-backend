const { Kafka, Partitioners, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-app",
  brokers: ["localhost:29092"],
  createPartitioner: Partitioners.LegacyPartitioner,
  logLevel: logLevel.DEBUG,
});

const producer = kafka.producer();

const sendOrder = async (order) => {
  try {
    await producer.connect();
    console.log("Connected to Kafka broker");

    await producer.send({
      topic: "orders",
      messages: [{ value: JSON.stringify(order) }],
    });
    console.log("Order sent:", order);
  } catch (error) {
    console.error("Failed to send order:", error);
  } finally {
    await producer.disconnect();
    console.log("Disconnected from Kafka broker");
  }
};

module.exports = { sendOrder };
