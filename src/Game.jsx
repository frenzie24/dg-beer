import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Player from './components/Player';
import ErrorModal from './components/ErrorModal';

// game must nav from gamesettings to get data required
const Game = () => {

    const navigate = useNavigate(); // Use useNavigate for React Router navigation
    const location = useLocation();
    const [round, setRound] = useState(0);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [rounds, setRounds] = useState(location.state?.rounds || 10);
    const [entropy, setEntropy] = useState(location.state?.entropy || 2);
    const [selectedRole, setSelectedRole] = useState(location.state?.role || 0);

    const [isLoading, setIsLoading] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [user, setUser] = useState(location.state?.user || null);


    const [errorMessage, setErrorMessage] = useState('');

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

        // if (!location.state.user) navigate('/login')
    }, [currentPlayerIndex]);

    const handleOrderForNonActiveRoles = (index) => {
        const updatedRoles = [...roles];
        if (updatedRoles[index].pendingReceived > 0) {
            updatedRoles[index].ordered += Math.floor(updatedRoles[index].pendingReceived);
        }
        const randomOrderAmount = Math.floor(Math.random() * 20) / entropy; // Random between 1 and the entropy
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

    const handleShipment = async () => {
        const updatedRoles = roles.map(role => {
            if (role.pendingReceived > 0) role.roundsPending++;

            const newInventory = role.inventory - role.received - role.pendingReceived + role.ordered;
            let pending = newInventory < 0 ? Math.abs(newInventory) : 0;
            let receivedAmount = role.received;
            if (role.id === 0) {
                receivedAmount = Math.floor(Math.random() * entropy * 10) + 1; // Random shipment
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
        if (round !== rounds) {
            setRound(round + 1);
        } else {
            setGameOver(true);
            return;
        }
        await updateServer(updatedRoles);
        setCurrentPlayerIndex(0); // Reset to the first player for the next round
    };

    const handleNextPlayer = () => {
        if (currentPlayerIndex < roles.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
            handleShipment(); // All players have taken their turn, process shipments
        }
    };


    const updateServer = async (updatedRoles) => {

        try {
            const response = await fetch('http://localhost:3001/api/games/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id: location.state.gameId, round, rounds, selectedRole, entropy, players: updatedRoles }),
            });

            setIsLoading(false);

            if (response.ok) {
                const data = await response.json();
                console.log('game saved:', data);
                localStorage.setItem('authToken', data.token); // Store the token

            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Invalid email or password');
            }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('An error occurred. Please try again.');

            console.error(error);
        }
    }

    const remainingRounds = () => rounds - round;

    // Function to toggle the visibility of the history section
    const toggleHistoryVisibility = (roleId) => {
        const updatedRoles = [...roles];
        updatedRoles[roleId].isHistoryVisible = !updatedRoles[roleId].isHistoryVisible;
        setRoles(updatedRoles);
    };

    return (





        <div className="container mx-auto p-4 text-center">


            <ErrorModal
                errorMessage={errorMessage}
                onClose={() => {setErrorMessage('');    navigate('/login')}}
            />

            <div className='flex flex-row flex-wrap justify-between'>
                <h1 className="text-3xl font-bold mb-4">FSU Beer Game</h1>
                <h1 className="text-3xl font-bold mb-4">Round: {round}</h1>
                <h1 className="text-3xl font-bold mb-4">Rounds Remaining: {remainingRounds()}</h1>
            </div>
            <div className='flex flex-row flex-wrap justify-between'>
                <h2 className="text-2xl font-bold mb-4">{location.state.user.first_name}</h2>
                <h2 className="text-2xl font-bold mb-4">Round: {round}</h2>
                <h2 className="text-2xl font-bold mb-4">Rounds Remaining: {remainingRounds()}</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 flex-wrap gap-8">
                {!gameOver ? roles.map((role, index) => (
                    <Player player={role}
                        key={role.id}
                        index={index}
                        currentPlayerIndex={currentPlayerIndex}
                        handleNextPlayer={handleNextPlayer}
                        handleOrder={handleOrder}
                        toggleHistoryVisibility={toggleHistoryVisibility} />

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
