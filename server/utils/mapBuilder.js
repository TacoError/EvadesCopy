const fs = require("fs");
const Area = require("../area");
const RegularEnemy = require("../entities/enemies/regularEnemy");
const Level = require("../level");
const math = require("./mathUtils");

const fileNames = [];
fs.readdirSync("maps").forEach((name) => {
    fileNames.push(name);
});

function buildMap(info) {
    const level = new Level(info.name, info.textColor, info.levelColor);
    const areas = [];
    let currentArea = 0;
    for (const data of info.areas) {
        const area = new Area(data.width, data.height, [], level, data.points, currentArea);
        const enemies = [];
        for (const eData of data.enemies) {
            for (let i = 0; i <= eData.amount; i++) {
                if (eData.type === "regular") {
                    enemies.push(new RegularEnemy(
                        math.getRandomInt((200 + eData.radius), area.width - (200 + eData.radius)),
                        math.getRandomInt((eData.radius), area.height - eData.radius),
                        eData.radius,
                        eData.color,
                        area,
                        eData.speed,
                        "",
                        true
                    ));
                }
            }
        }
        area.enemies = enemies;
        areas.push(area);
        currentArea++;
    }
    level.areas = areas;
    return level;
}

module.exports = {

    build: () => {
        console.log(`Building maps.`);
        const start = new Date();
        
        const maps = {};
        for (const file of fileNames) {
            const data = require(`../../maps/${file}`);
            maps[data.name] = buildMap(data);
        }

        const time = Math.abs((new Date().getTime() - start.getTime()) / 1000);
        console.log(`Built ${fileNames.length} map(s) in ${time}s`);
        return maps;
    }

};
