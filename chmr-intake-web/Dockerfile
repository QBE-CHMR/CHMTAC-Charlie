# Build Stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . .
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine

# Copy the built static files from the Node.js build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration for rate limiting
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]