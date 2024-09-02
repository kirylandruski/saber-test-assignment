# Stage 1: Build the application
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container's working directory
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy node_modules and build files from the previous stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Copy the .env.local-docker file again for use in production
COPY .env.local-docker .env

# Copy package.json (for potential use in production)
COPY package.json .

# Expose the application port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=development

# Run the application
CMD ["npm", "run", "start:prod"]
