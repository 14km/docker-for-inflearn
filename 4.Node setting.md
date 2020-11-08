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

## WORKDIR

- Docker `WORKDIR /usr/src/app`
- 이미지안에서 어플리케이션 소스 코드를 갖고 있을 디렉토리를 생성하는 것이다.
- 이 디렉토리가 app에 `working` 디렉토리가 된다.

```docker
# workdir이 따로 존재하지 않는 경우
# 

...

sh# ls -l
total 96
-rw-r--r--   1 root root   168 Oct 19 15:10 Dockerfile
drwxr-xr-x   1 root root  4096 Oct 13 02:25 bin
drwxr-xr-x   2 root root  4096 Jul 10 21:05 boot
drwxr-xr-x   5 root root   340 Oct 19 15:22 dev
drwxr-xr-x   1 root root  4096 Oct 19 15:22 etc
drwxr-xr-x   1 root root  4096 Oct 13 08:43 home
drwxr-xr-x   1 root root  4096 Oct 13 02:25 lib
drwxr-xr-x   2 root root  4096 Oct 12 07:00 lib64
drwxr-xr-x   2 root root  4096 Oct 12 07:00 media
drwxr-xr-x   2 root root  4096 Oct 12 07:00 mnt
drwxr-xr-x  52 root root  4096 Oct 19 15:11 node_modules
drwxr-xr-x   1 root root  4096 Oct 13 08:49 opt
-rw-r--r--   1 root root 14287 Oct 19 15:11 package-lock.json
-rw-r--r--   1 root root   289 Oct 18 17:02 package.json
dr-xr-xr-x 149 root root     0 Oct 19 15:22 proc
drwx------   1 root root  4096 Oct 19 15:11 root
drwxr-xr-x   3 root root  4096 Oct 12 07:00 run
drwxr-xr-x   1 root root  4096 Oct 13 02:25 sbin
-rw-r--r--   1 root root   496 Oct 18 17:07 server.js
drwxr-xr-x   2 root root  4096 Oct 12 07:00 srv
dr-xr-xr-x  12 root root     0 Oct 19 15:22 sys
drwxrwxrwt   1 root root  4096 Oct 13 08:49 tmp
drwxr-xr-x   1 root root  4096 Oct 12 07:00 usr
drwxr-xr-x   1 root root  4096 Oct 12 07:00 var

... 
```

- COPY 파일은 파일 시스템에 들어오게 된다.
- 하지만, workdir를 지정하지 않았을 경우는.. 위와 같이 노출된다.

### WORKDIR 이 지정되지 않았다면?

- 베이스 이미지에 home이라는 폴더에 COPY 하게 된다.
- 즉, 새로 추가되는 폴더 중에 home이라는 폴더가 있다면 중복이 되므로 원래 있던 폴더가 덮어씌워져 버리는 문제가 생긴다.
- 모든 파일이 한 디렉토리에 들어가 버리니 너무 정리가 안된다.

→ 즉, 어플리케이션을 위한 소스 WORK 디렉토리를 따로 만들자!

```docker
# Base Image
FROM node:10

WORKDIR /usr/src/app

COPY ./ ./

# npm install 명령어를 통하여 NPM Registy -> Module download 가 실행된다.
RUN npm install

CMD ["node", "server.js"]
```

---
## 어플리케이션 소스 변경으로 다시 빌하는 문제점..

- 소스코드를 계속 변경시켜 변경 된 부분을 어플리케이션에 반영시키려면..
- Docker 표시된 이 구간 전체를 (이미지 생성부터) 다시 실행시켜야 합니다.


## Docker Volume에 대하여...

- COPY 만으로는 현재, 단순히 복사만을 하는 것이다.
- 수정된 내용을 사용하려면, Volume 설정을 해야 한다

→ 볼륨의 경우는 Mapping(참조) 하는 형태로 지정되어야 파일 변경시 같이 변경된다.
→ `-v /usr/src/app/node_modiles` → 매핑을 하지 않도록 설정하기 위함.
→ -`v $(pwd):/usr/src/app`  pwd 경로에 있는 디렉토리 폭은 파일은 /usr/src/app 경로에서 참조한다.

### CLI

```docker
docker run -p 5000:8080 -v /usr/src/app/node_modules -v $(pwd):/usr/src/app <images>

# /usr/src/app
# 경로가 설정된 이유는?? WORKING DIR에 설정이 /usr/src/app이기 때문에..
```

→ 도커 이미지를 바꾸지 않아도 자동으로 볼륨이 빌드될 수 있다.
