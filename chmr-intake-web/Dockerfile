# Build Stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --loglevel=error \
 && npm cache clean --force

COPY . .
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]