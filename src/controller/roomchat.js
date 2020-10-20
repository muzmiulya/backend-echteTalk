const {
    getMessageChatByRoom,
    getMessageByUserId,
    getLatestMessageByRoom,
    getNotificationById,
    getRoomChatById,
    checkroomchat,
    postRoomChat,
    postMessage,
    postNotification
} = require("../model/roomchat")

const helper = require("../helper/index")
const { request, response } = require("express")

module.exports = {
    getMessageByUserId: async (request, response) => {
        try {
            const { user_id } = request.body;
            const result = await getMessageByUserId(user_id)
            if (result.length > 0) {
                return helper.response(response, 200, "Succes get Message By User Id", result)
            } else {
                return helper.response(response, 404, `Message By Id : ${user_id} Not Found`)
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    },
    getRoomChatById: async (request, response) => {
        try {
            const { user_id } = request.params
            const result = await getRoomChatById(user_id)
            const plusLatestMessage = await Promise.all(result.map(async (value) => {
                const latestMessage = await getLatestMessageByRoom(value.roomchat_id)
                const messages = latestMessage.map(value => {
                    return value.msg
                })
                if (messages.length <= 0) {
                    messages[0] = ''
                }
                const dates = latestMessage.map(value => {
                    return value.msg_created_at
                })
                if (dates.length <= 0) {
                    dates[0] = ''
                } else {
                    dates[0] = dates[0].toLocaleString([], { hour: '2-digit', minute: '2-digit' })
                }
                const setData = {
                    roomchat_id: value.roomchat_id,
                    user_id: value.user_id,
                    friend_id: value.friend_id,
                    user_email: value.user_email,
                    user_name: value.user_name,
                    user_phone: value.user_phone,
                    user_lat: value.user_lat,
                    user_lng: value.user_lng,
                    profile_picture: value.profile_picture,
                    profile_bio: value.profile_bio,
                    latestMessage: messages[0],
                    messageDate: dates[0]
                }
                return setData
            }))
            if (result.length > 0) {
                return helper.response(response, 200, "Succes get Roomchat By User Id", plusLatestMessage)
            } else {
                const plusLatestMessage = ''
                return helper.response(response, 200, "Succes get Roomchat By User Id", plusLatestMessage)
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    },
    getMessageChatByRoom: async (request, response) => {
        try {
            const { roomchat_id } = request.params;
            const result = await getMessageChatByRoom(roomchat_id)
            if (result.length > 0) {
                return helper.response(response, 200, "Success get Message By Roomchat Id", result)
            } else {
                const result = ''
                return helper.response(response, 200, "Success get Message By Roomchat Id", result)
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    },
    getNotificationById: async (request, response) => {
        try {
            const { user_id } = request.params
            const result = await getNotificationById(user_id)
            if (result.length > 0) {
                return helper.response(response, 200, "Succes get Notification By User Id", result)
            } else {
                const result = 'no message'
                return helper.response(response, 200, "Succes get Notification By User Id", result)
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error)
        }
    },
    postRoomChat: async (request, response) => {
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
            const isRoomchatExist = await checkroomchat(user_id, friend_id)
            if (
                isRoomchatExist.length > 0
            ) {
                return helper.response(response, 404, 'You are already have a roomchat');
            } else {
                const roomChatId = Math.round(Math.random() * 100000)
                const setData = {
                    roomchat_id: roomChatId,
                    user_id: user_id,
                    friend_id: friend_id,
                    created_at: new Date()
                }
                const setData2 = {
                    roomchat_id: roomChatId,
                    user_id: friend_id,
                    friend_id: user_id,
                    created_at: new Date()
                }
                const postUserId = await postRoomChat(setData);
                const postFriendId = await postRoomChat(setData2);
                return helper.response(response, 200, "Roomchat Created", postUserId)
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error);
        }
    },
    postMessage: async (request, response) => {
        try {
            const { roomchat_id, user_id, friend_id, msg } = request.body
            const setData = {
                roomchat_id,
                user_id,
                msg,
                msg_created_at: new Date(),
            }
            const setData2 = {
                roomchat_id,
                user_id: friend_id,
                from_id: user_id,
                notif: `${msg}`,
                notif_created_at: new Date()
            }
            if (setData.roomchat_id === "") {
                return helper.response(response, 404, ` Input roomchat id`)
            } else if (setData.user_id === "") {
                return helper.response(response, 404, ` Input user id`)
            } else if (setData.msg === "") {
                return helper.response(response, 404, ` Input message`)
            } else {
                const result = await postMessage(setData);
                const notification = await postNotification(setData2)
                return helper.response(response, 201, "Message Created", result);
            }
        } catch (error) {
            return helper.response(response, 400, "Bad Request", error);
        }
    },
}