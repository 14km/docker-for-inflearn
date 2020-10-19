# Base Image
FROM node:10

COPY ./ ./

# npm install 명령어를 통하여 NPM Registy -> Module download 가 실행된다.
RUN npm install

CMD ["node", "server.js"]
