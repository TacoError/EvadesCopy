const notepack = require("notepack.io");
const PlayerEntity = require("./entities/playerEntity");
const mathUtils = require("./utils/mathUtils");

module.exports = class Player {

    constructor(name = "", hero = null, points = 0, area = null, heroes = [], io = null, id = 0, rank = "Guest", getLevels, socket) {
        this.name = name;
        this.hero = new hero(this);
        this.points = points;
        this.heroes = [];

        this.entity = new PlayerEntity(
            mathUtils.getRandomInt(15, 200 - 15),
            mathUtils.getRandomInt(50 + 15, 500),
            15,
            this.hero.color,
            area,
            10,
            name,
            false,
            getLevels,
            this
        );
        
        this.canDie = true;
        this.reviveTime = -1;
        this.keys = [];
        this.io = io;
        this.id = id;
        this.rank = rank;
        this.socket = socket;
        io.to(id).emit("init", notepack.encode({
            heroColor: this.hero.color,
            heroName: this.hero.name,
            power1: this.hero.power1 === null ? null : this.hero.power1.toJSON(),
            power2: this.hero.power2 === null ? null : this.hero.power2.toJSON()
        }));
    }

    onKeyPressed(key) {
        if (key === "z" || key === "j") {
            if (this.hero.power1 === null) return;
            this.hero.power1.onUse();
        } else if (key === "x" || key === "k") {
            if (this.hero.power2 === null) return;
            this.hero.power2.onUse();
        }
    }

    setKeys(keys) {
        for (const key of keys) {
            if (!this.keys.includes(key)) this.onKeyPressed(key);
        }
        this.keys = keys;
    }

    process() {
        if (!this.reviveTime === -1) return;
        this.entity.processKeys(this.keys);
    }

};