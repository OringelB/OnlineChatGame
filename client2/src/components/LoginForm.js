import React, { useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';


function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
  
    axios.post('http://localhost:3000/login', {
      username,
      password
    })
      .then((response) => {
        if (response.data.success) {
            props.onLogin();
            props.changeUsername(username);
            alert("welcome " + username);
            const { currentUser } = response.data;
            // Save currentUser id and username in cookies
            document.cookie = `userId=${currentUser.userId}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
            document.cookie = `username=${currentUser.username}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
            
        } else {
          // Display an error message
        }
      })
      .catch((error) => {
        alert("Wrong username/password")
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
export default LoginForm;
