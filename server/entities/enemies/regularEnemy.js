const Enemy = require("../enemy");

module.exports = class RegularEnemy extends Enemy {

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
        this.angle = Math.random() * 6.28318531;
        this.angleX = Math.cos(this.angle);
        this.angleY = Math.sin(this.angle);
        this.up = Math.random() < 0.5;
        this.right = Math.random() < 0.5;
    }

    move() {
        if (this.frozen) return;

        const movX = Math.abs(this.speed * this.angleX);
        const movY = Math.abs(this.speed * this.angleY);

        if (this.right) this.x += movX;
        else if (!this.right) this.x -= movX;
        if (this.up) this.y -= movY;
        else if (!this.up) this.y += movY;

        if (this.x > (this.parent.width - 200) - this.radius) {
            this.x -= this.radius / 2;
            this.right = false;
        } else if (this.x < 200 + this.radius) {
            this.right = true;
        }   
        if (this.y > this.parent.height - (this.radius) || this.y < this.radius) {
            this.up = !this.up;
        }
    }
    
}