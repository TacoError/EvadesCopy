let loaded = false;

let hero = {};
socket.on("init", (data) => {
    hero = notepack.decode(data);
});

socket.on("response", (response) => {
    if (response === "inGame") {
        game(hero);
        return;
    }
    document.getElementById("response").innerHTML = response;
});

socket.on("heroes", (list) => {
    for (const hero of list) {
        const newOpt = document.createElement("option");
        newOpt.text = hero;
        document.getElementById("heroes").append(newOpt);
    }
    document.getElementById("overlay").remove();
    loaded = true;
});

function register() {
    if (!loaded) return;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    socket.emit("register", username, password);
}

function login() {
    if (!loaded) return;
    const heroes = document.getElementById("heroes");
    const hero = heroes.options[heroes.selectedIndex].text;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    socket.emit("login", username, password, hero)
}