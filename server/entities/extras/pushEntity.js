const Enemy = require("../enemy");
const SAT = require("sat");

module.exports = class PushEntity extends Enemy {

    constructor(
        owner
    ) {
        super(owner.entity.x, owner.entity.y, 75, "rgba(236, 236, 236, 0.5)", owner.entity.parent, 0, "", true);
        this.owner = owner;
    }

    collideEnemy(enemy) {
        const resp = new SAT.Response();
        if (!SAT.testCircleCircle(this.getCollider(), enemy.getCollider(), resp)) return;
        enemy.x += resp.overlapV.x;
        enemy.y += resp.overlapV.y;
    }

    collidePlayer(p) {}

    move() {
        this.x = this.owner.entity.x;
        this.y = this.owner.entity.y;
    }
    
}