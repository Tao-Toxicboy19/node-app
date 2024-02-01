# Use an official Node runtime as a base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install PM2 globally
RUN npm install -g pm2

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["pm2-runtime", "start", "dist/main.js", "-i", "3"]
