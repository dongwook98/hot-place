import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import './PlaceForm.css';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import Card from '../../shared/components/UIElement/Card';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const auth = useContext(AuthContext);
  const placeId = useParams().placeId;
  const history = useHistory();

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

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [placeId, sendRequest, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
        }
      );

      history.push(`/${auth.userId}/places`);
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>해당 장소를 찾지 못했습니다.</h2>
        </Card>
      </div>
    );
  }

  // Input 컴포넌트의 initialValue는 데이터 채워준 후 전달 되어야함. (state가 아님)
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <Input
          id='title'
          element='input'
          type='text'
          label='제목'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='필수 입력 항목입니다.'
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
        />
        <Input
          id='description'
          element='textarea'
          label='설명'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='최소 5글자 이상이어야 합니다.'
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
        />
        <Button type='submit' disabled={!formState.isFormValid}>
          수정
        </Button>
      </form>
    </React.Fragment>
  );
};

export default UpdatePlace;
