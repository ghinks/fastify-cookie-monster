FROM node:14-alpine

USER node

RUN mkdir /home/node/code

WORKDIR /home/node/code

COPY --chown=node:node server-docker.js gvhinks-fastify-cookie-monster-0.0.1.tgz ./
RUN npm init --yes
RUN npm i fastify
RUN npm i gvhinks-fastify-cookie-monster-0.0.1.tgz

COPY --chown=node:node . .

CMD ["node", "server-docker.js"]
