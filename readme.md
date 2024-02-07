# Fastify Proxy Server

This Fastify Proxy Server is an comprehensive, modular API designed to serve as a performant intermediary for external API requests, featuring built-in rate limiting, automatic Swagger documentation, and robust request/response schema validation using Zod. It's ideal for applications requiring efficient data fetching with caching capabilities (both `node-cache` and Redis supported), detailed API documentation, and controlled request rates to optimize performance and reliability.

## Features

- **Modular Architecture**: Easily extendable to support various external APIs or custom data processing modules.
- **Dual Caching Strategy**: Choose between in-memory caching with `node-cache` or distributed caching with Redis to suit different scalability needs.
- **Rate Limiting**: Protects your API from overuse and ensures fair resource usage with `@fastify/rate-limit`.
- **Swagger Documentation**: Automatically generates comprehensive API documentation using `@fastify/swagger`, making API consumption easier.
- **Schema Validation**: Utilizes `zod` for type-safe request and response validation, ensuring data integrity.

## Getting Started

### Prerequisites

- Node.js (v18 or later)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fastify_proxy_server.git
cd fastify_proxy_server
```


2. Install NPM packages:
```bash
pnpm install
```

3. Configure environment variables by copying the provided `.env.example` file to a new `.env` file. Make sure to fill in all necessary values, especially those related to the Redis configuration if you're using Redis for caching.

```bash
cp .env.example.txt .env
# Edit .env to customize your environment variables
```

4. Start the server in development mode:
```bash
pnpm run dev
```

5. For caching with Redis, ensure your Redis server is running and accessible. If you're using Docker, you can start Redis with Docker Compose. Run the following command in the project root directory:
```bash
docker-compose up -d
```

6. Access the Swagger documentation:
```bash
http://localhost:3000/documentation
```

### Usage
API Requests: Direct your API requests to the proxy server endpoints you've configured. Utilize rate limiting and caching as set up per route.
Documentation: Access auto-generated Swagger documentation at /docs to explore available API endpoints.
Schema Validation: Define request and response schemas using Zod for robust validation.

### Contributing
We welcome contributions to make this proxy server even more versatile and powerful. Whether it's adding new features, enhancing existing ones, or reporting bugs, your input is invaluable.

Please follow the standard GitHub pull request process to submit your contributions:

- Fork the Project
- Create your Feature Branch (git checkout -b feature/AmazingFeature)
- Commit your Changes (git commit -m 'Add some AmazingFeature')
- Push to the Branch (git push origin feature/AmazingFeature)
- Open a Pull Request

### License
Distributed under the MIT License. See LICENSE for more information.