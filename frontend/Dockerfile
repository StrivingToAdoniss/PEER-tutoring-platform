FROM node:alpine

# Set environment variable to prevent interactive prompts
ENV CI=true

WORKDIR /app

# Install build tools required for native modules
RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install axios
RUN npm install --verbose

# Copy the rest of the application code
COPY . .

# Build the application
CMD ["npm", "run", "build"]
