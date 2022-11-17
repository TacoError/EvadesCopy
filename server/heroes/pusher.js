const Hero = require("../hero");
const Push = require("./abilities/push");

module.exports = class Pusher extends Hero {

    constructor(player) {
        super("Pusher", "aqua", new Push(player), null, player);
    }

};