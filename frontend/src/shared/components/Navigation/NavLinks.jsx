import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';
import { AuthContext } from '../../context/auth-context';
import Button from '../FormElement/Button';

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/' exact>
          핫 스팟 구경
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to='/u1/places' exact>
            나의 스팟
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to='/places/new' exact>
            스팟 추가
          </NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to='/auth' exact>
            로그인 | 회원가입
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <Button onClick={auth.logout}>로그아웃</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
