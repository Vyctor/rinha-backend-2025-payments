FROM node:23-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

CMD [ "node", "src/index.js" ]
