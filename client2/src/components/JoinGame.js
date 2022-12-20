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
        <div>waiting for player to join...
        </div>
      )}
      {userCount > 1 && (
        <div>
          Player joined, let's play
          <Chat socket={socket} username={username} room={room} />
          <Game socket={socket} room={room} isUserFirst={isUserFirst}/>
        </div>



      )}
    </>
  );
}

export default JoinGame;
