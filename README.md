## 핫플 (Hot Place)

### 배포 주소 - https://hot-spot.vercel.app

### 프로젝트 소개

사용자들간의 특별한 장소들을 공유하는 플랫폼

## 시작 가이드

### 설치

```
$ git clone https://github.com/dongwook98/place-share-app.git
$ cd place-share-app
```

### frontend

```
$ cd frontend
$ npm install
$ npm run dev
```

### backend

```
$ cd backend
$ npm install
$ npm run dev
```

## 기술 스택

### frontend side

react.js, react-router-dom

### backend side

node.js, express.js, mongoDB, mongoose

서드파티 - axios, bcryptjs, body-parser, dotenv, express-validator, jsonwebtoken, multer, uuid, nodemon

### deploy

frontend-deploy: ~~AWS S3, AWS CloudFront~~ -> vercel (과금 이슈)

backend-deploy: ~~AWS EC2, AWS ELB~~ -> railway (과금 이슈)

## 화면 구성

## 주요 기능

- 로그인, 회원가입(Authentication)

- 권한부여(Authorization)

- 핫플 CRUD

- 핫플 지도 뷰로 보기 (Google Maps API)

## 아키텍처
