import React, { useState } from 'react';

const retailFirst = false;

const Player = ({ name, inventory, orders, onOrder, previousOrder }) => {
  const [order, setOrder] = useState(0);

  const handleOrderChange = (e) => setOrder(e.target.value);
  const handleOrderSubmit = () => onOrder(name, Number(order));

  return (
    <div>
      <h2>{name}</h2>
      <p>Inventory: {inventory}</p>
      <p>Incoming Order: {previousOrder}</p>
      <p>Orders: {orders.join(', ')}</p>
      <input type="number" value={order} onChange={handleOrderChange} />
      <button onClick={handleOrderSubmit}>Place Order</button>
    </div>
  );
};

const BeerGame = () => {
  const initialPlayers = [
    { name: 'Retailer', inventory: 10, orders: [], incomingOrder: 4 },
    { name: 'Wholesaler', inventory: 15, orders: [], incomingOrder: 0 },
    { name: 'Distributor', inventory: 20, orders: [], incomingOrder: 0 },
    { name: 'Manufacturer', inventory: 25, orders: [], incomingOrder: 0 },
  ];

  const [players, setPlayers] =useState(initialPlayers);

  // this is all wrong
  // incoming orders need to be given state
  // incoming orders need to be added to not overwriten
  // add turns
  const handleOrder = (playerName, order) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      const currentPlayerIndex = prevPlayers.findIndex(player => player.name === playerName);
      const nextPlayerIndex = currentPlayerIndex + 1;

      // Update the current player's orders and inventory
      updatedPlayers[currentPlayerIndex].orders.push(order);
      updatedPlayers[currentPlayerIndex].inventory -= order;

      // Pass the order to the next player in the supply chain
      if (nextPlayerIndex >= 0) {
        updatedPlayers[nextPlayerIndex].incomingOrder += order;
      }

      return updatedPlayers;
    });
  };

  return (
    <div>
      <h1>Beer Game</h1>
      {players.map((player, index) => (
        <Player
          key={player.name}
          {...player}
          onOrder={handleOrder}
          previousOrder={index > 0 ? players[index - 1].incomingOrder : 0}
        />
      ))}
    </div>
  );
};

export default BeerGame;
