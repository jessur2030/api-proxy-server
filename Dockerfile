# Base Image
FROM node:18-alpine AS builder 

# Working Directory
WORKDIR /app

# Copy necessary files (package.json, lockfile)
COPY package.json pnpm-lock.yaml ./

# Install pnpm, dependencies and dev dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy remaining project source code
COPY . .

# Build for production 
RUN pnpm run build  

# Final production-ready image
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /usr/app

# Copy build artifacts from the builder stage
COPY --from=builder /app/build ./build 
COPY package.json ./

# Expose Fastify's default port 
EXPOSE 3000 

# Command to start the Fastify server
CMD ["pnpm", "start"] 
