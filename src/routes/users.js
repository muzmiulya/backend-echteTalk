const router = require("express").Router();
const {
    registerUser,
    loginUser,
    patchUser,
    getAllUser,
    getUserById,
    deleteUser,
} = require("../controller/users");
// const { authorization2 } = require("../middleware/auth");

router.post("/register", registerUser);
router.patch("/patch/:id", patchUser);
router.post("/login", loginUser);
router.get("/user/", getAllUser);
router.get("/user/:id", getUserById);
router.delete("/delete/:id", deleteUser);

module.exports = router;