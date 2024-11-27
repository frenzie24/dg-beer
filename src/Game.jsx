import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Player from './components/Player';
import ErrorModal from './components/ErrorModal';
import Connection from './workers/Conncetion';
import Dashboard from './components/Dashboard';

const delim = `{-}`;
const arrayDelim = '|';

const splitFilterJSON = (data) => {
    // if history is already an array return
    if (Array.isArray(data)) return;

    try {
        const array = data.split(delim);
        return array.filter(entry => entry !== '');
    } catch (e) {
        return null;
    }
}

const parseJSONArray = (data) => {
    if (typeof data == "string") {
        const array = data.split(',');
        const filtered = array.filter(entry => entry !== '');

        return filtered.map((entry) => {
            return JSON.parse(entry);
        })
    }
}

const stringifyData2D = (data) => {
    const dataString = data.map((entry) => {
        return entry.map((element)=> {
            return JSON.stringify(element);
        })
    })
    debugger;
    return dataString;
}

const randomOrders = (entropy) => {
    return Math.floor(Math.random() * 20) * (entropy / 2);
}


// game must nav from gamesettings to get data required
const Game = () => {

    const navigate = useNavigate(); // Use useNavigate for React Router navigation
    const location = useLocation();
    const [round, setRound] = useState(location.state?.round || 0);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [rounds, setRounds] = useState(location.state?.rounds || 10);
    const [entropy, setEntropy] = useState(location.state?.entropy || 2);
    const [selectedRole, setSelectedRole] = useState(location.state?.role || 0);

    const [isLoading, setIsLoading] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [user, setUser] = useState(location.state?.user || null);

    const [history, setHistory] = useState(location.state.history ? splitFilterJSON(location.state.history) : [[], [], [], []])




    const [errorMessage, setErrorMessage] = useState('');

    const [roles, setRoles] = useState([
        { role_id: 0, name: "Retailer", user_id: user.id, game_id: location.state.id, inventory: 10, ordered: 0, fulfilled: 0, lastFulfilled: 0, lastOrder: 0, received: 0, totalReceived: 0, pendingReceived: 0, roundsPending: 0, history: history[0], isHistoryVisible: false },
        { role_id: 1, name: "Wholesaler", user_id: user.id, game_id: location.state.id, inventory: 20, ordered: 0, fulfilled: 0, lastFulfilled: 0, lastOrder: 0, received: 0, totalReceived: 0, pendingReceived: 0, roundsPending: 0, history: history[1], isHistoryVisible: false },
        { role_id: 2, name: "Distributor", user_id: user.id, game_id: location.state.id, inventory: 20, ordered: 0, fulfilled: 0, lastFulfilled: 0, lastOrder: 0, received: 0, totalReceived: 0, pendingReceived: 0, roundsPending: 0, history: history[2], isHistoryVisible: false },
        { role_id: 3, name: "Manufacturer", user_id: user.id, game_id: location.state.id, inventory: 20, ordered: 0, fulfilled: 0, lastFulfilled: 0, lastOrder: 0, received: 0, totalReceived: 0, pendingReceived: 0, roundsPending: 0, history: history[3], isHistoryVisible: false },
    ]);


    useEffect(() => {
        if (roles[currentPlayerIndex].role_id !== selectedRole) {
            const delay = Math.floor(Math.random() * 1000) + 500; // Random delay between 500ms and 1500ms
            setTimeout(() => handleOrderForNonActiveRoles(currentPlayerIndex), delay);
        }

        // if (!location.state.user) navigate('/login')
    }, [currentPlayerIndex]);

    //returns into setRoles
    const checkFulfillment = (idx, players, amount) => {
        // set lastFulfilled to current fulfilled

        if (idx >= 0) {
            players[idx].lastFulfilled = players[idx].fulfilled;
            if (idx === 0) {
                players[idx].received = randomOrders(entropy) + 1; //
            }

            if (idx < players.length - 1) {

                // check the next player's inventory for fulfullment and set next player's received to current player's order
                players[idx + 1].received = amount + randomOrders(entropy);
                if (players[idx + 1].inventory < amount) {
                    players[idx].fulfilled = players[idx + 1].inventory;
                } else {
                    players[idx].fulfilled = amount;
                }
            } else {
                // the manufacturer gets random fulfillment which can suck lol
                players[idx].fulfilled = randomOrders(entropy);
            }
            players[idx].ordered = amount;
        }
        return players;
    }


    const handleOrderForNonActiveRoles = (index) => {
        const updatedRoles = roles.map((entry, idx) => {
            if (idx === index) {


                // call randomOrders()
                const randomOrderAmount = randomOrders(entropy) * index;
                entry.ordered = randomOrderAmount;
                if (entry.pendingReceived > 0) {
                    entry.ordered += Math.floor(entry.pendingReceived);
                }
            }
            return entry;
        });
        setRoles(updatedRoles);


        setTimeout(() => {
            setRoles(checkFulfillment(index, updatedRoles, updatedRoles[index].ordered));
            handleNextPlayer();
        }, 1500)
    };

    const handleOrder = (id, amount) => {
        const updatedRoles = [...roles];
        updatedRoles[id].ordered = amount;

        // logic to handle whether the next player can fill the order entirely or not
        setTimeout(()=> {
            setRoles(checkFulfillment(id, updatedRoles, amount));
            handleNextPlayer();
        }, 500)

    };

    const addToGameHistory = (newEntry, idx) => {

        // history entries are separated by , now instead of delim const
        const updated = `${history[idx]}${JSON.stringify(newEntry)}${delim}`;
        return updated;
    };


    const handleShipment = async () => {
        let newHistory = history;
        const updatedRoles = roles.map((role, idx) => {
            if (role.pendingReceived > 0) role.roundsPending++;
            // const fulfilled =
            const newInventory = role.inventory - role.received - role.pendingReceived + role.fulfilled;
            let pending = newInventory < 0 ? Math.abs(newInventory) : 0;
            let receivedAmount = role.received;

            const historyEntry = {
                round,
                ordered: role.ordered,
                received: role.received,
                fulfilled: role.fulfilled,
                lastFulfilled: role.lastFulfilled,
                pendingReceived: role.pendingReceived,
                totalReceived: role.totalReceived,
                pendingReceived: pending,
                inventory: Math.floor(Math.max(0, newInventory)),
            };

            // instead of parsing the different player history arrays, we just add historyEntry to the history we have stored in state before we update the server with a new game state
            //            newHistory[idx].push(addToGameHistory(historyEntry, idx);
            newHistory[idx].push(historyEntry)
            return {
                ...role,
                inventory: Math.floor(Math.max(0, newInventory)),
                ordered: 0,
                fulfilled: 0,
                lastFulfilled: role.fulfilled,
                lastOrder: role.ordered,
                received: receivedAmount,
                totalReceived: role.totalReceived + receivedAmount,
                pendingReceived: pending,
                //  history: `${role.history},${historyEntry}`
            };
        });

        let _history = stringifyData2D(newHistory);
        const data = { game: { round, rounds, selectedRole, entropy, history: newHistory.join('|'), id: location.state.id }, players: updatedRoles, }

       // await updateServer({ ...data });

        setRoles(updatedRoles);
        setHistory(newHistory);
        if (round !== rounds) {
            const newRound = Number(round + 1);
            setRound(newRound);
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


    const updateServer = async (data) => {
        try {
            const update = await Connection.updateGameData(data);
            if (update) {
                console.log(update);
                return true
            };
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
            navigate("/login");
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
                onClose={() => { setErrorMessage(''); navigate('/login') }}
            />

            <Dashboard round={round} name={user.first_name} role={roles[selectedRole].name} roundsRemaining={remainingRounds()} />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 flex-wrap gap-8">
                {!gameOver ? roles.map((role, index) => (
                    <Player player={role}
                        key={role.role_id}
                        index={index}
                        currentPlayerIndex={currentPlayerIndex}
                        handleNextPlayer={handleNextPlayer}
                        handleOrder={handleOrder}
                        history={history[index]}
                        toggleHistoryVisibility={(ev) => toggleHistoryVisibility(role.role_id)}
                        name={index == selectedRole? user.first_name : `CPU ${index + 1}`} />

                )) : (
                    roles.map((role, index) => (
                        <div key={role.role_id} className="mt-4 w-full">
                            <h4 className="text-lg font-semibold">{role.name} Rounds with Pending Shipments: {role.roundsPending}</h4>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Game;
