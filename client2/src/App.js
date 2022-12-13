import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UserList from './components/UserList';
import axios from 'axios';
import io from "socket.io-client"

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(false);
const socket = io.connect("http://localhost:3000");


  const changeUsername = (newUsername) => {
    setUsername(newUsername);
  }
  //a

  function handleLogout() {
    axios.post('http://localhost:3000/logout', {
      username
    })
      .then((response) => {
        if (response.data.success) {
          // Update the loggedIn state and hide the logout button
          setLoggedIn(false);
        } else {
          // Display an error message
        }
      })
      .catch((error) => {
        // Handle any errors
      });
  }

  return (
    <div>
      {!loggedIn && (
        <>
          <LoginForm onLogin={() => setLoggedIn(true)} changeUsername={changeUsername} />
          <RegistrationForm />
        </>
      )}
      {loggedIn && (
        <UserList></UserList>
      )}
      {loggedIn && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
}

export default App;
