# Step 1: Build the React app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all the source files
COPY . ./

# Build the React app
RUN npm run build

# Step 2: Serve the React app using Nginx
FROM nginx:alpine

# Copy the build folder from the build stage to the Nginx public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

