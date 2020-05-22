
# FROM node:12.14-buster
FROM node:12-alpine

ENV TZ=America/Caracas

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "node", "dist/index.js" ] 