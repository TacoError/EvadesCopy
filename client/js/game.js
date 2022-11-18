function game(hero) {
    document.getElementById("login").remove();
    const canvas = new EvadesCanvas();
    canvas.apply();

    socket.on("dead", () => {
        document.open();
        document.write(`<h1 style="text-align: center;">You have died!</h1>`);
        document.close();
    });

    let myData = {};
    let oldLevelData = {};
    let newLevelData = {};
    let cooldownData = {};
    let levelCosmetic = {};
    let chats = [];

    socket.on("chatUpdate", (chat) => {
        console.log(chat)
        if (chats.length > 9) {
            chats.shift();
        }
        chats.push(chat);
        let text = "";
        for (const chat of chats) {
            text += chat + "<br>";
        }
        document.getElementById("chatBox").innerHTML = text;
    });

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
        console.log(cooldownData)
    });

    function drawHeroCard() {
        const cw = canvas.canvas.width;
        const ch = canvas.canvas.height;
        const mouse = canvas.getMousePos();
        if (hero.power1 !== null) {
            canvas.box(cw - 75, ch - 75, 50, 50, hero.heroColor, true);
            canvas.text(cooldownData.one.toFixed(1), cw - 50, ch - 50, "white", true, "Raleway", "12px", false);
            if (
                mouse.x > (cw - 75) && mouse.x < ((cw - 75) + 50) &&
                mouse.y > (ch - 75) && mouse.y < ((ch - 75) + 50)
            ) {
                canvas.text(hero.power1.d, (cw - (75 + (75 / 2))), ch - 100, "white", true, "Raleway", "12px", false, "black", 2);
            }
        }
        if (hero.power2 !== null) {
            canvas.box(cw - 150, ch - 75, 50, 50, hero.heroColor, true);
            canvas.text(cooldownData.two.toFixed(1), cw - 125, ch - 50, "white", true, "Raleway", "12px", false);
            if (
                mouse.x > (cw - 150) && mouse.x < ((cw - 150) + 50) &&
                mouse.y > (ch - 75) && mouse.y < ((ch - 75) + 50)
            ) {
                canvas.text(hero.power2.d, (cw - (75 + (75 / 2))), ch - 100, "white", true, "Raleway", "12px", false, "black", 2);
            }
        }
    }

    function startGameLoop() {
        const cw = canvas.canvas.width;
        const ch = canvas.canvas.height;
        
        const entities = newLevelData.e;

        canvas.clear();
        canvas.box(0, 0, canvas.canvas.width, canvas.canvas.height, "#4C4E52", false);
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
    
        for (const entity of entities) {
            canvas.circle(entity.x, entity.y, entity.r, entity.c, entity.o);
            if (entity.t === "") continue;
            canvas.text(entity.t, entity.x, entity.y - 19, "black", true, "Raleway", "15px");
        }

        canvas.restore();

        if (newLevelData.p > 0) {
            canvas.text(levelCosmetic.n + " Area: " + newLevelData.wh + "<br>" + newLevelData.p + " Points Awarded!", (cw / 2), 45, levelCosmetic.t, true, "Raleway", "45px", true, levelCosmetic.l, 2);
        } else {
            canvas.text(levelCosmetic.n + " Area: " + newLevelData.wh, (cw / 2), 45, levelCosmetic.t, true, "Raleway", "45px", true, levelCosmetic.l, 2);
        }

        drawHeroCard();

        requestAnimationFrame(startGameLoop);
    }

    document.getElementById("chatText").addEventListener("keydown", (key) => {
        key = key.key.toLowerCase();
        if (key === "enter") {
            const text = document.getElementById("chatText").value;
            socket.emit("chat", text);
            document.getElementById("chatText").value = "";
            return;
        }
    });

    function beginKeySending() {
        const keys = {};
        window.addEventListener("keydown", (key) => {
            key = key.key.toLowerCase();
            if (key === "enter") {
                document.getElementById("chatText").focus();
                return;
            }
            keys[key] = true;
            if (document.activeElement && document.activeElement.tagName.toLowerCase() === "input") return;
            socket.emit("keys", notepack.encode(keys));
        });
        window.addEventListener("keyup", (key) => {
            key = key.key.toLowerCase();
            delete keys[key];
            if (document.activeElement && document.activeElement.tagName.toLowerCase() === "input") return;
            socket.emit("keys", notepack.encode(keys));
        });
    }

}