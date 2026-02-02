FROM node:20-slim

# Create a clean working directory inside the container
WORKDIR /app

# 1. Copy package files from the payment-service folder
# (Assuming you run the build from the monorepo root)
COPY payment-service/package*.json ./

# 2. Install only production dependencies
RUN npm install --omit=dev

# 3. Copy the actual payment service code
COPY payment-service/ .

# 4. Expose the port your payment service listens on (e.g., 3000)
EXPOSE 3000

# 5. Start the service
CMD ["node", "index.js"]