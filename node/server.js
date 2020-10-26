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
  res.send('반갑습니다...!!!');
});

// 해당 서버의 포트 및 호스트를 설정하는 것.
app.listen(PORT, HOST);

// 단순 로그를 남겨보자!
console.log(`Running on http:://${HOST}:${PORT}`);
