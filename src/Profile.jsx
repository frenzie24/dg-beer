import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileButton from './components/ProfileButton';
import ProfileDetails from './components/ProfileDetails';
import Logout from './Logout';
import GameList from './components/GameList';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for React Router navigation

  // Initialize state for user
  const [user, setUser] = useState(location.state?.user || null);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [schoolId, setSchoolId] = useState(user?.school_id || '');
  const [professorId, setProfessorId] = useState(user?.professor_id || 1);
  const [games, setGames] = useState([]);

  const handleLogout = () => {
    Logout();

    navigate('/login');
  }

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  useEffect(() => {
    getGames();
  }, [])

  const getGames = async () => {
    const response = await fetch(`http://localhost:3001/api/games/?id=${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // Include credentials to ensure cookies are sent

    });

    if (response.ok) {
      console.log('Profile updated successfully');
      const data = await response.json();
      console.log('games saved:', data);
      setIsEditing(false);
      setGames(data);
    } else {
      console.log('Failed to update profile');
    }
  };

  const handleSave = async () => {
    const response = await fetch('http://localhost:3001/api/users/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // Include credentials to ensure cookies are sent
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        school_id: schoolId,
        professor_id: professorId,
      }),
    });

    if (response.ok) {
      console.log('Profile updated successfully');
      setIsEditing(false);
    } else {
      console.log('Failed to update profile');
    }
  };

  const handleNewGameClick = () => { navigate("/gamesettings", { state: { user: user } }) }


  useEffect(() => {
    // Redirect to login page if user is undefined
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }


  /*
  TODO
  Add resume game
  add email game
  add delete game
  add limit to number of games per user
  debug why round is not updating properly in db on game update
  */


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">User Profile</h2>
        <ProfileDetails
          user={{
            ...user,
            first_name: firstName,
            last_name: lastName,
            email,
            school_id: schoolId,
            professor_id: professorId,
          }}
          isEditing={isEditing}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
          setSchoolId={setSchoolId}
          setProfessorId={setProfessorId}
        />
        <div className="grid grid-cols-2 gap-4">
          <ProfileButton label="New Game" handleClick={handleNewGameClick} />
          <ProfileButton label="View Histories" to="/histories" />

          <ProfileButton handleClick={handleEditToggle} label={isEditing ? 'Cancel' : 'Edit Profile'} />
        </div>
        <GameList user={user} games={games} />

        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 bg-green-600  rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Logout
        </button>
        {isEditing && (
          <div className="flex justify-end mt-4">
            <ProfileButton handleClick={handleSave} label="Save" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
