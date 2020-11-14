## 레디스란?

- Redis(REmote Dictionary Server) 메모리 기반의 키-값 구조 데이터 관리 시스템이며, 모든 데이터를 메모리에 저장하고 빠르게 영속적으로 보관할 수 있다. 서버를 재부팅하여도 데이터를 유지함.

### 쓰는 이유?

- 메모리에 저장을 하기 때문에 Mysql같은 데이터베이스에 데이터를 저장하는 것과 데이터를 불러올때 훨씬 빠르게 처리가 가능하다.
- 메모리에 저장하지만, 영속적으로도 보관이 가능하다.

## Node.js 환경에서 Redis 사용 방법

- 먼저 redis-server를 작동시켜야한다.
- redis 모듈을 다운로드 받는데.
- 레디스 모듈을 받은 후 레디스 클라이언트를 생성하기 위해서 Redis에서 제공하는 createClinet() 함수를 이용해 redis.createClient로 레디스 클레이언트를 생성한다.
- 하지만, 여기서 redis server가 작동하는 곳과 Node.js 앱이 작동하는곳이 다르다면, 네트워크 연결이 필요하다. (port, host) 인자를 명시해줘야한다.
- 레디스 서버가 작동하는 곳이 `[redis-server.com](http://redis-server.com)` 이라면 아래와 같이 명시해야 한다.

```jsx
const redisClient = redis.createClient({
  host: "https://[redis-server.com](http://redis-server.com)",
  port: 6379,
});
```

### 도커의 환경에서는 어떻게 redis 설정을 하지?

- 보통 도커를 사용하지 않는 환경에서는 Redis 서버가 작동되고 있는 곳의 host 옵션을 URL로 설정하지만,
도커 Compose를 이용하여 Host 옵션을 `docker-compose.yml` 파일에 명시하여 입력해주면 된다.

```jsx
// 레디스 클라이언트 생성
const redisClient = redis.createClient({
  host: "redis-server",
  port: 6379,
});
```
## 도커 파일을 제작하자!

```docker
FROM node:10

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

CMD ["node", "server.js"]
```

→ compose를 사용할 때, 필요한 정보이다.

---

## 빌드 후 사용해보자..

```docker
# docker file in dir
docker build -t connor/node:1.0.0 ./

...

# 에러가 발생된다..
docker run connor/node:1.0.0                   
internal/modules/cjs/loader.js:638
    throw err;
    ^

Error: Cannot find module '/usr/src/app/server.js'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:636:15)
    at Function.Module._load (internal/modules/cjs/loader.js:562:25)
    at Function.Module.runMain (internal/modules/cjs/loader.js:831:12)
    at startup (internal/bootstrap/node.js:283:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:623:3)
```

→ 왜 에러가 발생되지??

→ 이유는, 도커 컨테이너 끼리 설정없이는 분리된 공간을 접근할 수 없기 때문이다.

→ 멀티 컨테이너의 경우는 네트워크를 설정 해줘야 한다.

→ 이때 `docker compose`를 사용하면 된다..!

---

## Docker compose file을 작성해보자.

- `docker-compose.yml` 파일을 생성하면 된다.

```docker
그전에..yml 파일이 먼데요??

yml 파일이란..

YAML ain't markup language의 약자이다.
일반적으로 구성 파일 및 데이터가 저장되거나 전송되는 응용 프로그램에서 사용되고
원래 XML 이나 json 포맷으로 많이 쓰였지만, 좀 더 사람이 읽기 쉽게 만들어 졌다.
```

### APP을 위한 docker-compose 파일의 구조이다.

```docker
version: "3"
services:
  redis-server:
    image: "redis"
  node-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:8000"
```

- `docker-compose up -d` 다음과 같은 명령어로 back-ground에서 실행이 가능하다.
- `docker-compose up` vs `docker-compose up --build`

    → `docker-compose up` 이미지가 없을때 빌드 하고 컨테이너를 시작한다.

    → `docker-compose up —build` 이미지가 있어도 새로 빌드하고 컨테이너를 시작한다.

## Docker-compose 멈추기를 하자.

- `docker-compose down` 를 사용하여 중지할 수 있다.

```docker
CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                    NAMES
1bdbe4e8acc7        redis                 "docker-entrypoint.s…"   44 seconds ago      Up 42 seconds       6379/tcp                 node-redis_redis-server_1
add6073807a2        node-redis_node-app   "docker-entrypoint.s…"   44 seconds ago      Up 42 seconds       0.0.0.0:5000->8000/tcp   node-redis_node-app_1

...

docker-compose down
Stopping node-redis_redis-server_1 ... done
Stopping node-redis_node-app_1     ... done
Removing node-redis_redis-server_1 ... done
Removing node-redis_node-app_1     ... done
Removing network node-redis_default

...

docker ps

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

- docker-compose 파일을 중지할 수 있다.
