const { Kafka, Partitioners, logLevel } = require("kafkajs");
const { faker } = require("@faker-js/faker");

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

const generateRandomOrder = () => {
  return {
    orderId: faker.datatype.uuid(),
    customerName: faker.name.fullName(),
    items: Array.from(
      { length: faker.datatype.number({ min: 1, max: 5 }) },
      () => faker.commerce.productName()
    ),
    total: faker.commerce.price(),
    orderTime: new Date().toLocaleString(),
  };
};

const run = async () => {
  const order = generateRandomOrder();
  await sendOrder(order);
};

run().catch(console.error);
