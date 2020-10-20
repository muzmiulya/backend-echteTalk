const connection = require("../config/mysql")

module.exports = {
    getMessageByUserId: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM messages LEFT JOIN user ON messages.user_id = user.user_id WHERE messages.user_id = ?",
                id,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            )
        })
    },
    getMessageChatByRoom: (roomId) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM messages WHERE roomchat_id = ?",
                roomId,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            )
        })
    },
    getRoomChatById: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT roomchat.roomchat_id, roomchat.user_id, roomchat.friend_id, user.user_email, user.user_name, user.user_phone, user.user_lat, user.user_lng, profile.profile_picture, profile.profile_bio FROM roomchat JOIN user ON roomchat.friend_id = user.user_id JOIN profile ON roomchat.friend_id = profile.user_id WHERE roomchat.user_id = ?",
                id,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            )
        })
    },
    getLatestMessageByRoom: (roomId) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM messages WHERE roomchat_id = ? ORDER BY msg_created_at DESC LIMIT 1",
                roomId,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            )
        })
    },
    getNotificationById: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT notification.roomchat_id, notification.user_id, notification.from_id, notification.notif, notification.notif_created_at, user.user_email, user.user_name, user.user_phone FROM notification JOIN user ON notification.from_id = user.user_id WHERE notification.user_id = ? ORDER BY notif_created_at DESC LIMIT 5",
                id,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            )
        })
    },
    checkroomchat: (userId, friendId) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT user_id, friend_id FROM roomchat WHERE user_id = ? AND friend_id = ?",
                [userId, friendId],
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            );
        });
    },
    postRoomChat: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO roomchat SET ?", setData, (error, result) => {
                if (!error) {
                    const newResult = {
                        id: result.insertId,
                        ...setData,
                    }
                    resolve(newResult)
                } else {
                    reject(new Error(error))
                }
            })
        })
    },
    postMessage: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO messages SET ?", setData, (error, result) => {
                if (!error) {
                    const newResult = {
                        msg_id: result.insertId,
                        ...setData,
                    }
                    resolve(newResult)
                } else {
                    reject(new Error(error))
                }
            })
        })
    },
    postNotification: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO notification SET ?", setData, (error, result) => {
                if (!error) {
                    const newResult = {
                        notif_id: result.insertId,
                        ...setData,
                    }
                    resolve(newResult)
                } else {
                    reject(new Error(error))
                }
            })
        })
    },
}