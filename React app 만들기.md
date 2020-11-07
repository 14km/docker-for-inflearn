# React APP을 구현 해보자.

## React

- 설치를 해보자

```docker
# 원하는 dir에 설치하기 위함.
npx create-react-app ./
```

- 설치 후 `npm run start`, `npm run build` 등.. 다양한 방식으로 실행이 가능하다.

## Docker를 이용하여 React를 실행해보자!

- 도커파일을 dev용, prod용으로 분리하여 사용하는 것이 좋다.
- detail한 설정을 할 수 있기 때문에..

### package.json 을 먼저 한다..

```docker
FROM node:aline

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "start"]
```

- 불필요한 종속성때문에, 다음과 같이 설정해야한다.
