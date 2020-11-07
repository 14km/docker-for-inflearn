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

### 도커 파일을 빌드하자!

```docker
# Dockerfile.dev

docker build -t connor/node:1.0.0 Dockerfile.dev

...

unable to prepare context: context must be a directory
Dockerfile  
```

→ 빌드를 해보니.. 오류가 발생된다.

→ 원래 이미지를 빌드할 때 해당 디렉토리만 Dockerfile을 스스로 찾아 빌드를 해주는데..

→ Dockerfile을 정확히 찾지 못하여 에러가 발생된 건이다.

→ `docker build -t connor/node:1.0.0 -f Dockerfile.dev ./`

### docker build -f 를 통해서 한다.

```docker
# Dockerfile.dev를 빌드한다.
docker build -t connor/node:1.0.0 -f Dockerfile.dev ./
```

→ 다음과 같이 빌드가 가능해진다.

### node_modules 를 지워도 괜찮다.

```docker
#Dockerfile 내에 파일 내용중..

...

COPY package.json ./

RUN npm install

COPY ./ ./

...
```

→ npm install 에서 node_modules가 설치된다.

→ 기존 react app을 설치할때 자동으로.. 반영되어 있으므로 즉, 로컬은 지워도된다.
