# ─── BUILD STAGE ─────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Cache package dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_STORAGE_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STORAGE_URL=$VITE_STORAGE_URL

RUN npm run build

# ─── SERVE STAGE ─────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
