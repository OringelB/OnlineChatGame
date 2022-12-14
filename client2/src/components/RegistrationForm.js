import React, { useState } from 'react';
import axios from 'axios';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
  
    axios.post('http://localhost:3000/register', {
      username,
      password,
      name,
      lastname
    })
      .then((response) => {
        if (response.data.success) {
          alert("Succefully registerd!")
          // Redirect the user to the login page or display a success message
        } else {
          alert("Username is taken");

          // Display an error message
        }
      })
      .catch((error) => {
          alert("Username is taken");
          // Handle any errors
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
        <div className="form-group">
          <label>
            Name:
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} className="form-control" />
          </label>
        </div>
        <div className="form-group">
          <label>
            Last name:
            <input type="text" value={lastname} onChange={(event) => setLastname(event.target.value)} className="form-control" />
          </label>
        </div>
        <button onClick={handleSubmit} type='submit' className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
  
}
export default RegistrationForm
