import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './PlaceForm.css';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import ImageUpload from '../../shared/components/FormElement/ImageUpload';
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
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('creator', auth.userId);
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/places`,
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );

      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className='place-form' onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <ImageUpload
          id='image'
          center
          onInput={inputHandler}
          errorText='필수 입력 항목입니다.'
        />
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
