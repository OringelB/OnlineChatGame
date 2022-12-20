import React, { useState, useEffect } from 'react';

function Game({ socket, room, isUserFirst }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [playerShape, setPlayerShape] = useState("");
    const [winner, setWinner] = useState(null);

    // helper function to set the player shape based on the value of isUserFirst
    function setPlayerShapeBasedOnIsUserFirst(isUserFirst) {
        if (isUserFirst === 2) {
            setPlayerShape("X");
        }
        else{
            setPlayerShape("O")
        }
    }

    useEffect(() => {
        const winner = checkForWinner(board);
        setWinner(winner);
      }, [board]);
      

    // useEffect hook to set the player shape and listen for changes to the game
    useEffect(() => {
        setPlayerShapeBasedOnIsUserFirst(isUserFirst);

        socket.on("change_game", (data) => {
          setBoard(data.newBoard);
          setCurrentPlayer(isUserFirst === 2 ? 'X' : 'O');
        });
      }, [socket,isUserFirst]);

    // function to handle clicks on the squares
    const handleSquareClick = async (index) => {

        // if the square is already filled or it's not the current player's turn, do nothing
        if (board[index] !== null || currentPlayer !== playerShape) {
            return;
        }

        // make a copy of the board, update the clicked square, and set the new board
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        // send the updated board to the server and switch the current player
        await socket.emit("updateGame", { room: room, newBoard: newBoard });
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

   
    };
    // function to check if there is a winner
    function checkForWinner(board) {
        // check rows
        for (let i = 0; i < 3; i++) {
            if (board[i * 3] && board[i * 3] === board[i * 3 + 1] && board[i * 3 + 1] === board[i * 3 + 2]) {
                return board[i * 3];
            }
        }
        // check columns
        for (let i = 0; i < 3; i++) {
            if (board[i] && board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
                return board[i];
            }
        }
        // check diagonals
        if (board[0] && board[0] === board[4] && board[4] === board[8]) {
            return board[0];
        }
        if (board[2] && board[2] === board[4] && board[4] === board[6]) {
            return board[2];
        }
        return null;
    }

    // function to reset the game
    function resetGame() {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        handleSquareClick(0);
    }

    return (
        <div className="game">
          {winner ? (
            <>
              <h1>The winner is {winner}!</h1>
              <button onClick={resetGame}>Play again</button>
            </>
          ):null }  
            <>
              <h1>whos turn: {currentPlayer}</h1>
              <h1>you are: {playerShape}</h1>
              <div className="board">
                {board.map((square, index) => (
                  <button
                    key={index}
                    className="square"
                    disabled = {winner}
                    onClick={() => handleSquareClick(index)}
                  >
                    {square}
                  </button>
                ))}
              </div>
            </>
          
        </div>
      );
      
};

export default Game;
