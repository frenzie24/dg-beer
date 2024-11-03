import React, { useState } from 'react';

const Player = ({ name, inventory, orders, incomingOrder, placeOrder }) => {
  const [order, setOrder] = useState(0);

  const handleOrderChange = (e) => setOrder(e.target.value);
  const handleOrderSubmit = () => placeOrder(name, Number(order));

  return (
    <div className="p-4 m-4 border border-gray-300 rounded">
      <h2 className="text-lg font-bold">{name}</h2>
      <p>Inventory: {inventory}</p>
      <p>Incoming Order: {incomingOrder}</p>
      <p>Orders: {orders.join(', ')}</p>
      <input
        type="number"
        value={order}
        onChange={handleOrderChange}
        className="border border-gray-300 p-2"
      />
      <button onClick={handleOrderSubmit} className="ml-2 bg-blue-500 text-white p-2 rounded">
        Place Order
      </button>
    </div>
  );
};

export default Player;
