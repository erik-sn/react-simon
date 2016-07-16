import React from 'react';

const Switch = (props) => {
  const { id, click, style, label1, label2 } = props;
  return (
    <div id="switch-container">
      <span className="switch-child" >{label1}</span>
      <div className="switch-child shadow" id={id}>
        <div
          style={style}
          id="onoff-switch"
          onClick={click}
        />
      </div>
      <span className="switch-child">{label2}</span>
    </div>
  );
};

export default Switch;
