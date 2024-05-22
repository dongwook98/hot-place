import React from 'react';

import './UsersList.css';
import UserItem from './UserItem';
import Card from '../../shared/components/UIElement/Card';

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>사용자를 찾을 수 없음</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className='users-list'>
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UsersList;
