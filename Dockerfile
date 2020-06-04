FROM node:12-alpine
# FROM node:12-buster-slim
# FROM node:12-buster
# FROM node:14-alpine

ENV TZ=America/Caracas

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

COPY .env ./

RUN yarn build

# puerto donde se ejecuta la aplicacion
EXPOSE 3003

CMD [ "yarn", "start" ]
