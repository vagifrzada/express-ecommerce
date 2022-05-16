FROM node:17.8-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

ENV PORT 3000

EXPOSE ${PORT}

CMD [ "node", "app.js" ]