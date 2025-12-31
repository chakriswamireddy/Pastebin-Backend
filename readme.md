# PasteVault Backend

A stateless, serverless-safe backend service for temporary paste-sharing with time-based and usage-based expiry.

## Overview

PasteVault Backend provides REST APIs to create and retrieve text pastes with optional expiration controls. It's designed to be stateless, serverless-safe, and deterministic-test friendly, ensuring correctness under concurrent access and automated testing.

## Features

- **Create pastes** with optional time-to-live (TTL)
- **View-limited pastes** with maximum view counts
- **Atomic expiry logic** for concurrent access safety
- **Deterministic testing** support for time-based expiry
- **PostgreSQL persistence** for reliable serverless deployments

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js v18 or higher
- PostgreSQL
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pastevault-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the backend root:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/pastevault
   PORT=3000
   TEST_MODE=1  # Optional: Enable for deterministic tests
   ```

4. **Run database migrations**

   ```bash
   npm run migrate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3000`

## Persistence Layer

PasteVault uses **PostgreSQL** as its persistence layer, accessed via **Drizzle ORM**.

### Why PostgreSQL?

In-memory storage is intentionally avoided because it is unreliable in serverless and multi-instance environments. PostgreSQL ensures that paste data persists across requests and deployments.

### Expiry Logic

Expiry logic (TTL and max views) is enforced using **atomic conditional database updates**, guaranteeing correct behavior under concurrent access.

## Deterministic Expiry Testing

When `TEST_MODE=1` is enabled, the backend supports deterministic time-based testing:

- The request header `x-test-now-ms` (milliseconds since epoch) is treated as the current time for expiry checks only
- If the header is absent, the system clock is used
- This allows automated tests to simulate time progression deterministically without relying on real-time delays

### Example

```bash
curl -H "x-test-now-ms: 1704067200000" http://localhost:3000/pastes/abc123
```

## API Reference

### Create a Paste

**Endpoint:** `POST /pastes`

Create a new paste with optional TTL and/or maximum views.

**Request Body:**

```json
{
  "content": "Your paste content here",
  "ttl": 3600,        // Optional: Time-to-live in seconds
  "maxViews": 5       // Optional: Maximum number of views
}
```

**Response:**

```json
{
  "id": "abc123",
  "url": "/pastes/abc123"
}
```

### Retrieve a Paste

**Endpoint:** `GET /pastes/:id`

Retrieve a paste by ID. This consumes one view and enforces expiry rules.

**Response:**

```json
{
  "id": "abc123",
  "content": "Your paste content here",
  "remainingViews": 4,
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

**Error Responses:**

- `404 Not Found` - Paste does not exist or has expired
- `410 Gone` - Paste has reached maximum views or TTL has expired

## Project Structure

```
pastevault-backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── config/          # Database schema and connection
│   ├── controllers/      # Express controllers
│   └── server.js         # Application entry point
├── migrations/          # Database migrations
├── .env                 # Environment configuration
├── package.json
└── README.md
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run migrate` - Run database migrations
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm start` - Start production server

## Deployment


Ensure your `DATABASE_URL` environment variable is properly configured for your production database.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License Here]

## Support

For issues, questions, or contributions, please open an issue on the repository.