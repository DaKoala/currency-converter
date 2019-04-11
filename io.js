const fs = require('fs');

let db;
fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
        throw err;
    } else if (data.length === 0) {
        fs.writeFile('./db.json', '[]', 'utf8', (writeErr) => {
            if (writeErr) {
                throw writeErr;
            } else {
                db = [];
            }
        });
    } else {
        db = JSON.parse(data);
    }
});

function hasUser (username) {
    return db.reduce((acc, item) => acc || item.username === username, false);
}

function addUser (form) {
    return new Promise((resolve, reject) => {
        const newUser = {
            username: form.username,
            password: form.password,
        };
        db.push(newUser);
        fs.writeFile('./db.json', JSON.stringify(db), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(newUser);
            }
        })
    });
}

function authUser (form) {
    return db.reduce((acc, item) => {
        return acc || (item.username === form.username && item.password === form.password);
    }, false);
}

module.exports = {
    hasUser,
    addUser,
    authUser,
};
