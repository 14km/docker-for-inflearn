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
