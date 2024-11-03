// src/components/PlayerRole.js
import React, { useState } from 'react';

const PlayerRole = ({ role, inventory, onOrder, turn }) => {
  const [orderAmount, setOrderAmount] = useState(0);

  const handleOrderChange = (e) => {
    setOrderAmount(Number(e.target.value));
  };

  const handleOrderSubmit = () => {
    onOrder(role.id, orderAmount);
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      <h3>{role.name}</h3>
      <p>Inventory: {inventory}</p>
      <p>Ordered: {role.ordered}</p>
      <p>Received: {role.received}</p>
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

export default PlayerRole;
