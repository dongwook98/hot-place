const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const HttpError = require('./models/http-error');

const app = express();

// req.body 데이터를 받기위해 body-parser 패키지 사용.
// 이 파서는 요청이 들어오면 본문을 파싱하고 본문에 있는 JSON 데이터를 추출해서
// 객체나 배열과 같이 일반적인 JS 데이터 구조로 변환.
// 그리고 자동으로 next를 호출해서 순서상 다음 미들웨어에 도달.
app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // => /api/places/...

// 라우트들에서 응답했다면 next를 호출하지 않기 때문에 이 미들웨어 실행이 안될 것.
// 지원하지 않는 라우트에 대한 오류 처리.
app.use((req, res, next) => {
  const error = new HttpError('라우트를 찾지 못했습니다.', 404);
  throw error;
});

// default 에러 핸들러. 중복 제거.
app.use((error, req, res, next) => {
  if (res.headerSent) {
    // 이미 응답을 전송했다면 응답을 전송하지 않도록 설정
    return next(error);
  }
  // 응답을 아직 전송하지 않았다면 새로운 응답 전송
  res
    .status(error.code || 500)
    .json({ message: error.message || '알 수 없는 오류가 발생했습니다.' });
});

app.listen(5001);
