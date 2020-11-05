const express = require('express');
const redis = require('redis');

// 레디스 클라이언트 생성
const redisClient = redis.createClient({
  host: 'redis-server',
  port: 6379,
});

const app = express();

// 숫자는 0부터 시작한다.
redisClient.set('number', 0);

app.get('/', (req, res) => {
  redisClient.get('number', (err, number) => {
    // 현재 숫자를 가져온 후 1 씩 증가시킨다.
    redisClient.set('number', parseInt(number) + 1);
    res.send(`숫자가 ${number}씩 증가합니다.`);
  });
});

app.listen(8080);
console.log('Server Run!!');
