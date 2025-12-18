# Build stage: Install Meteor and build the app
FROM node:20-slim AS builder

# Install curl and other dependencies needed for Meteor installation
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Meteor
RUN curl https://install.meteor.com/ | sh
ENV PATH="$PATH:/root/.meteor"
# Allow Meteor to run as superuser in Docker build context
ENV METEOR_ALLOW_SUPERUSER=1

# Set working directory
WORKDIR /app

# Copy package files and Meteor config
COPY package*.json ./
COPY .meteor ./.meteor

# Remove testModule from package.json for production build
RUN node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync('package.json')); delete pkg.meteor.testModule; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

# Install dependencies
RUN meteor npm install

# Copy application code (excluding tests)
COPY client ./client
COPY server ./server
COPY imports ./imports
COPY .meteor ./.meteor

# Build the Meteor app
RUN meteor build --directory /app/bundle

# Use Node.js to run the built app
FROM node:20-alpine

# Install MongoDB shell (optional, for debugging)
RUN apk add --no-cache mongodb-tools

# Set working directory
WORKDIR /app

# Copy built application from previous stage
COPY --from=0 /app/bundle/bundle /app

# Install production dependencies
WORKDIR /app/programs/server
RUN npm install --production

# Set working directory back to app root
WORKDIR /app

# Expose port (Meteor default is 3000, but Railway may use PORT env var)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
# Railway will provide PORT, MONGO_URL, and ROOT_URL via environment variables
# Meteor's built bundle automatically reads PORT from environment
CMD ["node", "main.js"]
