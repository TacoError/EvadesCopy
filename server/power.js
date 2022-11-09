module.exports = class Power {

    constructor(name, description, cooldown, player) {
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.player = player;
        this.lastUsed = 0;
        this.firstUse = true;
    }

    cooldownSeconds() {
        if (!this.lastUsed["getTime"]) return 0;
        const ret = ((Math.abs((new Date().getTime() - this.lastUsed.getTime())) / 1000) - this.cooldown).toFixed(2);
        return ret < 1 ? 0 : ret;
    }

    toJSON() {
        return {
            n: this.name,
            c: this.cooldown,
            d: this.description
        };
    }

    isOnCooldown() {
        return this.firstUse === true ? false : (Math.abs((new Date().getTime() - this.lastUsed.getTime())) / 1000) > this.cooldown;
    }

    setOnCooldown() {
        this.firstUse = false;
        this.lastUsed = new Date();
    }

    onUse() {}

};