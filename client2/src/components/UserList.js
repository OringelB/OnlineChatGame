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
        <ul>
            {users.map((user) => {
                if (user.username !== currentUser.username) {
                    return (
                        <li key={user.userId}>
                            {user.username}
                            <button key={user.userId} onClick={()=> clickedUser(user)}>Send Message</button>
                        </li>
                    );
                } else {
                    return null;
                }
            })}
        </ul>
    );
}

export default UserList;
