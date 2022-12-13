import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

function UserList() {
    
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
        
        // const socket = io.connect('http://localhost:3000');
        // // Subscribe to the "users" event to receive updates when the list of users changes
        // socket.on('users', (updatedUsers) => {
        //     setUsers(updatedUsers.filter((user) => user.isActive));
        // });
    }, [users]);
 

    return (
        <ul>
            {users.map((user) => (
                <li key={user.userId}>
                    {user.username}
                    <button>Send Message</button>
                </li>
            ))}
        </ul>
    );
}

export default UserList;
