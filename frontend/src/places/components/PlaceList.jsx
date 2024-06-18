import React from 'react';
import { useHistory } from 'react-router-dom';

import './PlaceList.css';
import PlaceItem from './PlaceItem';
import Card from '../../shared/components/UIElement/Card';
import Button from '../../shared/components/FormElement/Button';

const PlaceList = (props) => {
  const history = useHistory();

  if (props.item.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <h2>해당 유저는 공유중인 핫플이 없습니다.</h2>
          <Button onClick={() => history.push('/')} exact>
            홈으로 가기
          </Button>
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
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
