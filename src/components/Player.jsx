// src/components/Player.js
import React, { useState } from 'react';
import PlayerRole from './PlayerRole';

const Player = ({ player, history, index, currentPlayerIndex, handleNextPlayer, handleOrder, toggleHistoryVisibility, name }) => {
  const [orderAmount, setOrderAmount] = useState(0);

  const handleOrderChange = (e) => {
    setOrderAmount(Number(e.target.value));
  };

  const handleOrderSubmit = () => {
    handleOrder(player.id, orderAmount);
  };



  return (
    <div className="flex flex-col items-center border p-2 rounded-lg shadow-md bg-slate-800">

      <div className='flex flex-row flex-wrap justify-around'>
        <h2 className="text-2xl font-bold mb-4">{name}</h2>

      </div>
      <PlayerRole

        role={player}
        inventory={player.inventory}
        received={player.received}
        onOrder={handleOrder}
        isActive={index === currentPlayerIndex}
        onNextPlayer={handleNextPlayer}
        isDisabled={index !== currentPlayerIndex} // Disable input for non-active roles
      />

      {/* Player History Section */}
      <div className="mt-4 w-full">
        <h4 className="text-lg font-semibold">{player.name} History</h4>
        <button
          onClick={() => toggleHistoryVisibility(player.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          {player.isHistoryVisible ? 'Hide History' : 'Show History'}
        </button>

        {/* History content - toggle visibility based on state */}
        {player.isHistoryVisible && (
          <div className="mt-4">
            {history.length > 0 ? (
              history.map((entry, index) => (
                <div key={entry.round + player.role_id} className="mb-2">
                  <p><strong>Round {entry.round + 1}:</strong></p>
                  <p>Ordered: {entry.ordered}</p>
                  <p>Fulfilled: {entry.fullFilled}</p>
                  <p>lastFulfilled: {entry.lastFulfilled}</p>
                  <p>Received: {entry.received}</p>
                  <p>Inventory: {entry.inventory}</p>
                  <p>Pending Received: {entry.pendingReceived}</p>
                </div>
              ))
            ) : (
              <p>No history available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
};

export default Player;
