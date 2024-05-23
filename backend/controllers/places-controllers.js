const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

// 메모리 스토리지. 나중에 데이터베이스로 교체 예정.
let DUMMY_PLACES = [
  {
    id: 'p1',
    title: '엠파이어 스파이어 빌딩',
    description: '세상에서 가장 높은 빌딩',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
];

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
    places = (await Place.find({ creator: userId })).map((place) =>
      place.toObject({ getters: true })
    );
  } catch (err) {
    const error = new HttpError(
      '오류가 발생했습니다. 장소들을 찾을 수 없습니다.',
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    // ! return 반드시 추가. next는 중단 하지 않음.
    return next(
      new HttpError('해당 사용자 ID에 대한 장소들을 찾지 못했습니다.', 404)
    );
  }

  res.json({ places: places });
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

  // POST 요청에는 본문에 데이터가 있음.
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
    image:
      'https://plus.unsplash.com/premium_photo-1669253767213-404f6888e895?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHx8',
    creator,
  });

  try {
    // 모델의 인스턴스로 데이터베이스 문서 생성
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      '장소 생성에 실패했습니다. 다시 시도하세요.',
      500
    );
    return next(error); // ! return 반드시 작성, 작성 안할시 다음 줄 실행
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(
      '유효하지 않은 입력 데이터를 전달했습니다. 데이터를 확인하세요.',
      422
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

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pId;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError('id에 해당하는 장소를 찾지 못했습니다.', 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: 'Deleted Place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
