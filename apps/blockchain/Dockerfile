FROM node:18-alpine AS base
RUN npm i -g pnpm

# development stage
FROM base AS development 
ARG APP 
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./ 
RUN pnpm install
COPY . . 
RUN pnpm run build blockchain