const connection = require("../config/mysql");

module.exports = {
    getProfileById: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM profile WHERE profile_id = ?",
                id,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error));
                }
            );
        });
    },
    getProfile: (email) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM profile WHERE user_id = ?",
                email,
                (error, result) => {
                    !error ? resolve(result) : reject(new Error(error))
                }
            )
        })
    },
    postProfile: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO profile SET ?",
                setData,
                (error, result) => {
                    if (!error) {
                        const newResult = {
                            profile_id: result.insertId,
                            ...setData,
                        }
                        resolve(newResult);
                    } else {
                        reject(new Error(error));
                    }
                }
            )
        })
    },
    patchProfile: (setData, id) => {
        return new Promise((resolve, reject) => {
            connection.query(
                "UPDATE profile SET ? WHERE profile_id = ?", [setData, id], (error, result) => {
                    if (!error) {
                        const newResult = {
                            profile_id: id,
                            ...setData,
                        }
                        resolve(newResult);
                    } else {
                        reject(new Error(error));
                    }
                }
            )
        })
    },
}