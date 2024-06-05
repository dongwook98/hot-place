const fs = require('fs');
const path = require('path');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

// req.body 데이터를 받기위해 body-parser 패키지 사용.
// 이 파서는 요청이 들어오면 본문을 파싱하고 본문에 있는 JSON 데이터를 추출해서
// 객체나 배열과 같이 일반적인 JS 데이터 구조로 변환.
// 그리고 자동으로 next를 호출해서 순서상 다음 미들웨어에 도달.
app.use(bodyParser.json());

// express.static(): 이미지 정적 서빙 미들웨어
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// CORS 에러 처리
app.use((req, res, next) => {
  // 도메인 허용
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 요청 헤더 허용
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // 요청 메서드 허용
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// 위 라우트들에서 응답했다면 next를 호출하지 않기 때문에 아래 미들웨어 실행이 안됨.
// 지원하지 않는 라우트에 대한 오류 처리.
app.use((req, res, next) => {
  const error = new HttpError('라우트를 찾지 못했습니다.', 404);
  throw error;
});

// default 에러 핸들러. 중복 제거.
app.use((error, req, res, next) => {
  // Multer가 파일이 있는 경우 request 객체에 file 프로퍼티 추가해줌
  if (req.file) {
    // 이미지 업로드 롤백
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    // 이미 응답을 전송했다면 응답을 전송하지 않도록 설정
    return next(error);
  }
  // 응답을 아직 전송하지 않았다면 새로운 응답 전송
  res
    .status(error.code || 500)
    .json({ message: error.message || '알 수 없는 오류가 발생했습니다.' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w79twdx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    // DB 연결에 성공했을 경우. 서버 실행
    app.listen(5001);
  })
  .catch((error) => {
    console.log(error);
  });
