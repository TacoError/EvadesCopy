const Entity = require("../entity");

module.exports = class PlayerEntity extends Entity {

    constructor(
        x = 0,
        y = 0,
        radius = 15,
        color = "gray",
        parent = null,
        speed = 3,
        text = "",
        outline = false,
        getLevels
    ) {
        super(x, y, radius, color, parent, speed, text, outline);
        this.getLevels = getLevels;
    }

    moveLevel(reverse = false) {
        let next = "";
        let isNext = false;
        const list = reverse ? Object.keys(this.getLevels()).reverse() : Object.keys(this.getLevels());
        for (const name of list) {
            if (isNext) {
                next = name;
                break;
            }
            if (name === this.parent.parent.name){
                isNext = true;
                continue;
            }
        }
        const newArea = next !== "" ? this.getLevels()[next].areas[0] : this.getLevels()[list[0]].areas[0];
        this.y = reverse ? newArea.height - (50 + this.radius) : 50 + this.radius;
        if (!isNext) {
            this.parent = newArea;
            return;
        }
        this.parent = newArea;        
    }

    processKeys(keys) {
        const speed = keys.includes("shift") ? this.speed / 2 : this.speed;
        if (keys.includes("w")) this.y -= speed;
        if (keys.includes("s")) this.y += speed;
        if (keys.includes("a")) this.x -= speed;
        if (keys.includes("d")) this.x += speed;
        this.parent.correctMovement(this);

        if (this.parent.which === 0 && this.x < (200 + this.radius)) {
            if (this.y < 50) {
                this.moveLevel(true);
                return;
            }
            if (this.y > this.parent.height - (50 + this.radius)) {
                this.moveLevel(false);
            }
        }
    }

}