# Production Multi-Stage Dockerfile for Nationrise CRM
# Stage 1: Build static assets
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally matching package.json version
RUN npm install -g pnpm@11.25.0

# Copy dependency specifications first
COPY package.json pnpm-lock.yaml ./

# Install dependencies strictly from lockfile
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY . .

# Build the production application bundle
RUN pnpm run build

# Stage 2: Production Nginx server
FROM nginx:1.27-alpine AS runner

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration for Vite SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled production bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check to ensure nginx is serving traffic
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
