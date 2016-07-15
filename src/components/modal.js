import React from 'react';

const Modal = (props) => {
  const { message, hideModal } = props;
  return (
    <div onClick={hideModal} className="modal" >
      {message !== '' ? <h1>{message}</h1> : ''}
    </div>
  );
};

export default Modal;
