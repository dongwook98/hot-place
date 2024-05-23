const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pId;

  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    // 동기식 미들웨어에는 throw 사용 가능.
    // (하지만 대부분 데이터베이스 연결과 같은 비동기 미들웨어 사용하기 때문에 next 사용 해야함)
    throw new HttpError('해당 ID에 대한 장소를 찾지 못했습니다.', 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uId;

  const places = DUMMY_PLACES.filter((place) => place.creator === userId);

  if (!places || places.length === 0) {
    return next(
      new HttpError('해당 사용자 ID에 대한 장소들을 찾지 못했습니다.', 404)
    ); // return 반드시 추가. next는 중단 하지 않음.
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(
      '유효하지 않은 입력 데이터를 전달했습니다. 데이터를 확인하세요.',
      422
    );
  }

  // POST 요청에는 본문에 데이터가 있음.
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(
      '유효하지 않은 입력 데이터를 전달했습니다. 데이터를 확인하세요.',
      422
    );
  }

  const placeId = req.params.pId;
  const { title, description } = req.body;

  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => place.id === placeId),
  };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
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
