import React from 'react';

const CookingTimeCounter = ({ cookingTime, setCookingTime }) => {
  const incrementCookingTime = () => {
    setCookingTime(prevTime => prevTime + 1);
  };

  const decrementCookingTime = () => {
    setCookingTime(prevTime => (prevTime > 1 ? prevTime - 1 : 1));
  };

  return (
    <div>
      <label>Cooking Time</label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button type="button" onClick={decrementCookingTime}>
          -
        </button>
        <input
          type="number"
          value={cookingTime}
          onChange={e => setCookingTime(Math.max(1, parseInt(e.target.value)))}
          min="1"
          readOnly
          style={{ width: '50px', textAlign: 'center' }}
        />
        <span>min</span>
        <button type="button" onClick={incrementCookingTime}>
          +
        </button>
      </div>
    </div>
  );
};

export default CookingTimeCounter;
