FROM arm32v7/node:16 as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN NODE_ENV=production npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html
# Remove efault nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=build /app/dist/frontend .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
