import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import Game from "./Game";

function JoinGame({ socket, username, room }) {
  const [userCount, setUserCount] = useState([]);
  const [isUserFirst, setIsUserFirst] = useState(1);




  socket.emit("join_game", { room: room });

  useEffect(() => {
    socket.on("joined_game", (data) => {
      setUserCount(data.clientsInRoom);
    });
    socket.on("setting_player", (data) => {
      setIsUserFirst(data.clientsInRoom);
    });
  socket.emit("set_player", { room: room });

  }, [socket]);



  return (
    <>
      {userCount < 2 && (
        <div className="alert alert-primary">waiting for player to join...</div>
      )}
      {userCount > 1 && (
        <div className="row no-gutters">

          <div className="col-6">
            <div className="alert alert-primary">Player joined, let's play</div>
            <Game socket={socket} room={room} username={username} isUserFirst={isUserFirst}/>
          </div>
        </div>
      )}
    </>
  );
  
}

export default JoinGame;
