import './App.css';
import React, { useState} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './components/login';
import Navbar from './components/navbar';
import Profile from './components/profile';
import Signup from './components/signup';
import Trendingrepos from './components/trendingrepos';
import Userprofile from './components/userprofile';

function App() {
  var [loggedIn, setLoggedIn] = useState(false);
  var setstatus = (status) => {
    if(status){
      setLoggedIn(true);
    }
    if(!status){
      setLoggedIn(false);
    }
  }
  return (
    <Router>
      {loggedIn?<Redirect to="/profile"/>:<Redirect to="/"/>}

      <Switch>
        <Route exact path='/'>
          <div className="main_container">
            <Navbar loggedin={loggedIn}/>
            <Login setstatus={setstatus}/>
          </div>
        </Route>

        <Route exact path="/signup">
          <div className="main_container">
            <Navbar loggedin={loggedIn}/>
            <Signup />
          </div>
        </Route>

        <Route exact path="/profile">
          <Navbar loggedin={loggedIn} setstatus={setstatus} />
          <Profile />
        </Route>

        <Route exact path="/user/:username">
          <Navbar loggedin={loggedIn} setstatus={setstatus} />
          <Userprofile />
        </Route>

        <Route exact path = "/trendingrepo">
          <Navbar loggedin={loggedIn} setstatus={setstatus} />
          <Trendingrepos />
        </Route>
        
      </Switch>

    </Router>
     
  );
}

export default App;
