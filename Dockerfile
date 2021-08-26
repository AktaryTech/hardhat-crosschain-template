# syntax=docker/dockerfile:1
FROM node:14
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .