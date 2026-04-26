# Use lightweight Node.js image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy source code
COPY . .

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD wget -qO- http://localhost:5000/balance || exit 1

CMD ["node", "server.js"]
