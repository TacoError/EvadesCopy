const PushEntity = require("../../entities/extras/pushEntity");
const Power = require("../../power");

module.exports = class Push extends Power {

    constructor(player) {
        super("Push", "Push enemies away for 3 seconds!", 10, player);
    }

    onUse() {
        if (this.isOnCooldown()) return;
        this.setOnCooldown();
        const entity = new PushEntity(this.player);
        this.player.entity.parent.enemies.push(entity);
        setTimeout(() => {
            entity.despawn = true;
        }, 3000);
    }

};