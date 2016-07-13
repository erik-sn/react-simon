import React from 'react';

const Modal = (props) => {
  const { result, text, choice } = props;
  return (
    <div className="modal" style={{height: result !== '' ? '225px' : '150px' }}>
      {result !== '' ? <h1>{result}</h1> : ''}
      <div id="modal-text">{text}</div>
      <div id="choice-container">
        <div className="user-choice" onClick={() => choice('X')}>X</div>
        <div className="user-choice" onClick={() => choice('O')}>O</div>
      </div>
    </div>
  );
};

export default Modal;
