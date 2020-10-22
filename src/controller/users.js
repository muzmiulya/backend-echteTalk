const bcrypt = require("bcrypt");
const helper = require("../helper/index");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const {
    isUserExist,
    getAllUser,
    getId,
    getUserById,
    inviteFriends,
    patchUser,
    postUser,
    checkUser,
    checkKey,
    changePassword,
    areWeFriend,
    getFriendById,
    postFriend,
    getRoomchatForDelete,
    getFriendForDelete,
    checkRoomchatForDelete,
    deleteContact,
    deleteRoomchat,
} = require("../model/users");
const { postProfile } = require("../model/profile");

module.exports = {
    registerUser: async (request, response) => {
        try {
            const { user_email, user_password, user_name, user_phone, user_lat, user_lng } = request.body;
            const userInDatabase = await isUserExist(user_email);
            if (userInDatabase.length > 0) {
                return helper.response(
                    response,
                    400,
                    "Email Has Already Been Taken"
                );
            } else {
                const atps = user_email.indexOf("@");
                const dots = user_email.lastIndexOf(".");
                if (
                    request.body.user_email === undefined ||
                    request.body.user_email === null ||
                    request.body.user_email === ""
                ) {
                    return helper.response(response, 404, "Email must be filled");
                } else if (atps < 1 || dots < atps + 2 || dots + 2 > user_email.length) {
                    return helper.response(response, 400, "Email is not Valid");
                } else if (
                    request.body.user_password === undefined ||
                    request.body.user_password === null ||
                    request.body.user_password === ""
                ) {
                    return helper.response(response, 404, "Password must be filled");
                } else if (
                    !user_password.match(/[A-Z]/g) ||
                    !user_password.match(/[0-9]/g) ||
                    user_password.length < 8 ||
                    user_password.length > 16
                ) {
                    return helper.response(
                        response,
                        400,
                        "Password Must include 8-16 characters, at least 1 digit number and 1 Uppercase"
                    );
                } else if (request.body.confirm_password !== request.body.user_password) {
                    return helper.response(response, 400, "Password didn't match")
                } else if (
                    request.body.user_name === undefined ||
                    request.body.user_name === null ||
                    request.body.user_name === ""
                ) {
                    return helper.response(response, 404, "User Name must be filled");
                } else if (
                    request.body.user_phone === undefined ||
                    request.body.user_phone === null ||
                    request.body.user_phone === ""
                ) {
                    return helper.response(response, 404, "Phone Number must be filled");
                } else if (
                    request.body.user_phone.length < 8 ||
                    request.body.user_phone.length > 16
                ) {
                    return helper.response(response, 404, "Invalid Phone Number");
                } else if (
                    request.body.user_lat === undefined ||
                    request.body.user_lat === null ||
                    request.body.user_lat === ""
                ) {
                    return helper.response(response, 404, "User lattitude must be filled");
                } else if (
                    request.body.user_lng === undefined ||
                    request.body.user_lng === null ||
                    request.body.user_lng === ""
                ) {
                    return helper.response(response, 404, "User longitude must be filled");
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const encryptPassword = bcrypt.hashSync(user_password, salt);
                    const setData = {
                        user_email: user_email,
                        user_password: encryptPassword,
                        user_name: user_name,
                        user_phone: user_phone,
                        user_lat: user_lat,
                        user_lng: user_lng,
                        user_role: 2,
                        user_status: 1,
                        user_created_at: new Date(),
                        user_updated_at: new Date(),
                        user_key: 0
                    }
                    const result = await postUser(setData);
                    const setData2 = {
                        user_id: result.id,
                        profile_picture: 'blank-profile.jpg',
                        profile_bio: '',
                        profile_created_at: new Date(),
                        profile_updated_at: new Date()
                    }
                    const result2 = await postProfile(setData2)
                    return helper.response(
                        response,
                        200,
                        "Success Register User",
                        result
                    );

                }
            }

        } catch (error) {
            // return helper.response(response, 400, "Bad Request");
            console.log(error)
        }
    },
    getAllUser: async (request, response) => {
        try {
            const result = await getAllUser();
            return helper.response(response, 200, "Success Get All User", result);
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error);
        }
    },
    getUserById: async (request, response) => {
        try {
            const { id } = request.params;
            const result = await getUserById(id);
            if (result.length > 0) {
                return helper.response(response, 200, "Success Get User By Id", result);
            } else {
                return helper.response(response, 404, `User By Id: ${id} Not Found`);
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error);
        }
    },
    inviteFriends: async (request, response) => {
        try {
            let { email } = request.query;
            if (email === undefined || email === null || email === '') {
                return helper.response(response, 400, "User email must be filled")
            } else {
                email = email + "%"
            }
            const result = await inviteFriends(email);
            if (result.length > 0) {
                return helper.response(response, 200, "Success Get User By Email", result);
            } else {
                return helper.response(response, 404, `User By Email: ${email} Not Found`);
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error);
        }
    },
    getFriendById: async (request, response) => {
        try {
            const { id } = request.params;
            const result = await getFriendById(id);
            if (result.length > 0) {
                return helper.response(response, 200, "Success Get friend By Id", result);
            } else {
                const result = ''
                return helper.response(response, 200, "Success Get friend By Id", result);
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error);
        }
    },
    postFriend: async (request, response) => {
        try {
            if (
                request.body.user_id === undefined ||
                request.body.user_id === null ||
                request.body.user_id === ""
            ) {
                return helper.response(response, 404, "user id must be filled");
            } else if (
                request.body.friend_id === undefined ||
                request.body.friend_id === null ||
                request.body.friend_id === ""
            ) {
                return helper.response(response, 404, "user friend must be filled");
            }
            const { user_id, friend_id } = request.body
            const friendinDatabase = await areWeFriend(user_id, friend_id);
            if (
                friendinDatabase.length > 0
            ) {
                return helper.response(response, 404, 'You are already friend');
            } else {
                const setData = {
                    user_id: user_id,
                    friend_id: friend_id,
                    friend_created_at: new Date()
                }
                const friend = await postFriend(setData);
                return helper.response(response, 200, "Friend Created", friend)
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error);
        }
    },
    patchLocation: async (request, response) => {
        try {
            const { id } = request.params;
            const { user_lat, user_lng, } = request.body;
            const checkId = await getId(id);
            if (checkId.length > 0) {
                const setData = {
                    user_lat,
                    user_lng,
                    user_updated_at: new Date(),
                };
                if (
                    request.body.user_lat === undefined ||
                    request.body.user_lat === null ||
                    request.body.user_lat === ""
                ) {
                    return helper.response(response, 404, "user langitude must be filled");
                } else if (
                    request.body.user_lng === undefined ||
                    request.body.user_lng === null ||
                    request.body.user_lng === ""
                ) {
                    return helper.response(response, 404, "user lattitude must be filled");
                }
                const result = await patchUser(setData, id);
                return helper.response(response, 200, "Success User Updated", result);
            } else {
                return helper.response(response, 404, `User By Id: ${id} Not Found`);
            }
        } catch (error) {
            return helper.response(response, 404, "Bad Request", error);
        }
    },
    // ======================================================delete===================================================
    getRoomchatForDelete: async (request, response) => {
        try {
            const { user_id, friend_id } = request.query;
            const result = await getRoomchatForDelete(user_id, friend_id);
            if (result.length > 0) {
                return helper.response(response, 200, "Success Get Roomchat For Delete", result);
            } else {
                return helper.response(response, 404, `Roomchat Not Found`);
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error);
        }
    },
    deleteContact: async (request, response) => {
        try {
            const { id_friend } = request.params
            if (id_friend === undefined || id_friend === null || id_friend === '') {
                return helper.response(response, 404, "id_friend must be filled");
            }
            const checkIdFriend = await getFriendForDelete(id_friend)
            if (checkIdFriend.length > 0) {
                const result = await deleteContact(id_friend);
                return helper.response(response, 200, "Contact Deleted Succesfully", result);
            } else {
                return helper.response(response, 404, "id_friend not found");
            }
        } catch (error) {
            return helper.response(response, 404, "Bad Request", error);
        }
    },
    deleteRoomchat: async (request, response) => {
        try {
            const { roomchat_id } = request.params
            if (roomchat_id === undefined || roomchat_id === null || roomchat_id === '') {
                return helper.response(response, 404, "roomchat_id must be filled");
            }
            const checkRoomchat = await checkRoomchatForDelete(roomchat_id)
            if (checkRoomchat.length > 0) {
                const result = await deleteRoomchat(roomchat_id);
                return helper.response(response, 200, "Roomchat Deleted Succesfully", result);
            } else {
                return helper.response(response, 404, "Roomchat_id not found");
            }
        } catch (error) {
            return helper.response(response, 404, "Bad Request", error);
        }
    },

    // =======================================================================================================================
    loginUser: async (request, response) => {
        if (
            request.body.user_email === undefined ||
            request.body.user_email === null ||
            request.body.user_email === ""
        ) {
            return helper.response(response, 404, "Email must be filled");
        } else if (
            request.body.user_password === undefined ||
            request.body.user_password === null ||
            request.body.user_password === ""
        ) {
            return helper.response(response, 404, "Password must be filled");
        }
        try {
            const { user_email, user_password } = request.body;
            const checkDataUser = await checkUser(user_email);
            if (checkDataUser.length >= 1) {
                const checkPassword = bcrypt.compareSync(
                    user_password,
                    checkDataUser[0].user_password
                );
                if (checkPassword) {
                    const {
                        user_id,
                        user_email,
                        user_name,
                        user_phone,
                        user_lat,
                        user_lng,
                        user_role,
                        user_status,
                    } = checkDataUser[0];
                    let payload = {
                        user_id,
                        user_email,
                        user_name,
                        user_phone,
                        user_lat,
                        user_lng,
                        user_role,
                        user_status,
                    };
                    console.log(payload)
                    if (user_status == 0) {
                        return helper.response(
                            response,
                            400,
                            "Your Account is not Active"
                        );
                    } else {
                        const token = jwt.sign(payload, "RAHASIA", { expiresIn: "6h" });
                        payload = { ...payload, token };
                        return helper.response(response, 200, "Success Login", payload);
                    }
                } else {
                    return helper.response(response, 400, "Wrong Password !");
                }
            } else {
                return helper.response(response, 400, "Email is not Registered !");
            }
        } catch (error) {
            // return helper.response(response, 400, "Bad Request");
            console.log(error)
        }
    },
    forgotPassword: async (request, response) => {
        try {
            const { user_email } = request.body
            const keys = Math.round(Math.random() * 100000)
            const checkDataUser = await checkUser(user_email)
            if (checkDataUser.length >= 1) {
                const data = {
                    user_key: keys,
                    user_updated_at: new Date(),
                };
                await changePassword(data, user_email);
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.USER,
                        pass: process.env.PASS,
                    },
                })
                await transporter.sendMail({
                    from: '"EchteTalk"',
                    to: user_email,
                    subject: "EchteTalk - Forgot Password",
                    html: `<a href="http://localhost:8080/setpassword?keys=${keys}">Click Here To Change Password</a>`,
                }),
                    function (error) {
                        if (error) {
                            return helper.response(response, 400, "Email not sent !")
                        }
                    };
                return helper.response(response, 200, "Email has been sent !")
            } else {
                return helper.response(response, 400, 'Email is not registered !')
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    },
    changePassword: async (request, response) => {
        try {
            const { keys } = request.query
            const { user_password } = request.body
            const checkDataUser = await checkKey(keys)
            if (
                request.query.keys === undefined ||
                request.query.keys === null ||
                request.query.keys === ""
            ) {
                return helper.response(response, 400, "Invalid Key");
            }
            if (checkDataUser.length > 0) {
                const email = checkDataUser[0].user_email
                const setData = {
                    user_key: keys,
                    user_password,
                    user_updated_at: new Date(),
                }
                const difference =
                    setData.user_updated_at - checkDataUser[0].user_updated_at
                const minutesDifference = Math.floor(difference / 1000 / 60)
                if (minutesDifference > 5) {
                    const data = {
                        user_key: "",
                        user_updated_at: new Date(),
                    };
                    await changePassword(data, email);
                    return helper.response(response, 400, "Key has expired")
                } else if (
                    request.body.user_password === undefined ||
                    request.body.user_password === null ||
                    request.body.user_password === ""
                ) {
                    return helper.response(response, 400, "Password must be filled !")
                } else if (
                    request.body.confirm_password === undefined ||
                    request.body.confirm_password === null ||
                    request.body.confirm_password === ""
                ) {
                    return helper.response(
                        response,
                        400,
                        "Confirm Password must be filled !"
                    )
                } else if (
                    !request.body.user_password.match(/[A-Z]/g) ||
                    !request.body.user_password.match(/[0-9]/g) ||
                    request.body.user_password.length < 8 ||
                    request.body.user_password.length > 16
                ) {
                    return helper.response(response, 400, "Password Must include 8-16 characters, at least 1 digit number and 1 Uppercase")
                } else if (request.body.confirm_password !== request.body.user_password) {
                    return helper.response(response, 400, "Password didn't match");
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const encryptPassword = bcrypt.hashSync(user_password, salt)
                    setData.user_password = encryptPassword
                    setData.user_key = ""
                }
                const result = await changePassword(setData, email)
                return helper.response(
                    response,
                    200,
                    "Success Password Updated",
                    result
                );
            } else {
                return helper.response(response, 404, `Invalid key`);
            }
        } catch (error) {
            return helper.response(response, 404, "Bad Request", error);
        }
    }
};
