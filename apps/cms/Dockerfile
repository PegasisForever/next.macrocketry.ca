# Build from project root!

FROM node:14-slim as pruner

WORKDIR /server
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=cms --docker

FROM node:14-slim

WORKDIR /server

COPY --from=pruner /server/out/json/ .
COPY --from=pruner /server/out/yarn.lock ./yarn.lock
RUN yarn install --network-timeout 100000

COPY --from=pruner /server/out/full/ .
WORKDIR /server/apps/cms
RUN yarn generate:types && yarn build

ENTRYPOINT ["yarn", "serve"]