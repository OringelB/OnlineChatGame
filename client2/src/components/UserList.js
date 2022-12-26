import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

function UserList(props) {

    const {oponent,clickedUser, currentUser} = props;
    const [users, setUsers] = useState([]);
    useEffect(() => {
        // Send a request to the server to get the initial list of users
        axios.get('http://localhost:3000/users')
        .then((response) => {
            setUsers(response.data.filter((user) => user.isActive));
        })
        .catch((error) => {
            // Handle any errors
        });
        

    }, [users]);

    return (
        <div className="mx-auto w-50">
          <div className="card">
            <div className="card-header">Users</div>
            <ul className="list-group list-group-flush">
              {users.map((user) => {
                if (user.username !== currentUser.username) {
                  return (
                    <li key={user.userId} className="list-group-item d-flex justify-content-between align-items-center">
                      {user.username}
                      <button
                        key={user.userId}
                        onClick={() => clickedUser(user)}
                        className="btn btn-primary"
                      >
                        Play a game
                      </button>
                    </li>
                  );
                } else {
                  return null;
                }
              })}
            </ul>
          </div>
        </div>
      );
      
}

export default UserList;
