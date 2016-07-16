import React from 'react';

const Wedge = (props) => {
  const { object, color, checkIndexes, activeColor, sequenceActive, started } = props;
  const active = ` ${color}-active`;
  let style = {};
  if (activeColor && activeColor.index === object.index) {
    style.backgroundColor = activeColor.color;
  }
  if (!sequenceActive && started) {
    style.cursor = 'pointer';
  }

  return (
    <div
      id={`${color}-container`}
      onClick={() => {

        checkIndexes(object.index);
      }}
      style={style}
      className={`wedge${!sequenceActive && started ? active : ''}`}
    />
  );
};

export default Wedge;
