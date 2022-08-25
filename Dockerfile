###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:16-alpine As development

WORKDIR /usr/src/bot

COPY . .

