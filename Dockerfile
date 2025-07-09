FROM public.ecr.aws/docker/library/node:18.18.2-slim

RUN apt-get update && apt-get install -y curl

WORKDIR /backend

RUN chown -R node /backend

COPY package.json ./
RUN npm install -g npm@10.7.0 \
    && npm install --legacy-peer-deps \
    && npm install ts-node@latest --legacy-peer-deps \
    && npm install ts-node --save-dev --legacy-peer-deps \
    && npm install typescript -g --legacy-peer-deps \
    && npm install typescript --save-dev --legacy-peer-deps

COPY . .

EXPOSE 3001

USER node

CMD ["npm", "run", "docker"]
