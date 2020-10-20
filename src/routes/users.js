const router = require("express").Router();
const {
    registerUser,
    loginUser,
    patchLocation,
    getAllUser,
    getUserById,
    forgotPassword,
    changePassword,
    inviteFriends,
    getFriendById,
    postFriend,
    getRoomchatForDelete,
    deleteContact,
    deleteRoomchat
} = require("../controller/users");
const { authorization, authorization2 } = require("../middleware/auth");

router.post("/register", registerUser);
router.patch("/patch/location/:id", authorization, patchLocation);
router.post("/login", loginUser);
router.get("/user/", authorization2, getAllUser);
router.get("/user/:id", authorization, getUserById);

router.get("/get/roomchat", authorization, getRoomchatForDelete);
router.delete("/delete/contact/:id_friend", authorization, deleteContact);
router.delete("/delete/roomchat/:roomchat_id", authorization, deleteRoomchat);

router.get("/invite", authorization, inviteFriends);
router.get('/friend/:id', authorization, getFriendById)
router.post('/friend', authorization, postFriend)

router.post('/forgot', forgotPassword)
router.patch('/change', changePassword)

module.exports = router;