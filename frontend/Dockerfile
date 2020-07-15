FROM node:12-alpine

RUN mkdir -p /app/frontend
WORKDIR /app/frontend

COPY package*.json ./app/frontend/
COPY yarn.lock ./app/frontend

RUN apk add --no-cache bash make gcc g++ python

RUN npm install

EXPOSE 3000