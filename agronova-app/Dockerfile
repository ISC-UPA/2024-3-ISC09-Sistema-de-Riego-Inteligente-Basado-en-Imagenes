# Stage 1: Build the Expo project
FROM node:18-alpine AS builder

# Set the working directory for the build
WORKDIR /app

# Install dependencies required for builds
RUN apk add --no-cache bash git python3 make g++

# Copy package.json and yarn.lock for dependency installation
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Export the Expo project to static files for web
RUN yarn expo export --output-dir dist --platform web

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Set the working directory to Nginx's static file directory
WORKDIR /usr/share/nginx/html

# Remove the default Nginx content
RUN rm -rf ./*

# Copy the generated static files from the builder stage
COPY --from=builder /app/dist ./

# Copy a custom Nginx configuration file (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
