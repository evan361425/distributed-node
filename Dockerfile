# dependencies stage
FROM node:14.8.0-alpine3.12 AS deps

# alias of server
WORKDIR /srv
# package-lock.json, package.json
COPY package*.json ./
# install and compile
RUN npm i --ignore-scripts \
  && npm run compile \
  && rm -rf ./node_modules \
  # clean install
  && npm ci --only=production

# final stage
# Not using npm image is because try making it simpler.
# example: command like `npm` is no need
FROM alpine:3.12 AS release

ENV V 14.8.0
ENV FILE node-v$V-linux-x64-musl.tar.xz


# Add library for Node.js
RUN apk add --no-cache libstdc++ \
  # --no-cache to remove package manager cached data
  # --virtual .deps to keep track of the installed package and its dependencies. Then, later, that group of packages can be removed all at once.
  && apk add --no-cache --virtual .deps curl \
  && curl -fsSLO --compressed \
  "https://unofficial-builds.nodejs.org/download/release/v$V/$FILE" \
  # extract into /usr/local
  && tar -xJf $FILE -C /usr/local --strip-components=1 \
  # remove npm and npx which is no need
  && rm -f $FILE /usr/local/bin/npm /usr/local/bin/npx \
  && rm -rf /usr/local/lib/node_modules \
  && apk del .deps

WORKDIR /srv
COPY --from=deps /srv/node_modules ./node_modules
# best practice, ignore file will show in .dockerignore
COPY . .

EXPOSE 1337
# Application ENV
ENV HOST 0.0.0.0
ENV PORT 1337
# final run up server
CMD [ "node", "dist/recipe-api/producer-http-basic.js" ]
