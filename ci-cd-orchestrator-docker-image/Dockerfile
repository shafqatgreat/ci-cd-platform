FROM node:20-slim
WORKDIR /app

# Copy from the root context into the container
COPY ci-cd-orchestrator-docker-image/package*.json ./
RUN npm install --omit=dev

# Copy the rest of the orchestrator code
COPY ci-cd-orchestrator-docker-image/ .

EXPOSE 8080
# CMD ["node", "index.js"]
# FIX: Point to webhook-server.js instead of index.js
CMD ["node", "webhook-server.js"]






# FROM node:20-slim
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --omit=dev
# COPY . .
# EXPOSE 8080
# CMD ["node", "server.js"]