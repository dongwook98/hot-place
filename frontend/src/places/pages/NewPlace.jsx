import React from 'react';

import './PlaceForm.css';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hooks';

const NewPlace = () => {
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

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState); // TODO 백엔드 요청 보내기
  };

  return (
    <form className='place-form' onSubmit={placeSubmitHandler}>
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
  );
};

export default NewPlace;
