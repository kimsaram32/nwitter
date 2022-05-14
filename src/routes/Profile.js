import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService, dbService } from 'fbase';
import { useRefreshUser, useUserObj } from 'userObjContext';

const Profile = () => {
  const history = useHistory();
  const userObj = useUserObj();
  const refreshUser = useRefreshUser();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  
  const onLogOutClick = async () => {
    await authService.signOut();
    history.push('/');
    refreshUser();
  };
  const getMyNweets = async () => {
    const nweets = await dbService
      .collection('nweets')
      .where('creatorId', '==', userObj.uid)
      .orderBy('createdAt')
      .get();
    console.log(nweets.docs.map(doc => doc.data()));
  };

  useEffect(() => {
    getMyNweets();
  });

  const onChange = ({ target: { value }}) => setNewDisplayName(value);
  const onSubmit = async e => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
      window.alert('Updated profile');
    }
  }

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          onChange={onChange}
          autoFocus
          placeholder="Display name"
          className="formInput"
        /> 
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
}

export default Profile;