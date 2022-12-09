# Use the official Node.js LTS image as the base image
FROM node:alpine AS builder

# Create a new directory for the application
RUN mkdir -p /usr/src/app
# Set the working directory to the new directory
WORKDIR /usr/src/app
# Copy the package.json file to the working directory
COPY package.json .
COPY yarn.lock .
# Install the dependencies
RUN yarn install
# Copy the source code to the working directory
COPY . .
# Build the TypeScript code
RUN npm run build

FROM node:alpine AS prodDeps
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Use the official Node.js LTS image as the base image
FROM node:alpine

# Create a new directory for the application
RUN mkdir -p /usr/src/app

# Set the working directory to the new directory
WORKDIR /usr/src/app

# Copy the built files and the node_modules directory from the builder stage
COPY --from=builder /usr/src/app/build ./build
COPY --from=prodDeps /usr/src/app/node_modules ./node_modules
COPY package.json .
# COPY .env .
# Expose port 3000 to the host
EXPOSE 4000

# Start the server
CMD ["yarn", "start"]
