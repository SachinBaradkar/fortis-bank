# ─── Stage 1: Build React App ───────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build production build
RUN npm run build

# ─── Stage 2: Serve with Nginx ───────────────────────────────────────────────
FROM nginx:alpine

# Copy build output to nginx html folder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
