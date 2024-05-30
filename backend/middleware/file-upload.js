const multer = require('multer');
const uuid = require('uuid').v1;

const MINE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

// multer(): 파일업로드 미들웨어를 포함하고 있는 객체 생성
const fileUpload = multer({
  // 파일 용량 제한 500kb
  limits: 500000,
  // multer.diskStorage(): 파일 저장 드라이버
  storage: multer.diskStorage({
    // destination: 파일 저장될 목적지 제어
    destination: (req, file, callback) => {
      callback(null, 'uploads/images');
    },
    // filename: 파일 이름 제어
    filename: (req, file, callback) => {
      // 파일 확장자
      const ext = MINE_TYPE_MAP[file.mimetype];
      callback(null, uuid() + '.' + ext);
    },
  }),
  // 파일 유효성 검사
  fileFilter: (req, file, callback) => {
    const isValid = !!MINE_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('유효하지 않은 mime 타입!');
    callback(error, isValid);
  },
});

module.exports = fileUpload;
