FROM node:14 AS development

WORKDIR /chat-nest/src/app

COPY package*.json ./

RUN npm install

RUN npm run build

EXPOSE 3000

# produciton is name of image
FROM node:14 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /chat-nest/src/app

COPY --from=development /chat-nest .

EXPOSE 3000

# run app
CMD [ "node", "dist/main"]