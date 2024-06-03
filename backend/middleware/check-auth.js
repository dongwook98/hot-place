const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

// 토큰 검증 미들웨어
module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    // 브라우저 기본 동작 처리, GET 요청 제외 모든 요청은 OPTIONS 요청을 먼저 보냄
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'

    if (!token) {
      // split 연산은 성공했지만 결과 값이 토큰이 아닌 경우
      throw new Error('인증에 실패했습니다.');
    }

    // verify(토큰, 프라이빗키) : 토큰 검증 함수, 반환값은 디코딩된 토큰 값
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // 요청 객체에 userData 속성 추가, 이후 토큰 검증이 완료된 요청 객체의 속성에는 userData가 존재
    req.userData = { userId: decodedToken.userId };
    // 토근 검증이 완료 되면 다음 미들웨어 실행
    next();
  } catch (err) {
    // Authorization 헤더가 정의되지 않아서 split 연산에 실패했을 경우
    const error = new HttpError('인증에 실패했습니다.', 403);
    return next(error);
  }
};
