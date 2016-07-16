import React from 'react';

const Button = (props) => {
  const { click, label, id, style } = props;
  return (
    <div className="setting-row-item" style={style}>
      <div id={id} onClick={click} />
      <span className="label" >{label}</span>
    </div>
  );
}

export default Button;
