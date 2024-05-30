const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pId;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      '오류가 발생했습니다. 장소를 찾을 수 없습니다.',
      500
    );
    return next(error);
  }

  if (!place) {
    // 동기식 미들웨어에는 throw 사용 가능.
    // (하지만 대부분 데이터베이스 연결과 같은 비동기 미들웨어 사용하기 때문에 next 사용 해야함)
    const error = new HttpError('해당 ID에 대한 장소를 찾지 못했습니다.', 404);
    return next(error);
  }

  // mongoose 고유 객체를 일반 자바스크립트 객체로 변환해서 응답
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uId;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      '오류가 발생했습니다. 장소들을 찾을 수 없습니다.',
      500
    );
    return next(error);
  }

  if (!places) {
    // ! return 반드시 추가. next는 중단 하지 않음.
    return next(
      new HttpError('해당 사용자 ID에 대한 장소들을 찾지 못했습니다.', 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        '유효하지 않은 입력 데이터를 전달했습니다. 데이터를 확인하세요.',
        422
      )
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // 모델의 인스턴스 생성
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      '장소 생성에 실패했으니, 다시 시도해주세요.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      '제공된 ID에 해당하는 사용자를 찾을 수 없습니다.',
      404
    );
    return next(error);
  }

  console.log(user);

  try {
    // 트랜잭션을 하기위해 세션 시작
    const sess = await mongoose.startSession();
    // 트랜잭션 시작
    sess.startTransaction();
    // places 문서에 장소 생성 저장
    await createdPlace.save({ session: sess });
    // users 문서에 장소 id 추가
    user.places.push(createdPlace);
    // users 문서 저장
    await user.save({ session: sess });
    // 트랜잭션 커밋
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      '장소 생성에 실패했습니다. 다시 시도하세요.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        '유효하지 않은 입력 데이터를 전달했습니다. 데이터를 확인하세요.',
        422
      )
    );
  }

  const placeId = req.params.pId;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      '오류가 발생했습니다. 장소를 수정할 수 없습니다.',
      500
    );
    return next(error);
  }
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      '오류가 발생했습니다. 장소를 수정할 수 없습니다.',
      500
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pId;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      '오류가 발생했습니다. 장소를 삭제할 수 없습니다.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('제공된 ID에 해당하는 장소가 없습니다.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      '오류가 발생했습니다. 장소를 삭제할 수 없습니다.',
      500
    );
    return next(error);
  }

  res.json({ message: '장소 삭제에 성공 하였습니다.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
