const helper = require("../helper/index");
const {
    getProfile,
    getProfileById,
    patchProfile
} = require("../model/profile");
const { getUserById, patchUser } = require("../model/users")
const fs = require("fs");

module.exports = {
    getProfile: async (request, response) => {
        try {
            const { id } = request.params;
            const result = await getProfile(id);
            if (result.length > 0) {
                return helper.response(response, 200, "Success Get Profile By Id", result);
            } else {
                return helper.response(response, 404, `Profile By Id: ${id} Not Found`);
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error);
        }
    },
    patchProfile: async (request, response) => {
        try {
            const { user_id } = request.params;
            const { user_name, user_phone, profile_bio } = request.body
            const checkUser = await getUserById(user_id)
            if (checkUser.length > 0) {
                const setDataUser = {
                    user_name,
                    user_phone
                }
                await patchUser(setDataUser, user_id)
                const setDataProfile = {
                    profile_picture:
                        request.file === undefined || request.file === '' ? checkUser[0].profile_picture : request.file.filename,
                    profile_bio,
                    profile_updated_at: new Date(),
                }
                if (setDataProfile.profile_picture === checkUser[0].profile_picture) {
                    const result = await patchProfile(setDataProfile, user_id);
                    return helper.response(
                        response,
                        200,
                        "Success Profile Updated",
                        result
                    );
                } else {
                    const getProfilePicture = checkUser.map((value) => {
                        return value.profile_picture;
                    });
                    const justPicture = getProfilePicture[0];
                    const path = `./uploads/${justPicture}`;
                    fs.unlink(path, (err) => {
                        if (err) {
                            return;
                        }
                    });
                    const result = await patchProfile(setDataProfile, user_id);
                    return helper.response(
                        response,
                        200,
                        "Success Profile Updated",
                        result
                    );
                }
            } else {
                return helper.response(response, 404, `Profile By Id: ${id} Not Found`)
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    },
}