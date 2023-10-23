# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build TypeScript code
RUN npm run build

# Expose a port for the application to listen on
EXPOSE 3003

# Define the command to run your application
CMD ["node", "dist/server.js"]
