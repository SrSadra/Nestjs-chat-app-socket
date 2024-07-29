# Use a multi-stage build to create a production-ready build
FROM node:20 AS development

WORKDIR /chat-nest/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Define the production stage
FROM node:20 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /chat-nest/src/app

# Copy built application from development stage
COPY --from=development /chat-nest/src/app .

EXPOSE 3000

# # Run the application
CMD [ "node", "dist/main"]
# CMD [ "npm", "run", "start:dev" ]
