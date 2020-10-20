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
                    profile_picture: request.file,
                    profile_bio,
                    profile_updated_at: new Date(),
                }
                if (checkUser[0].profile_picture === 'blank-profile.jpg') {
                    if (request.file === undefined) {
                        setDataProfile.profile_picture = 'blank-profile.jpg'
                    } else {
                        setDataProfile.profile_picture = request.file.filename
                    }
                    const result = await patchProfile(setDataProfile, user_id);
                    return helper.response(
                        response,
                        200,
                        "Success Profile Updated",
                        result
                    );
                } else if (request.file === undefined) {
                    setDataProfile.profile_picture = checkUser[0].profile_picture
                    const result = await patchProfile(setDataProfile, user_id);
                    return helper.response(
                        response,
                        200,
                        "Success Profile Updated",
                        result
                    );
                } else {
                    setDataProfile.profile_picture = request.file.filename
                    fs.unlink(`./uploads/${checkUser[0].profile_picture}`, (error) => {
                        if (error) {
                            throw error
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