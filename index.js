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
  socket.on("welcomeMessage", (data) => {
    socket.join(data.room);
  });
  socket.on("joinNotification", (data) => {
    socket.join(data.user)
  })
  socket.on("changeRoom", (data) => {
    socket.leave(data.oldRoom.roomchat_id)
    socket.join(data.newRoom.roomchat_id)
  })
  socket.on("roomMessage", (data) => {
    io.to(data.roomchat_id).emit("chatMessage", data);
  });
  socket.on("sendNotification", (data) => {
    socket.broadcast.to(data.friend_id).emit("notification", data);
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
