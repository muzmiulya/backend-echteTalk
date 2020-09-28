const routes = require("express").Router()

const users = require("./routes/users");
const profile = require("./routes/profile")
const roomchat = require("./routes/roomchat")
routes.use("/users", users);
routes.use("/profile", profile);
routes.use("/roomchat", roomchat)

module.exports = routes
