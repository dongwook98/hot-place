import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: '엠파이어 스테이트 빌딩',
    description: 'One of the Most famous sky scrapers in the world!',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Empire_States_Building.jpg/275px-Empire_States_Building.jpg',
    address: '20 W 34th St., New York, NY 10001 미국',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: '엠파이어 스테이트 빌딩',
    description: 'One of the Most famous sky scrapers in the world!',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Empire_States_Building.jpg/275px-Empire_States_Building.jpg',
    address: '20 W 34th St., New York, NY 10001 미국',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u2',
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);

  return <PlaceList item={loadedPlaces} />;
};

export default UserPlaces;
