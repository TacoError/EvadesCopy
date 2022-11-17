const Entity = require("../entity");
const Enemy = require("./enemy");

module.exports = class Projectile extends Enemy {

    constructor(
        x = 0,
        y = 0,
        radius = 15,
        color = "gray",
        parent = null,
        speed = 3,
        text = "",
        outline = false,
        angle
    ) {
        constructor(x, y, radius, color, parent, speed, text, outline);
        this.angle = angle;
        this.incx = speed * Math.cos(this.angle);
        this.incy = speed * Math.sin(this.angle);
    }

    move() {

    }

};