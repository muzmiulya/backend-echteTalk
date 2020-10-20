const connection = require("../config/mysql");

module.exports = {
    isUserExist: (email) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT user_email FROM user WHERE (user_email=?)",
                email,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            );
        });
    },
    getAllUser: () => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM user WHERE user_status = 1`, (error, result) => {
                !error ? resolve(result) : reject(new Error(error));
            });
        });
    },
    getId: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM user WHERE user_id = ?",
                id,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            );
        });
    },
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT user.user_id, user.user_email, user.user_name, user.user_phone, user.user_lat, user.user_lng, profile.profile_picture, profile.profile_bio FROM user JOIN profile ON user.user_id = profile.user_id WHERE user.user_id = ?",
                id,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            );
        });
    },
    postUser: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO user SET ?", setData, (error, result) => {
                if (!error) {
                    const newResult = {
                        id: result.insertId,
                        ...setData,
                    };
                    delete newResult.user_password;
                    resolve(newResult);
                } else {
                    reject(new Error(error));
                }
            });
        });
    },
    patchUser: (setData, id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "UPDATE user SET ? WHERE user_id = ?",
                [setData, id],
                (error, result) => {
                    if (!error) {
                        const newResult = {
                            user_id: id,
                            ...setData,
                        };
                        resolve(newResult);
                    } else {
                        reject(new Error(error));
                    }
                }
            );
        });
    },
    checkUser: (email) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM user WHERE user_email = ?",
                email,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error))
                }
            )
        })
    },
    checkKey: (keys) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM user WHERE user_key = ?",
                keys,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error))
                }
            )
        })
    },
    //===============================================Friends==============================================
    inviteFriends: (email) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT user.user_id, user.user_email, user.user_name, user.user_phone, profile.profile_picture, profile.profile_bio FROM user JOIN profile ON user.user_id = profile.user_id WHERE user.user_email LIKE ?",
                email,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error))
                }
            )
        })
    },
    areWeFriend: (userId, friendId) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT user_id, friend_id FROM friends WHERE user_id = ? AND friend_id = ?",
                [userId, friendId],
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            );
        });
    },
    getFriendById: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT friends.id_friend, friends.user_id, friends.friend_id, user.user_email, user.user_name, user.user_phone, profile.profile_picture, profile.profile_bio FROM friends JOIN user ON friends.friend_id = user.user_id JOIN profile ON friends.friend_id = profile.user_id WHERE friends.user_id = ?",
                id,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            )
        })
    },

    postFriend: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO friends SET ?", setData, (error, result) => {
                if (!error) {
                    const newResult = {
                        id_friend: result.insertId,
                        ...setData,
                    }
                    resolve(newResult)
                } else {
                    reject(new Error(error))
                }
            })
        })
    },

    //===============================================Friends==============================================
    changePassword: (setData, email) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "UPDATE user SET ? WHERE user_email = ?",
                [setData, email],
                (error, result) => {
                    if (!error) {
                        const newResult = {
                            user_email: email,
                            ...setData,
                        }
                        resolve(newResult)
                    } else {
                        reject(new Error(error))
                    }
                }
            )
        })
    },
    // ================================================================delete==============================================
    getFriendForDelete: (friend) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM friends WHERE id_friend = ?",
                friend,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            )
        })
    },
    getRoomchatForDelete: (user, friend) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT roomchat_id FROM roomchat WHERE user_id = ? AND friend_id = ?",
                [user, friend],
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            )
        })
    },
    checkRoomchatForDelete: (roomchat) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM roomchat WHERE roomchat_id = ?",
                roomchat,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            )
        })
    },
    deleteContact: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "DELETE FROM friends WHERE id_friend = ?",
                id,
                (error, result) => {
                    if (!error) {
                        const newResult = {
                            id_friend: id,
                        };
                        resolve(newResult);
                    } else {
                        reject(new Error(error));
                    }
                }
            );
        });
    },
    deleteRoomchat: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "DELETE FROM roomchat WHERE roomchat_id = ?",
                id,
                (error, result) => {
                    if (!error) {
                        const newResult = {
                            roomchat_id: id,
                        };
                        resolve(newResult);
                    } else {
                        reject(new Error(error));
                    }
                }
            );
        });
    },
};
