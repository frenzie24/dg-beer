import React from 'react';
import InputField from './InputField';

const ProfileDetails = ({ user, isEditing, setFirstName, setLastName, setEmail }) => {
  if (!user) return null;

  return (
    <div className="space-y-2">
      <InputField
        id="first-name"
        label="First Name"
        type="text"
        value={user.first_name}
        onChange={(e) => setFirstName(e.target.value)}
        disabled={!isEditing}
      />

      <InputField
        id="last-name"
        label="Last Name"
        type="text"
        value={user.last_name}
        onChange={(e) => setLastName(e.target.value)}
        disabled={!isEditing}
      />

      <InputField
        id="email-address"
        label="Email Address"
        type="email"
        value={user.email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={!isEditing}
      />
    </div>
  );
};

export default ProfileDetails;
124