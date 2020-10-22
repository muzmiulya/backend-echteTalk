const connection = require("../config/mysql");

module.exports = {
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
                "UPDATE profile SET ? WHERE user_id = ?", [setData, id], (error, result) => {
                    if (!error) {
                        const newResult = {
                            user_id: id,
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