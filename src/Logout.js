const Logout = async () => {
    try {
        const response = await fetch('https://dg-beer-server.onrender.com/api/users/logout', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });


        if (response.ok) {

            console.log('Logout successful:');
            localStorage.removeItem('authToken'); // Destroy the token


        } else {
        //    setErrorMessage(data.message || 'Could not log out at this time.');
        }
    } catch (error) {

      //  setErrorMessage('An error occurred. Please try again.');
        console.error(error);
    }
}

export default Logout;
