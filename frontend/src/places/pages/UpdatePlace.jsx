import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './PlaceForm.css';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import Card from '../../shared/components/UIElement/Card';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

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

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    // 더미 데이터
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId); // 백엔드 요청

  useEffect(() => {
    // API 응답 후 작업
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className='center'>
        <Card>
          <h2>해당 장소를 찾지 못했습니다.</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='center'>
        <h2>로딩중...</h2>
      </div>
    );
  }

  // Input 컴포넌트의 initialValue는 데이터 채워준 후 전달 되어야함. (state가 아님)
  return (
    <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
      <Input
        id='title'
        element='input'
        type='text'
        label='제목'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='필수 입력 항목입니다.'
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id='description'
        element='textarea'
        label='설명'
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='최소 5글자 이상이어야 합니다.'
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type='submit' disabled={!formState.isFormValid}>
        수정
      </Button>
    </form>
  );
};

export default UpdatePlace;
