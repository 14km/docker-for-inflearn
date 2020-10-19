# Node.js App 만들기!

- 실제로 Docker를 이용해서 Node 환경을 구성하자!

## Package.json 생성!

- `npm init` 명령어를 통하여 `package.json`을 추가한다!
- `dependencies` 항목에 `express` 모듈을 추가하자!

```docker
{
  "name": "docker-node",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "author": "",
  "license": "ISC"
}
```

## Server.js를 생성!

```jsx
// server.js
// express 모듈을 불러온다!
const express = require('express');

// express PORT 설정값
const PORT = 8080;
// express 호스트 주소
const HOST = '0.0.0.0';

// express class 인스턴스를 생성한다.
const app = express();

// get method 설정!
app.get('/', (req, res) => {
  res.send('hello World');
});

// 해당 서버의 포트 및 호스트를 설정하는 것.
app.listen(PORT, HOST);

// 단순 로그를 남겨보자!
console.log(`Running on http:://${HOST}:${PORT}`);
```

## 도커 파일을 만들자!

```jsx
FROM node:10

RUN npm install

CMD["node", "server.js"]
```

- alpine 으로 하지 않는 이유는..?
→ alpine의 이미지의 경우는 NPM이 설치가 되지않아 있기 때문에 
→ 이 경우 npm 부터 다시 깔아줘야한다..

### 그리고 빌드를하면..?

```jsx
docker build ./

...

Sending build context to Docker daemon  4.096kB
Step 1/3 : FROM node:10
10: Pulling from library/node
0400ac8f7460: Pull complete 
fa8559aa5ebb: Pull complete 
da32bfbbc3ba: Pull complete 
e1dc6725529d: Pull complete 
572866ab72a6: Pull complete 
63ee7d0b743d: Pull complete 
90a199058c87: Pull complete 
eec01b4217d9: Pull complete 
a6a01f1bcd7b: Pull complete 
Digest: sha256:9d06418fa4335f9cf96c59d5c09372f7a56329e7234456ee9fe2340c4ac35a95
Status: Downloaded newer image for node:10
 ---> 56387899b840
Step 2/3 : RUN npm install
 ---> Running in 743f5e69bb50
npm WARN saveError ENOENT: no such file or directory, open '/package.json'
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN enoent ENOENT: no such file or directory, open '/package.json'
npm WARN !invalid#2 No description
npm WARN !invalid#2 No repository field.
npm WARN !invalid#2 No README data
npm WARN !invalid#2 No license field.

up to date in 0.356s
found 0 vulnerabilities
```

- 에러가 발생된다..! 왜 발생되지?
- 현재 디렉토리에는 package.json 파일이 존재하는데!?

### 그 이유를 알아보자!

- `npm install`이 실행될 때 `package.json`이 필요한데, 임시 생성된 컨테이너 내에 파일들이 들어가있지 않아 실행할 수 없는 상태가 된것이다.
( 물리적인 위치에서 컨테이너가 밖에 있는 것이다.)

## COPY 를 통하여 컨테이너에 넣어주자

```docker
# 복사할 파일, 복사될 경로를 지정할 수 있다.
COPY package.json ./
```

→ COPY 를 통하여 해당 파일을 복사할 수 있다.

→ `COPY <복사할 파일의 경로> <복사될 경로>`

```docker
# Base Image
FROM node:10

# 복사될 파일의 경로와 복사될 경로.
COPY package.json ./

# npm install 명령어를 통하여 NPM Registy -> Module download 가 실행된다.
RUN npm install

CMD ["node", "server.js"]
```

→ 정상적으로 되지않았다.. 
→ server.js 파일도 없기 때문에 COPY를 처리 해줘야 한다.

```docker
# Base Image
FROM node:10

# 복사될 파일의 경로와 복사될 경로.
COPY ./ ./

# npm install 명령어를 통하여 NPM Registy -> Module download 가 실행된다.
RUN npm install

CMD ["node", "server.js"]

...

docker build -t connor/node:0.0.3 ./
Sending build context to Docker daemon  4.096kB
Step 1/4 : FROM node:10
 ---> 56387899b840
Step 2/4 : RUN npm install
 ---> Using cache
 ---> 525c269d17ee
Step 3/4 : COPY ./ ./
 ---> f313909cb016
Step 4/4 : CMD ["node", "server.js"]
 ---> Running in b74f38d11a75
Removing intermediate container b74f38d11a75
 ---> a10dd0549011
Successfully built a10dd0549011
Successfully tagged connor/node:0.0.3

...

docker run connor/node:0.0.4

# 정상적으로 실행이 완료 되었다.      
Running on http:://0.0.0.0:8080
```

→ 모든 파일의 경로를 지정하여 임시 컨테이너에 적재하면 정상적으로 처리가 가능하다.

→ 생성은 되었으나 접근이 안된다..

## 컨테이너의 Port 를 설정해보자.

```docker
docker run -p 49160:8080 <docker image>
```

- 우리가 이미지를 만들때 package.json 등을 copy해서 보내줬다.
- 하지만, 네트워크 관련 설정은 되지 않은 상태이다.
- 즉, 외부 네트워크와 내부 네트워크를 연결 해야한다.

→ 다음과 같은 포트 매핑 작업이 필요하다.

`docker run -p 49160:8080 <image>`

```docker
# 외부 포트, 내부포트를 지정해주면 정상적으로 이미지 접근이 완료 된다.
docker run -p 8080:8080 connor/node:0.0.5
```
