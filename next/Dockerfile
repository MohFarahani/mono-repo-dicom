FROM node:18-slim

WORKDIR /app

# Install necessary tools and configure yarn
RUN apt-get update && \
    apt-get install -y git && \
    yarn config set network-timeout 300000 && \
    yarn config set registry https://registry.npmmirror.com && \
    yarn config set network-concurrency 1

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with retries
RUN yarn install --network-timeout 600000 --network-concurrency 1 || \
    (sleep 5 && yarn install --network-timeout 600000 --network-concurrency 1) || \
    (sleep 10 && yarn install --network-timeout 600000 --network-concurrency 1)

# Copy source code if not using volumes
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application in development mode for hot reloading
CMD ["yarn", "dev"]
