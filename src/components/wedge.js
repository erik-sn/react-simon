import React from 'react';

const Wedge = (props) => {
  const { index, color, checkIndexes, activeColor, sequenceActive, started } = props;
  const active = ` ${color}-active`;
  let style;
  if (activeColor) {
    style = activeColor.index === index ? { backgroundColor: activeColor.color } : {};
  }
  return (
    <div
      id={`${color}-container`}
      onClick={() => checkIndexes(index)}
      style={style}
      className={`wedge${!sequenceActive && started ? active : ''}`}
    />
  );
};

export default Wedge;
