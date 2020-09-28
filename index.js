require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const routerNavigation = require("./src");

const socket = require("socket.io");

const app = express();
app.use(cors());

const http = require("http");
const server = http.createServer(app);
const io = socket(server);

io.on("connection", (socket) => {
  console.log("Socket.io Connected !");

  socket.on("globalMessage", (data) => {
    io.emit("chatMessage", data);
  });
  socket.on("privateMessage", (data) => {
    socket.emit("chatMessage", data);
  });
  socket.on("broadcastMessage", (data) => {
    socket.broadcast.emit("chatMessage", data);
  });

  socket.on("welcomeMessage", (data) => {
    socket.emit("chatMessage", {
      username: "BOT",
      message: `Welcome Back ${data.username} !`,
    });
    // Global
    // socket.broadcast.emit("chatMessage", {
    //   username: "BOT",
    //   message: `${data.username} Joined Chat !`,
    // });
    // Specific
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("chatMessage", {
      username: "BOT",
      message: `${data.username} Joined Chat !`,
    });

    socket.on("roomMessage", (data) => {
      io.to(data.room).emit("chatMessage", data);
    });
  });

  socket.on("typing", (data) => {
    socket.broadcast.to(data.room).emit("typingMessage", data.username);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(express.static('uploads'))
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization')
  next()
})

app.use("/", routerNavigation);

app.get('*', (request, response) => {
  response.status(404).send('Path not Found')
})

server.listen(process.env.PORT, process.env.IP, () => {
  console.log(`Express app is listening on host: ${process.env.IP} and port: ${process.env.PORT}`);
});