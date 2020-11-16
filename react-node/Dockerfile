FROM node:alpine as builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY ./ ./

# build 를 통하여 nginx를 이용하여 정적 파일을 보여준다.
CMD ["npm", "run", "build"]

FROM nginx
EXPOSE 80

COPY --from=builder /usr/src/app/build /usr/share/nginx/html

