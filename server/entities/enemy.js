const Entity = require("../entity");

module.exports = class Enemy extends Entity {

    constructor(
        x = 0,
        y = 0,
        radius = 15,
        color = "gray",
        parent = null,
        speed = 3,
        text = "",
        outline = false
    ) {
        super(x, y, radius, color, parent, speed, text, outline);
        this.frozen = false;
    }

    collidePlayer(player) {}

    move() {}

}