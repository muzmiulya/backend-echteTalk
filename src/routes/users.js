const router = require("express").Router();
const {
    registerUser,
    loginUser,
    patchUser,
    getAllUser,
    getUserById,
    deleteUser,
    activationEmail,
    activationUser,
    forgotPassword,
    changePassword,
    // refreshToken
    inviteFriends,
} = require("../controller/users");
const { authorization, authorization2 } = require("../middleware/auth");

router.post("/register", registerUser);
router.patch("/patch/:id", authorization, patchUser);
router.post("/login", loginUser);
router.get("/user/", authorization2, getAllUser);
router.get("/user/:id", getUserById);
router.delete("/delete/:id", authorization2, deleteUser);
router.get("/invite", authorization, inviteFriends);

router.post('/register/email', activationEmail)
router.patch('/activate', activationUser)

router.post('/forgot', forgotPassword)
router.patch('/change', changePassword)

// router.post("/token", refreshToken)

module.exports = router;