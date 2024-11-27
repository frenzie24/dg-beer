// src/components/PlayerRole.js
import React, { useState } from 'react';
import Table from './Table';

const PlayerRole = ({ role, inventory, received, onOrder, isActive, onNextPlayer, isDisabled,  }) => {

  const [ordered, setOrdered] = useState(role.ordered)

  const bgcolors = ['bg-sky-500', 'bg-indigo-700', 'bg-orange-500', 'bg-red-700']
  const classString = `${bgcolors[role.role_id]} p-2 flex flex-row flex-wrap justify-center`;
  const handleOrderChange = (e) => {
    e.preventDefault();
    setOrdered(parseInt(e.target.value) || 0);

  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    onOrder(role.role_id, ordered);
    // onOrder(role.id, ordered);
    setOrdered(0);
    onNextPlayer();
  };


  return (
    <div className={classString}>
      <h3 className="[text-shadow:_2px_2px_2px_rgb(0_0_0_/_80%)] text-3xl text-center font-bold text-shadow-90 rounded-lg w-full p-2">{role.name}</h3>
      <div className='w-full'>
        <Table
          headers={['Status', 'Value']}
          data={
            [
              ['Inventory', inventory],
              ['Received This Turn', received],
              ['Received Pending', role.pendingReceived],
              ['Ordered This Turn', role.ordered],
              ['Fulfilled', role.fulfilled,],
              ['Last Ordered', role.lastOrder],

              ['Last Fulfilled', role.lastFulfilled],

            ]
          }
        />
      </div>
      <input
        type="number"
        value={role.ordered ?role.ordered : ordered}
        onChange={handleOrderChange}
        onSubmit={handleOrderSubmit}
        disabled={!isActive || isDisabled} // Disable if not the active player
        className="text-center mt-1 appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus,outline-none focus,ring-indigo-500 focus,border-indigo-500"

      />
      <button onClick={handleOrderSubmit} disabled={!isActive} className="next-btn mt-2">
        Place Order
      </button>
    </div>
  );
};

export default PlayerRole;
