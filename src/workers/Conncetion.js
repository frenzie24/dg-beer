
const updateGameData = async (data) => {
    debugger;
    try {
        const response = await fetch('http://localhost:3001/api/games/', {
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

            throw new Error("Communication Error: ", {data});

        }
    } catch (error) {
        throw new Error("Communication Error: ", error);
    }
}


export default { updateGameData };