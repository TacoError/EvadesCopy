const Hero = require("../hero");
const Speedup = require("./abilities/speedup");

module.exports = class Speedster extends Hero {

    constructor(player) {
        super("Speedster", "red", new Speedup(player), null, player);
    }

};