function game(hero) {

    document.getElementById("login").remove();
    const canvas = new EvadesCanvas();
    canvas.apply();

    let myData = {};
    let oldLevelData = {};
    let newLevelData = {};
    let cooldownData = {};
    let levelCosmetic = {};

    let timesUpdated = 0;
    socket.on("gameUpdate", (md, ld, cd, ld2) => {
        timesUpdated++;
        if (timesUpdated === 2) {
            beginKeySending();
            startGameLoop();
        }
        myData = notepack.decode(md);
        oldLevelData = newLevelData;
        newLevelData = notepack.decode(ld);
        cooldownData = notepack.decode(cd);
        levelCosmetic = notepack.decode(ld2);
    });

    function startGameLoop() {
        const cw = canvas.canvas.width;
        const ch = canvas.canvas.height;

        canvas.clear();
        canvas.box(0, 0, canvas.canvas.width, canvas.canvas.height, "gray", false);
        canvas.centerOnPosition(myData);

        canvas.box(0, 0, newLevelData.w, newLevelData.h, levelCosmetic.l, false);
        canvas.box(0, 0, 200, newLevelData.h, "green", false);
        canvas.box(newLevelData.w - 200, 0, 200, newLevelData.h, "green", false);

        if (newLevelData.wh === 0) {
            canvas.box(0, 0, 200, 50, "yellow", false);
            canvas.box(0, newLevelData.h - 50, 200, 50, "yellow", false);
        } else {
            canvas.box(0, 0, 50, newLevelData.h, "yellow", false);
        }
        canvas.box(newLevelData.w - 50, 0, 50, newLevelData.h, "yellow", false);
    
        for (const entity of newLevelData.e) {
            canvas.circle(entity.x, entity.y, entity.r, entity.c, entity.o);
            if (entity.t === "") continue;
            canvas.text(entity.t, entity.x, entity.y - 19, "black", true, "Raleway", "15px");
        }

        canvas.restore();

        canvas.box(cw - 150, ch - 300, 150, 300, "rgba(220,220,220,0.5)", false);
        canvas.box(cw -  ch - 200, 50, 50, "rgba(0,0,0,0.5)", false);

        canvas.text(levelCosmetic.n, (cw / 2), 45, levelCosmetic.t, true, "Raleway", "45px", true, levelCosmetic.l, 2);

        requestAnimationFrame(startGameLoop);
    }

    function beginKeySending() {
        const keys = {};
        window.addEventListener("keydown", (key) => {
            key = key.key.toLowerCase();
            keys[key] = true;
            socket.emit("keys", notepack.encode(keys));
        });
        window.addEventListener("keyup", (key) => {
            key = key.key.toLowerCase();
            delete keys[key];
            socket.emit("keys", notepack.encode(keys));
        });
    }

}