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
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT user.user_id, user.user_email, user.user_name, user.user_phone, profile.profile_picture, profile.profile_bio FROM user JOIN profile ON user.user_id = profile.user_id WHERE user.user_id = ?",
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
    inviteFriends: (email) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT user_id, user_email, user_name, user_phone FROM user WHERE user_email LIKE ?",
                email,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error))
                }
            )
        })
    },
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
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "DELETE FROM user WHERE user_id = ?",
                id,
                (error, result) => {
                    if (!error) {
                        const newResult = {
                            id: id,
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
