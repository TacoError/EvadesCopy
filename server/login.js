const crypto = require("crypto");
const db = new (require("simple-json-db"))("data/storage.json");

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    return [
        crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex"),
        salt
    ];
}

function matchPassword(password, hash, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex") === hash;
}

function getProfile(name) {
    return db.get(name);
}

module.exports = {
    getProfile,

    onlyEnglish: (text) => {
        return /^[a-zA-Z]+$/.test(text);
    },

    profileExists: (name) => {
        return db.has(name);
    },
    
    passwordCorrect: (name, password) => {
        const account = getProfile(name);
        return matchPassword(password, account.hash, account.salt);
    },

    createProfile: (name, password) => {
        const hash = hashPassword(password);
        db.set(name, {
            hash: hash[0],
            salt: hash[1],
            points: 0,
            unlockedHeroes: ["speedster", "pusher"],
            rank: "Guest"
        });  
        db.sync();      
    },

    saveProfile: (name, data) => {
        db.set(name, data);
        db.sync();
    }

};