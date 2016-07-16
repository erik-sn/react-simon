import React from 'react';

const Counter = (props) => {
  const { count, style } = props;
  return (
    <div className="setting-row-item" style={style}>
      <div id="counter" >{count}</div>
      <div className="label" style={style} >Count</div>
    </div>
  );
}

export default Counter;
// { width: '60px' }