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
        if (this.firstUse) return 0;
        const ret = this.cooldown - ((new Date().getTime() - this.lastUsed.getTime()) / 1000);
        return ret < 0.1 ? 0 : ret;
    }

    toJSON() {
        return {
            n: this.name,
            c: this.cooldown,
            d: this.description
        };
    }

    isOnCooldown() {
        return this.firstUse ? false : this.cooldownSeconds() > 0;
    }

    setOnCooldown() {
        this.firstUse = false;
        this.lastUsed = new Date();
    }

    onUse() {}

};