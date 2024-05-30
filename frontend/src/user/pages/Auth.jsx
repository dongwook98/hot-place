import React, { useState, useContext } from 'react';

import './Auth.css';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import Card from '../../shared/components/UIElement/Card';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElement/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      // signup mode -> login mode 전환할 때 실행
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      // login mode -> signup mode 전환할 때 실행
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(responseData.user.id);
      } catch (err) {}
    } else {
      // 바이너리 데이터인 파일을 전송하기 위해 FormData API 사용
      const formData = new FormData();
      formData.append('email', formState.inputs.email.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('password', formState.inputs.password.value);
      formData.append('image', formState.inputs.image.value);
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users/signup`,
          'POST',
          formData // formData 사용 시 Fetch API가 자동으로 올바른 헤더 추가해줌
        );
        auth.login(responseData.user.id);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>로그인</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element='input'
              id='name'
              type='text'
              label='이름'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='이름을 입력해주세요.'
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id='image'
              onInput={inputHandler}
              errorText='이미지를 업로드 해주세요.'
            />
          )}
          <Input
            id='email'
            element='input'
            type='email'
            label='이메일'
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            errorText='이메일 형식을 입력해주세요.'
            onInput={inputHandler}
          />
          <Input
            id='password'
            element='input'
            type='password'
            label='비밀번호'
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText='최소 8글자 이상 입력해주세요.'
            onInput={inputHandler}
          />
          <Button type='submit' disabled={!formState.isFormValid}>
            {isLoginMode ? '로그인' : '회원가입'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? '회원가입 하러가기' : '로그인 하러가기'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
