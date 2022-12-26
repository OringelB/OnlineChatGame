import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UserList from './components/UserList';
import axios from 'axios';
import io from "socket.io-client"
import "./App.css";
import JoinGame from './components/JoinGame';
import 'bootstrap/dist/css/bootstrap.css';


const socket = io.connect("http://localhost:3000");


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(false);
  const [oponentUser, setOponentUser] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(0);
  const [showUsereList, setShowUserList] = useState(false);
  const [showLeaveRoom, setShowLeaveRoom] = useState(false);






  const getUserByUsername = (username) => {
    return axios.get(`http://localhost:3000/users/${username}`)
      .then(response => response.data)
      .catch(error => {
        // Handle the error if the request fails
        console.error(error);
      });
  }

  const changeUsername = (newUsername) => {
    setUsername(newUsername);
    setShowUserList(true)
    return getUserByUsername(newUsername)
      .then(user => {
        setUser(user);
      });
  }


  function setOponent(user) {
    setOponentUser(user)
  }


  const handleOponent = oponent => {
    setShowLeaveRoom(true);
    setShowGame(true);
    setOponent(oponent);
    setShowUserList(false);
    const room = createRoom(oponent);
    socket.emit("join_room", room);

  };




  function createRoom(opnent) {
    const sortedUserIds = [user.userId, opnent.userId].sort();
    const roomId = sortedUserIds.join('');
    setRoom(roomId);
    return roomId;
  }


  useEffect(() => {
    socket.on("left_room", (data) => {
      alert("Opponent left the room");
      setShowGame(false);
      setShowUserList(true);
      setShowLeaveRoom(false);
    });


  }, [socket]);

const handleLeaveRoom = () => {
  setShowGame(false);
  setShowUserList(true);
  setShowLeaveRoom(false);
  socket.emit("leave_room", { room: room });

}

  const handleLogout = () => {
    setShowUserList(false);
    axios.post('http://localhost:3000/logout', {
      username
    })
      .then((response) => {
        if (response.data.success) {
          // Update the loggedIn state and hide the logout button
          setLoggedIn(false);
          setShowGame(false);
          // Delete the userId and username cookies
          document.cookie = `userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
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
          <button onClick={handleLogout} className="btn btn-primary">Logout</button>
        )}
        {showLeaveRoom && (
          <button onClick={handleLeaveRoom} className="btn btn-primary">Leave Room</button>
        )}
      {showUsereList && (
        <UserList oponent={oponentUser} clickedUser={handleOponent} currentUser={user} />
      )}

      {/* <div>
        {oponentUser !== null && (
          <div>
            <p>Oponent user: {oponentUser.username}</p>
          </div>
        )}
      </div> */}

      {showGame && (
        <JoinGame socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
