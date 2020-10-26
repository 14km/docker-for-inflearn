# Base Image
FROM node:10

# WORKDIR 순서를 맞춰야 한다.
WORKDIR /usr/src/app

COPY package.json ./

# npm install 명령어를 통하여 NPM Registy -> Module download 가 실행된다.
RUN npm install

COPY ./ ./

CMD ["node", "server.js"]
