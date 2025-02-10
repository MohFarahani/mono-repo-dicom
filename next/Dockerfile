FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code if not using volumes
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application in development mode for hot reloading
CMD ["yarn", "dev"]
