import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from 'routes/Home';
import Auth from 'routes/Auth';
import Navigation from './Navigation';
import Profile from 'routes/Profile';
import { useUserObj } from 'userObjContext';

const AppRouter = ({ isLoggedIn }) => {
  const userObj = useUserObj();
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Switch>
        {isLoggedIn ? (
          <div
            style={{
              maxWidth: 890,
              width: "100%",
              margin: "0 auto",
              marginTop: 80,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Route exact path="/profile">
              <Profile userObj={userObj} />
            </Route>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Redirect from="*" to="/" />
          </div>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
            <Redirect from="*" to="/" />
          </>
        )}
      </Switch>
    </Router>
  );
}

export default AppRouter;