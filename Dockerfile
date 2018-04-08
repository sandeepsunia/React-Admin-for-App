FROM node:7.5.0
MAINTAINER Sandeep Sunia <sandy.iiita@gmail.com>

ENV NODE_ENV production
EXPOSE 3000

RUN apt-get update \
  && apt-get install -y python-software-properties git build-essential

RUN npm install -g pg pg-hstore sequelize sequelize-cli node-gyp yarn webpack rimraf cross-env
RUN yarn add sequelize-log-syntax-colors webpack rimraf cross-env
RUN yarn add global  webpack rimraf cross-env

RUN mkdir -p /app
ADD . /app
WORKDIR /app
RUN yarn install

ENTRYPOINT ["bash", "-c"]
CMD ["yarn run dev"]

