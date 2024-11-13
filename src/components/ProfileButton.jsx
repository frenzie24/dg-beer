import React from 'react';

const ProfileButton = ({ label, handleClick }) => {
  return (
    <button
      onClick={handleClick}  // For navigation, keep the onClick handler
      className="m-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {label}
    </button>
  );
};

export default ProfileButton;
