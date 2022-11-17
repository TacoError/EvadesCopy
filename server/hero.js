module.exports = class Hero {

    constructor(name, color, power1 = null, power2 = null, player = null) {
        this.name = name;
        this.color = color;
        this.player = player;
        this.power1 = power1;
        this.power2 = power2;
    } 

    cooldownJSON() {
        return {
            one: this.power1 === null ? 0 : this.power1.cooldownSeconds(),
            two: this.power2 === null ? 0 : this.power2.cooldownSeconds()
        };
    }

};