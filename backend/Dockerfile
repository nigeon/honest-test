FROM node:12-alpine

RUN mkdir -p /app/backend
WORKDIR /app/backend

COPY package*.json ./app/backend/

RUN apk add --no-cache bash make gcc g++ python

RUN npm install

EXPOSE 1337