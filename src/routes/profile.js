const router = require("express").Router();
const {
    getProfile,
    patchProfile
} = require("../controller/profile");
const { authorization } = require("../middleware/auth");
const uploadImage = require("../middleware/multer");

router.get("/:id", authorization, getProfile);

router.patch("/patch/:user_id", authorization, uploadImage, patchProfile)

module.exports = router;