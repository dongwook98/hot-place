const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }, // Place 모델과 연결
});

// model 메서드: 첫번째 인수의 이름을 가지는 생성자 함수 반환
module.exports = mongoose.model('Place', placeSchema);
