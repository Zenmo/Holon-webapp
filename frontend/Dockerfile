# pull official base image
FROM node:alpine

# set working directory
WORKDIR /app/frontend

# install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn
