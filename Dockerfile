# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Build if using TypeScript
RUN npm run build

# Expose your app port (example 3000)
EXPOSE 3000

# Start command (production)
CMD ["npm", "run", "start"]
