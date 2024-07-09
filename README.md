# Order Processing System with KafkaJS

This repository contains an example of an order processing system using KafkaJS to produce and consume messages in real-time with Apache Kafka.

## Prerequisites

- Node.js installed
- Docker and Docker Compose installed
- KafkaJS and Faker library installed

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/FarhanYaseen/order-processing-kafka-js.git
   cd order-processing-kafka-js
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Running Kafka and Zookeeper with Docker Compose

This project includes a `docker-compose.yml` file to set up Kafka and Zookeeper.

1. Start the Kafka and Zookeeper services:

   ```bash
   docker-compose up -d
   ```

2. Verify that the services are running:
   ```bash
   docker-compose ps
   ```

## Running the Producer

To start the express server which listen for incoming message and producer send a order to the Kafka topic:

```bash
npm start
```

## Running the Consumer
To start the consumer and listen for order messages on the Kafka topic:


```bash
npm run start-consumer
```

## Stopping the Services
To stop the Kafka and Zookeeper services, run:


```bash
docker-compose down
```
