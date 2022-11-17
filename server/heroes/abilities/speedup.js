const Power = require("../../power");

module.exports = class Speedup extends Power {

    constructor(player) {
        super("Speedup", "Choose to speed up, and slow down!", 3, player);
        this.enabled = true;
    }

    onUse() {
        if (this.isOnCooldown()) return;
        if (this.enabled) {
            this.enabled = false;
            this.player.entity.speed = this.player.entity.speed + 3;
            this.player.entity.color = "orange";
        } else {
            this.enabled = true;
            this.player.entity.speed = this.player.entity.baseSpeed;
            this.player.entity.color = this.player.hero.color;
        }
        this.setOnCooldown();
    }

};