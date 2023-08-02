FROM node:16-alpine

WORKDIR /usr/app
RUN mkdir /usr/app/server
RUN mkdir /usr/app/client
COPY ./server/package.json ./server
COPY ./client/package.json ./client
WORKDIR /usr/app/server
RUN npm install
WORKDIR /usr/app/client
RUN npm install
COPY ./client ./
RUN npm run build
WORKDIR /usr/app/server
COPY ./server ./
RUN npm run build

CMD ["npm", "run", "start"]