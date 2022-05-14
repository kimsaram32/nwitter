import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { userObjContext, refreshUserContext } from '../userObjContext';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged(user => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    setUserObj(cloneDeep(authService.currentUser));
  };

  return (
    <userObjContext.Provider value={userObj}>
      <refreshUserContext.Provider value={refreshUser}>
        {init ? <AppRouter isLoggedIn={!!userObj} userObj={userObj} /> : 'init'}
      </refreshUserContext.Provider>
    </userObjContext.Provider>
  );
}

export default App;