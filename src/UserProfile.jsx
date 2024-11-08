import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileButton from './components/ProfileButton';
import ProfileDetails from './ProfileDetails';
import Logout from './Logout';

const UserProfile = () => {
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

const handleLogout = () => {
  Logout();

  navigate('/login');
}

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
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


  useEffect(() => {
    // Redirect to login page if user is undefined
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Don't render anything until user is available or redirected
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
          <ProfileButton label="New Game" handleClick={()=>{navigate("/game" )}}/>
          <ProfileButton label="View Histories" to="/histories" />
          <ProfileButton label="Resume Game" handleClick={()=>{navigate("/game" )}}/>
          <ProfileButton handleClick={handleEditToggle} label={isEditing ? 'Cancel' : 'Edit Profile'} />
        </div>
        <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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

export default UserProfile;
