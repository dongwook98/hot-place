import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './PlaceForm.css';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/places`,
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId,
        }),
        {
          'Content-Type': 'application/json',
        }
      );
      // 성공 시 리다이렉트
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className='place-form' onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id='title'
          element='input'
          type='text'
          label='제목'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='필수 입력 항목입니다.'
          onInput={inputHandler}
        />
        <Input
          id='description'
          element='textarea'
          label='설명'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='최소 5글자 이상이어야 합니다.'
          onInput={inputHandler}
        />
        <Input
          id='address'
          element='input'
          type='text'
          label='주소'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='필수 입력 항목입니다.'
          onInput={inputHandler}
        />
        <Button type='submit' disabled={!formState.isFormValid}>
          장소 추가
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
