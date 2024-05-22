import React from 'react';

import './PlaceList.css';
import PlaceItem from './PlaceItem';
import Card from '../../shared/components/UIElement/Card';
import Button from '../../shared/components/FormElement/Button';

const PlaceList = (props) => {
  if (props.item.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <h2>장소가 없습니다. 공유해보세요.</h2>
          <Button to='/place/new'>장소 공유하기</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className='place-list'>
      {props.item.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
