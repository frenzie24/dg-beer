// src/components/Player.js
import React, { useState } from 'react';

const Player = ({ player, onOrder }) => {
  const [orderAmount, setOrderAmount] = useState(0);

  const handleOrderChange = (e) => {
    setOrderAmount(Number(e.target.value));
  };

  const handleOrderSubmit = () => {
    onOrder(player.id, orderAmount);
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      <h3>Player {player.id}</h3>
      <p>Inventory: {player.inventory}</p>
      <p>Ordered: {player.ordered}</p>
      <p>Received: {player.received}</p>
      <input
        type="number"
        value={orderAmount}
        onChange={handleOrderChange}
        min="0"
      />
      <button onClick={handleOrderSubmit}>Order</button>
    </div>
  );
};

export default Player;
