module.exports = class Level {

    constructor(name = "", textColor = "", levelColor = "") {
        this.name = name;
        this.textColor = textColor;
        this.levelColor = levelColor;
        this.areas = [];
    }

    update() {
        for (const area of this.areas) {
            //if (area.playersHere < 1) continue;
            area.update();
        }
    }

    toJSON() {
        return {
            n: this.name,
            t: this.textColor,
            l: this.levelColor
        };
    }

};