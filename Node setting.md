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
