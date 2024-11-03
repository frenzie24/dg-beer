// src/components/Game.js
import React, { useState } from 'react';
import PlayerRole from './PlayerRole';

const Game = () => {
    const [round, setRound] = useState(0);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    const [roles, setRoles] = useState([
        { id: 0, name: "Retailer", inventory: 20, ordered: 0, received: 0, history: [] },
        { id: 1, name: "Wholesaler", inventory: 20, ordered: 0, received: 0, history: [] },
        { id: 2, name: "Distributor", inventory: 20, ordered: 0, received: 0, history: [] },
        { id: 3, name: "Manufacturer", inventory: 20, ordered: 0, received: 0, history: [] },
    ]);

    const handleOrder = (id, amount) => {
        const updatedRoles = [...roles];
        updatedRoles[id].ordered += amount;

        // Adjust the received amount for the next player in the supply chain
        if (id < roles.length - 1) {
            updatedRoles[id + 1].received += amount;
        }

        setRoles(updatedRoles);
        handleNextPlayer();
    };

    const handleShipment = () => {
        const updatedRoles = roles.map(role => {
            const newInventory = role.inventory - role.received + role.ordered;
            let receivedAmount = role.received - role.inventory;
            receivedAmount = receivedAmount < 0 ? 0 : receivedAmount;
            if (role.id === 0) {
                receivedAmount = Math.floor(Math.random() * 10) + 5; // Random shipment
            }
            // Update history for the current round
            const historyEntry = {
                round,
                ordered: role.ordered,
                received: role.received ,
                inventory: Math.max(0, newInventory)
            };

            return {
                ...role,
                inventory: Math.max(0, newInventory), // Ensure inventory does not go negative
                ordered: 0, // Reset ordered for the next round
                received: receivedAmount,
                history: [...role.history, historyEntry] // Add history entry
            };
        });

        setRoles(updatedRoles);
        setRound(round + 1);
        setCurrentPlayerIndex(0); // Reset to the first player for the next round
    };

    const handleNextPlayer = () => {
        if (currentPlayerIndex < roles.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
            handleShipment(); // All players have taken their turn, process shipments
        }
    };

    return (
        <div>
            <h1>Beer Game</h1>
            <h2>Round: {round}</h2>
            <PlayerRole
                key={roles[currentPlayerIndex].id}
                role={roles[currentPlayerIndex]}
                inventory={roles[currentPlayerIndex].inventory}
                onOrder={handleOrder}
                isActive={true}
                onNextPlayer={handleNextPlayer}
            />

            <h3 className='text-2xl'>History</h3>
            {roles.map(role => (
                <div key={role.id}>
                    <h4>{role.name}</h4>
                    <ul>
                        {role.history.map((entry, index) => (
                            <li key={index}>
                                Round {entry.round}: Ordered {entry.ordered}, Received {entry.received}, Inventory {entry.inventory}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Game;
