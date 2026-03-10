const { Kafka, Partitioners, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "order-app",
  brokers: (process.env.KAFKA_BROKERS || "localhost:29092").split(","),
  createPartitioner: Partitioners.LegacyPartitioner,
  logLevel: logLevel.WARN,
});

const producer = kafka.producer();
let isConnected = false;

const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("Kafka producer connected");
  }
};

const disconnectProducer = async () => {
  if (isConnected) {
    await producer.disconnect();
    isConnected = false;
    console.log("Kafka producer disconnected");
  }
};

const sendOrder = async (order) => {
  await connectProducer();
  await producer.send({
    topic: process.env.KAFKA_TOPIC || "orders",
    messages: [{ value: JSON.stringify(order) }],
  });
  console.log("Order sent to Kafka:", order.orderId || order.customerName);
};

module.exports = { sendOrder, connectProducer, disconnectProducer };
