import React, { useState, useEffect } from 'react';
import PlayerRole from './components/PlayerRole';
import { useLocation } from 'react-router-dom';

const Game = ({ role, rounds, entropy }) => {

    const location = useLocation();
    const [round, setRound] = useState(0);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [totalRounds, setTotalRounds] = useState(location.state?.rounds || 10);
    const [entropyLevel, setEntropyLevel] = useState(location.state?.entropy || 2);
    const [selectedRole, setSelectedRole] = useState(location.state?.role || 0);
    const [gameOver, setGameOver] = useState(false);
    const [roles, setRoles] = useState([
        { id: 0, name: "Retailer", inventory: 10, ordered: 0, lastOrder: 0, received: 0, totalReceived: 0, pendingReceived: 0, roundsPending: 0, history: [], isHistoryVisible: false },
        { id: 1, name: "Wholesaler", inventory: 20, ordered: 0, lastOrder: 0, received: 0, totalReceived: 0, pendingReceived: 0, roundsPending: 0, history: [], isHistoryVisible: false },
        { id: 2, name: "Distributor", inventory: 20, ordered: 0, lastOrder: 0, received: 0, totalReceived: 0, pendingReceived: 0, roundsPending: 0, history: [], isHistoryVisible: false },
        { id: 3, name: "Manufacturer", inventory: 20, ordered: 0, lastOrder: 0, received: 0, totalReceived: 0, pendingReceived: 0, roundsPending: 0, history: [], isHistoryVisible: false },
    ]);

    useEffect(() => {
        if (roles[currentPlayerIndex].id !== selectedRole) {
            const delay = Math.floor(Math.random() * 1000) + 500; // Random delay between 500ms and 1500ms
            setTimeout(() => handleOrderForNonActiveRoles(currentPlayerIndex), delay);
        }
    }, [currentPlayerIndex]);

    const handleOrderForNonActiveRoles = (index) => {
        const updatedRoles = [...roles];
        if (updatedRoles[index].pendingReceived > 0) {
            updatedRoles[index].ordered += Math.floor(updatedRoles[index].pendingReceived);
        }
        const randomOrderAmount = Math.floor(Math.random() * entropyLevel); // Random between 1 and the entropyLevel
        updatedRoles[index].ordered += randomOrderAmount;

        if (index < roles.length - 1) {
            updatedRoles[index + 1].received += updatedRoles[index].ordered;
        }

        setRoles(updatedRoles);
        handleNextPlayer();
    };

    const handleOrder = (id, amount) => {
        const updatedRoles = [...roles];
        if (id < roles.length - 1) {
            updatedRoles[id + 1].received = amount;
            if (updatedRoles[id + 1].inventory < amount) {
                updatedRoles[id].ordered = updatedRoles[id + 1].inventory;
            } else {
                updatedRoles[id].ordered = amount;
            }
        }
        setRoles(updatedRoles);
        handleNextPlayer();
    };

    const handleShipment = () => {
        const updatedRoles = roles.map(role => {
            if (role.pendingReceived > 0) role.roundsPending++;

            const newInventory = role.inventory - role.received - role.pendingReceived + role.ordered;
            let pending = newInventory < 0 ? Math.abs(newInventory) : 0;
            let receivedAmount = role.received;
            if (role.id === 0) {
                receivedAmount = Math.floor(Math.random() * entropyLevel * 10) + 1; // Random shipment
            }
            const historyEntry = {
                round,
                ordered: role.ordered,
                received: role.received,
                pendingReceived: role.pendingReceived,
                totalReceived: role.totalReceived,
                pendingReceived: pending,
                inventory: Math.max(0, newInventory)
            };

            return {
                ...role,
                inventory: Math.max(0, newInventory),
                ordered: 0,
                lastOrder: role.ordered,
                received: receivedAmount,
                totalReceived: role.totalReceived + receivedAmount,
                pendingReceived: pending,
                history: [...role.history, historyEntry]
            };
        });

        setRoles(updatedRoles);
        if (round !== totalRounds) {
            setRound(round + 1);
        } else {
            setGameOver(true);
            return;
        }
        setCurrentPlayerIndex(0); // Reset to the first player for the next round
    };

    const handleNextPlayer = () => {
        if (currentPlayerIndex < roles.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
            handleShipment(); // All players have taken their turn, process shipments
        }
    };

    const remainingRounds = () => totalRounds - round;

    // Function to toggle the visibility of the history section
    const toggleHistoryVisibility = (roleId) => {
        const updatedRoles = [...roles];
        updatedRoles[roleId].isHistoryVisible = !updatedRoles[roleId].isHistoryVisible;
        setRoles(updatedRoles);
    };

    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-3xl font-bold mb-4">FSU Beer Game</h1>
            <h2 className="text-2xl font-semibold mb-4">Round: {round}</h2>
            <h3 className="text-lg mb-4">Rounds Remaining: {remainingRounds()}</h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 flex-wrap gap-8">
                {!gameOver ? roles.map((role, index) => (
                    <div key={role.id} className="flex flex-col items-center border p-2 rounded-lg shadow-md bg-slate-800">
                        <PlayerRole
                            key={role.id}
                            role={role}
                            inventory={role.inventory}
                            received={role.received}
                            onOrder={handleOrder}
                            isActive={index === currentPlayerIndex}
                            onNextPlayer={handleNextPlayer}
                            isDisabled={index !== currentPlayerIndex} // Disable input for non-active roles
                        />

                        {/* Player History Section */}
                        <div className="mt-4 w-full">
                            <h4 className="text-lg font-semibold">{role.name} History</h4>
                            <button
                                onClick={() => toggleHistoryVisibility(role.id)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                {role.isHistoryVisible ? 'Hide History' : 'Show History'}
                            </button>

                            {/* History content - toggle visibility based on state */}
                            {role.isHistoryVisible && (
                                <div className="mt-4">
                                    {role.history.length > 0 ? (
                                        role.history.map((entry, index) => (
                                            <div key={entry.round} className="mb-2">
                                                <p><strong>Round {entry.round}:</strong></p>
                                                <p>Ordered: {entry.ordered}</p>
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
                )) : (
                    roles.map((role, index) => (
                        <div key={role.id} className="mt-4 w-full">
                            <h4 className="text-lg font-semibold">{role.name} Rounds with Pending Shipments: {role.roundsPending}</h4>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Game;
