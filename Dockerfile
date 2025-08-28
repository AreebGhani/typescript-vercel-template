# Use an official Node.js runtime as a base image
FROM node:22-alpine as base

# Set the working directory inside the container
WORKDIR /app

# Copy files to the container
COPY package*.json tsconfig.json ./
COPY . .

# Install dependencies and build the project
RUN npm ci && npm run build

# Use Node.js runtime for the production stage
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy Packages & Install only production dependencies
COPY package*.json ./
RUN  npm ci --production

# Copy the built project from the previous stage
COPY --from=base /app/build ./build

# Expose port 5000 for the app
EXPOSE 5000

# Start the server using the start script
CMD ["npm", "start"]
