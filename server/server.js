const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const {Server} = require('socket.io');
const http = require('http');
const mysql = require('mysql');
const cors = require('cors');
app.use(cors());



const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

const users = {};
const games = {};

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'OnlineGame'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }

    console.log('Connected to MySQL as id ' + connection.threadId);
});

//add users table
//   connection.query('CREATE TABLE users (userId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, isActive Boolean NOT NULL)', (err, result) => {
//     if (err) throw err;
//     console.log('Table created successfully');
//   });


app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.post('/sendMessage', (req, res) => {
    sendMessage(req, res);
});

app.post('/login', (req, res) => {
    login(req, res);
});

app.post('/logout', (req, res) => {
    const { username } = req.body;


    // Update the user's isActive status in the database
    connection.query('UPDATE users SET isActive = false WHERE username = ?', [username], (err) => {
        if (err) throw err;
        console.log('User logged out');
    });

    res.send({ success: true });
});

app.get('/users/:username', (req, res) => {
    const username = req.params.username;
  
    // Query the database to retrieve the user by their username
    const query = `
      SELECT *
      FROM users
      WHERE username = ?
    `;
  
    connection.query(query, [username], (error, results) => {
      if (error) {
        // Return a 500 error if there was a problem querying the database
        return res.status(500).json({ error: error.message });
        console.log(error);
      }
  
      if (results.length > 0) {
        // Return the user information in the response
        return res.json(results[0]);
      } else {
        // Return a 404 error if the user was not found
        return res.status(404).json({ error: 'User not found' });
      }
    });
  });
  
app.get('/users', (req, res) => {
    // Fetch the list of users from the database
    connection.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
  
      res.send(results);
    });
  });
  

app.post('/register', (req, res) => {
    const { username, password, name, lastname } = req.body;

    // Check if the username is already in use
    if (users[username]) {
        res.status(409).send({ error: 'Username already in use' });
        return;
    }
    // Add the user to the users object
    users[username] = {
        password,
        name,
        lastname,
        loggedIn: false,
        inGameWith: null,
        messages: []
    };

    // Insert the user into the database
    connection.query('INSERT INTO users (username, password, name, lastname, isActive) VALUES (?, ?, ?, ?, false)',
        [username, password, name, lastname],
        (err) => {
            if (err) throw err;
        });

    res.send({ success: true });

});


function login(req, res) {
    const { username, password } = req.body;

    // Look up the user in the database
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) throw err;

        // If the user is not found, return an error
        if (!results.length) {
            res.status(401).send({ error: 'Invalid username or password' });
            return;
        }

        // Verify the password
        const user = results[0];
        if (user.password !== password) {
            res.status(401).send({ error: 'Invalid username or password' });
            return;
        }

        // If the username and password are correct, log the user in
        connection.query('UPDATE users SET isActive = true WHERE username = ?', [username], (err) => {
            if (err) throw err;
            console.log('User logged in');
        });

        res.send({ success: true });
    });
}

function sendMessage(req, res) {
    const { username, message } = req.body;

    // Check if the user is logged in
    if (!users[username] || !users[username].loggedIn) {
        res.status(401).send({ error: 'User is not logged in' });
        return;
    }

    // Add the message to the user's list of messages
    users[username].messages.push(message);

    // Send the message to all other users in the game
    for (const user in users) {
        if (user !== username && users[user].loggedIn && users[user].inGameWith === username) {
            io.to(user).emit('message', message);
        }
    }

    res.send({ success: true });
}







// Handle a connection event
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
