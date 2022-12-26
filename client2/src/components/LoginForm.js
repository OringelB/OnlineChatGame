import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';


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
    <div className="d-flex justify-content-center">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Username:
            <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} className="form-control" />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="form-control" />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
  
}
export default LoginForm;
