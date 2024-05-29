import React from 'react';

import Modal from './Modal';
import Button from '../FormElement/Button';

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header='경고!'
      show={!!props.error}
      footer={<Button onClick={props.onClear}>확인</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
