const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlegnth: 8 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }], // Place 모델과 연결, 한 사용자에 여러개의 장소를 가질 수 있으므로 []으로 감싸줌
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
