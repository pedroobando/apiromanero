
# FROM node:12.14-buster
FROM node:lts-buster

ENV TZ=America/Caracas

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

CMD [ "node", "dist/index.js" ] 