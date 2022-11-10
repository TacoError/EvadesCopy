const Enemy = require("./entities/enemy");
const SAT = require("sat");

module.exports = class Area {

    constructor(width = 0, height = 0, enemies = [], parent = null, points = 0, which = 0) {
        this.width = width;
        this.height = height;
        this.enemies = enemies;
        this.parent = parent;
        this.points = points;   
        this.playersHere = 0;
        this.which = which;
        this.boarders = [
            new SAT.Box(new SAT.Box(0, -1), width, 1).toPolygon(),
            new SAT.Box(new SAT.Vector(-1, 0), 1, height).toPolygon(),
            new SAT.Box(new SAT.Vector(width + 1, 0), -1, height).toPolygon(),
            new SAT.Box(new SAT.Vector(0, this.height + 1), width, -1).toPolygon()
        ];
    }
    
    checkCollisions(players) {
        for (const player of players) {
            for (const play of players) {
                if (player.id === play.id) continue;
                if (!player.entity.collidesWithCircle(play.entity.getCollider())) continue;
                player.entity.collidePlayer(play);
            }
        }
        for (const entity of this.enemies) {
            for (const player of players) {
                if (!entity.collidesWithCircle(player.entity.getCollider())) continue;
                entity.collidePlayer(player);
            }
        }
    }

    correctMovement(entity) {
        for (let boarder in this.boarders) {
            boarder = this.boarders[boarder];
            const response = new SAT.Response();
            if (!entity.collidesWithPolygon(boarder, response)) continue;
            entity.x -= response.overlapV.x;
            entity.y -= response.overlapV.y;
        }
    }

    update() {
        for (const enemy of this.enemies) {
            if (!enemy instanceof Enemy) continue;
            enemy.move();
        }
    }

    toJSON() {
        return {
            w: this.width,
            h: this.height,
            e: this.enemies.map(enemy => enemy.toJSON()),
            p: this.points,
            wh: this.which
        };
    }

};