import React, { useState, useContext } from 'react';

import './Auth.css';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import Card from '../../shared/components/UIElement/Card';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hooks';
import { AuthContext } from '../../shared/context/auth-context';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
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
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
    } else {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formState.inputs.name.value,
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
            }),
          }
        );
        const responseData = await response.json();
        console.log(responseData);
      } catch (err) {
        console.log(err);
        setError(
          err.message || '오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'
        );
      }
    }
    setIsLoading(false);
    auth.login();
  };

  return (
    <Card className='authentication'>
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
  );
};

export default Auth;
