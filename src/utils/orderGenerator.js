const { faker } = require("@faker-js/faker");

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

module.exports = { generateRandomOrder };
