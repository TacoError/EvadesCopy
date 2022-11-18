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
        getLevels,
        player
    ) {
        super(x, y, radius, color, parent, speed, text, outline);
        this.getLevels = getLevels;
        this.first = false;
        this.lock = false;
        this.player = player;
    }
    
    collidePlayer(player) {
        if (this.player.reviveTime !== -1) return;
        if (player.reviveTime === -1) return;
        player.reviveTime = -1;
    }

    moveArea(forward = true) {
        const current = this.parent.which;
        if (forward) {
            if (this.parent.parent.areas.length < current + 1) return;
            const next = this.parent.parent.areas[current + 1];
            if (next === undefined) return;
            if (next.points > 0) {
                if (!next.socketsPoints.includes(this.player.socket.id)) {
                    this.player.points += next.points;
                }
            }
            this.x = 55 + this.radius;
            this.parent = next;
        } else {
            if (this.parent.parent.areas.length < current - 1) return;
            const next = this.parent.parent.areas[current - 1];
            if (next === undefined) return;
            this.x = next.width - (50 + this.radius);
            this.parent = next;
        }
    }

    moveLevel(reverse = false) {
        if (!this.first) {
            this.first = true;
            this.lock = false;
            return;
        }
        let next = "";
        let isNext = false;
        const list = reverse ? Object.keys(this.getLevels()).reverse() : Object.keys(this.getLevels());
        for (const name of list) {
            if (isNext) {
                next = name;
                break;
            }
            if (name === this.parent.parent.name) {
                isNext = true;
                continue;
            }
        }
        const newArea = next !== "" ? this.getLevels()[next].areas[0] : this.getLevels()[list[0]].areas[0];
        if (!isNext) {
            this.parent = newArea;
            this.y = reverse ? newArea.height - (100 + this.radius) : 100 + this.radius;
            this.lock = false;
            return;
        }
        this.parent = newArea;   
        this.y = reverse ? newArea.height - (100 + this.radius) : 100 + this.radius;     
        this.lock = false;
    }

    processKeys(keys) {
        if (this.lock || this.player.reviveTime !== -1) return;
        const speed = keys.includes("shift") ? this.speed / 2 : this.speed;
        if (keys.includes("w")) this.y -= speed;
        if (keys.includes("s")) this.y += speed;
        if (keys.includes("a")) this.x -= speed;
        if (keys.includes("d")) this.x += speed;
        this.parent.correctMovement(this);

        if (this.x > this.parent.width - (50 + this.radius)) {
            this.moveArea(true);
            return;
        }
        if (this.x < 50 + this.radius && this.parent.which !== 0) {
            this.moveArea(false);
            return;
        }

        if (this.parent.which === 0 && this.x < (200 + this.radius)) {
            if (this.y < 50 + this.radius) {
                this.lock = true;
                this.moveLevel(true);
                return;
            }
            if (this.y > this.parent.height - (50 + this.radius)) {
                this.lock = true;
                this.moveLevel(false);
            }
        }
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            r: this.radius,
            c: this.player.reviveTime === -1 ? this.color : "rgba(220, 220, 220, 0.5)",
            t: this.player.reviveTime === -1 ? this.player.name : this.player.name + " | " + this.player.reviveTime,
            o: this.outline
        };
    }

}