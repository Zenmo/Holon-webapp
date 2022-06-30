# pull official base image
FROM node:alpine

# set working directory
WORKDIR /frontend

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./