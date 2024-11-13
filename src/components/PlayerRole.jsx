// src/components/PlayerRole.js
import React, { useState } from 'react';

const PlayerRole = ({ role, inventory, received, onOrder, isActive, onNextPlayer, isDisabled }) => {

  const [ordered, setOrdered] = useState(role.ordered)

  const bgcolors = ['bg-sky-500','bg-indigo-700', 'bg-orange-500','bg-red-700']
  const classString = `${bgcolors[role.id]} p-2`;
  const handleOrderChange = (e) => {
    e.preventDefault();
    setOrdered( parseInt(e.target.value) || 0);
 ;
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    onOrder(role.id, ordered);
    onOrder(role.id, ordered);
    setOrdered(0)
    onNextPlayer();
  };


  return (
    <div className={classString}>
      <h3 className="text-2xl font-bold bg-slate-800/10 rounded-lg w-fit p-2">{role.name}</h3>
      <p>Inventory: {inventory}</p>
      <p>Received This Turn: {received}</p>
      <p>Received Shipments Pending: {role.pendingReceived}</p>

      <p>Last Ordered: {role.lastOrder}</p>
      <p>Ordered This Turn: {role.ordered}</p>

      <p>Total Received: {role.totalReceived}</p>
      <input
        type="number"
        value={ordered}
        onChange={handleOrderChange}
        onSubmit={handleOrderSubmit}
        disabled={!isActive || isDisabled} // Disable if not the active player
        className="mt-1 appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

      />
      <button onClick={handleOrderSubmit} disabled={!isActive} className="next-btn mt-2">
        Place Order
      </button>
    </div>
  );
};

export default PlayerRole;
