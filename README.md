# Kafka Order Backend

A Node.js/Express REST API that publishes orders to Apache Kafka for real-time event-driven processing.

## Tech Stack

- **Node.js** + **Express** — HTTP API
- **KafkaJS** — Kafka producer/consumer
- **Yup** — Request validation
- **Docker Compose** — Local Kafka + Zookeeper setup

## Prerequisites

- Node.js 18+
- Docker + Docker Compose

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/FarhanYaseen/order-processing-kafka-js.git
cd kafka-order-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `KAFKA_BROKERS` | `localhost:29092` | Comma-separated Kafka broker addresses |
| `KAFKA_CLIENT_ID` | `order-app` | Kafka client identifier |
| `KAFKA_TOPIC` | `orders` | Topic to publish/consume orders |
| `KAFKA_GROUP_ID` | `order-group` | Consumer group ID |
| `CORS_ORIGIN` | `http://localhost:3001` | Allowed CORS origin |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window in ms |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

### 3. Start Kafka and Zookeeper

```bash
docker-compose up -d
```

Verify services are healthy:

```bash
docker-compose ps
```

### 4. Start the API server

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

### 5. Start the consumer

```bash
# Production
npm run start-consumer

# Development (auto-reload)
npm run dev:consumer
```

## API Reference

### Health Check

```
GET /health
```

**Response:**
```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

### Submit Order

```
POST /api/v1/order
Content-Type: application/json
```

**Request Body:**

```json
{
  "customerName": "Jane Doe",
  "items": "Laptop, Mouse",
  "total": 1299.99
}
```

**Responses:**

| Status | Description |
|---|---|
| `202 Accepted` | Order accepted and published to Kafka |
| `400 Bad Request` | Validation failed — `details` array lists all errors |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Kafka publish failed |

**Success (202):**
```json
{
  "message": "Order accepted",
  "order": {
    "customerName": "Jane Doe",
    "items": "Laptop, Mouse",
    "total": 1299.99
  }
}
```

**Validation error (400):**
```json
{
  "error": "Validation failed",
  "details": ["customerName is a required field"]
}
```

## Project Structure

```
kafka-order-backend/
├── src/
│   ├── app.js                  # Express server, routes, middleware
│   ├── kafka/
│   │   ├── orderProducer.js    # Singleton Kafka producer
│   │   └── orderConsumer.js    # Kafka consumer with graceful shutdown
│   ├── utils/
│   │   └── orderGenerator.js   # Faker-based mock order generator
│   └── validations/
│       └── order.js            # Yup validation schema
├── docker-compose.yml          # Zookeeper + Kafka with healthchecks
├── .env.example                # Environment variable template
└── package.json
```

## Stopping Services

```bash
docker-compose down
```
