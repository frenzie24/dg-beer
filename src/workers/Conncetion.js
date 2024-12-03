const newGame = async (data) => {
    try {
        const response = await fetch('https://dg-beer-server.onrender.com/api/games/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        debugger;
        if (response.ok) {
            debugger;
            const data = await response.json();
            console.log('GAME CREATED:', data);
            localStorage.setItem('authToken', data.token); // Store the token
            return data;
            //          navigate('/game', { state: { id: data.game.id, user: user, role: Number(role), rounds: rounds, entropy: entropy, players: data.players } });
            //

            // Redirect to profile page after successful login
        } else return null;
    } catch (error) {
        debugger;
        //setIsLoading(false);
       // setErrorMessage('An error occurred. Please try again.');
        //navigate('/login');
        console.error(error);
        return error;
    }

}

// handles updating the db at the end of a turn
const updateGameData = async (data) => {
    debugger;
    try {
        const response = await fetch('https://dg-beer-server.onrender.com/api/games/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });


        if (response.ok) {
            const data = await response.json();
            console.log('game saved:', data);
            localStorage.setItem('authToken', data.token); // Store the token
            return data;

        } else {
            const data = await response.json();
            console.log(JSON.stringify(data));

            throw new Error("Communication Error: ", { data });

        }
    } catch (error) {
        throw new Error("Communication Error: ", error);
    }
}


export default { newGame, updateGameData };