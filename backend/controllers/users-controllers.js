const uuid = require('uuid').v4;

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: '강동욱',
    email: 'test@test.com',
    password: '12345678',
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({
    message: 'success fetch user list',
    users: DUMMY_USERS,
  });
};

const signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((user) => user.email === email);
  if (hasUser) {
    throw new HttpError(
      '이메일이 이미 존재하므로 사용자를 생성할 수 없습니다.',
      422
    );
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({
    message: 'success create user and login',
    user: createdUser,
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      '사용자를 식별할 수 없으니 자격 증명을 확인하세요.',
      401
    );
  }

  res.status(200).json({
    message: 'success login',
    user: loginUser,
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
