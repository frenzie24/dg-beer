import React, { useState, useEffect } from 'react';
import Player from './Player';

const BeerGame = () => {
  const initialPlayers = [
    { name: 'Retailer', inventory: 10, orders: [], incomingOrder: 4 },
    { name: 'Wholesaler', inventory: 15, orders: [], incomingOrder: 0 },
    { name: 'Distributor', inventory: 20, orders: [], incomingOrder: 0 },
    { name: 'Manufacturer', inventory: 25, orders: [], incomingOrder: 0 },
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [turn, setTurn] = useState(1);

  useEffect(() => {
    // Update retailer's incoming order
    const randomOrder = Math.floor(Math.random() * 5 + 1) * turn;
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[0].incomingOrder = randomOrder;
      return updatedPlayers;
    });
  }, [turn]);

  const placeOrder = (playerName, order) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      const currentPlayerIndex = prevPlayers.findIndex(player => player.name === playerName);
      const previousPlayerIndex = currentPlayerIndex - 1;

      // Update the current player's orders and inventory
      updatedPlayers[currentPlayerIndex].orders.push(order);
      updatedPlayers[currentPlayerIndex].inventory -= order;

      // Pass the order to the next player in the supply chain
      if (previousPlayerIndex >= 0) {
        updatedPlayers[previousPlayerIndex].incomingOrder = order;
      }

      return updatedPlayers;
    });

    // Move to the next turn
    setTurn(turn + 1);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Beer Game</h1>
      {players.map((player, index) => (
        <Player
          key={player.name}
          {...player}
          placeOrder={placeOrder}
          previousOrder={index > 0 ? players[index - 1].incomingOrder : 0}
        />
      ))}
      <p>Turn: {turn}</p>
    </div>
  );
};

export default BeerGame;
