const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("client"));
server.listen(3000);

const login = require("./login");
const notepack = require("notepack.io");
const players = {};
const Speedster = require("./heroes/Speedster");
const Pusher = require("./heroes/pusher");
const validHeroes = {
    "speedster": Speedster,
    "pusher": Pusher
};
const profilesMade = [];
const profilesOnline = {};
const levels = require("./utils/mapBuilder").build();
const Player = require("./player");

io.on("connection", (socket) => {
    io.to(socket.id).emit("heroes", Object.keys(validHeroes));

    const emit = (...args) => io.to(socket.id).emit(...args);
    const respond = (response = "Server error.") => emit("response", response);

    socket.on("register", (name, pwd) => {
        if (name.length < 3 || name.length > 12) {
            respond("Name must be more than three, and less than twelve characters.");
            return;
        }
        if (!login.onlyEnglish(name)) {
            respond("Name can only contain english characters.");
            return;
        }
        if (login.profileExists(name)) {
            respond("There is already someone with that name.");
            return;
        }
        if (pwd.length < 6 || pwd.length > 128) {
            respond("Password must be longer than five characters.");
            return;
        }
        if (profilesMade.includes(socket.id)) {
            respond("You can only create one account per session.");
            return;
        }
        profilesMade.push(socket.id);
        login.createProfile(name, pwd);
        respond("Profile created.");
    });

    socket.on("login", (name, pwd, hero) => {
        if (!login.profileExists(name)) {
            respond("There is no profile with that name.");
            return;
        }
        if (!login.passwordCorrect(name, pwd)) {
            respond("Incorrect password.");
            return;
        }
        if (Object.keys(profilesOnline).includes(name)) {
            respond("You are already in game.");
            return;
        }
        if (!Object.keys(validHeroes).includes(hero)) {
            respond("That is not a valid hero.");
            return;
        }
        profilesOnline[name] = true;
        const profile = login.getProfile(name);
        players[socket.id] = new Player(
            name, 
            validHeroes[hero], 
            profile.points, 
            levels["Corrupted Core"].areas[0], 
            profile.unlockedHeroes, 
            io, 
            socket.id,
            profile.rank,
            () => {return levels;},
            socket
        );
        respond("inGame");
        emit("chatUpdate", "[server] Welcome, " + name);
    });

    socket.on("chat", (chat) => {
        if (!players[socket.id]) return;
        if (chat.length > 120) {
            emit("chatUpdate", "[server] Chat message too long.");
            return;
        }
        if (chat.length < 1) {
            emit("chatUpdate", "[server] Chat message too little.");
            return;
        }
        for (const id of Object.keys(players)) {
            io.to(id).emit("chatUpdate", players[socket.id].name + ": " + chat);
        }
    });

    socket.on("keys", (keys) => {
        if (!players[socket.id]) return;
        players[socket.id].setKeys(Object.keys(notepack.decode(keys)));
    });

    socket.on("disconnect", () => {
        if (!Object.keys(profilesOnline).includes(socket.id)) return;
        delete profilesOnline[players[socket.id].name];
        if (!Object.keys(players).includes(socket.id)) return;
        const data = players[socket.id];
        const name = data.name;
        const profile = login.getProfile(data.name);
        login.saveProfile(name, {
            hash: profile.hash,
            salt: profile.salt,
            points: data.points,
            unlockedHeroes: data.heroes,
            rank: data.rank
        });
        delete players[socket.id];
    });
});

// this loads the sendout json, and checks for entity collisions in an area
function loadAreasJSONForSendout() {
    const loaded = {};
    for (const level of Object.values(levels)) {
        if (!loaded[level.name]) loaded[level.name] = [];
        for (const i in level.areas) {
            const area = level.areas[i];
            const json = area.toJSON();
            const playersS = [];
            for (const player of Object.values(players)) {
                if (player.entity.parent.which !== area.which) continue;
                if (player.entity.parent.parent.name !== level.name) continue;
                playersS.push(player);
                json.e.push(player.entity.toJSON());
            }
            area.checkCollisions(playersS);
            loaded[level.name][i] = json;

        }
    }
    return loaded;
}

setInterval(() => {
    for (const level of Object.values(levels)) level.update();
    for (const player of Object.values(players)) player.process();
    const sendoutLevels = loadAreasJSONForSendout();
    for (const [id, player] of Object.entries(players)) {
        io.to(id).emit(
            "gameUpdate", 
            notepack.encode(player.entity.toJSON()),
            notepack.encode(sendoutLevels[player.entity.parent.parent.name][player.entity.parent.which]),
            notepack.encode(player.hero.cooldownJSON()),
            notepack.encode(levels[player.entity.parent.parent.name].toJSON())
        );
    }

}, (1000 / 50));

setInterval(() => {
    for (const player of Object.values(players)) {
        if (player.reviveTime !== -1) {
            player.reviveTime -= 1;
            if (player.reviveTime === 0) {
                player.socket.disconnect();
            }
        }
    }
}, 1000);

console.log("Ready (http://locahost:3000)");