# Build React
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --progress=false && npm cache clean --force
COPY . .
RUN npm run build

# Serve with NGINX
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]