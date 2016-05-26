"use strict";
importScripts("web32");

let username;

function *main()
{
    let sync = yield;
    let window = new web32.Window();

    window.on("close", close);

    let container = window.createElement("div");
    container.set("style", "textAlign", "center");
    container.set("innerHTML", "<b>Welcome to WebOS!</b><br>What's your name?<br>");

    username = (yield web32.Interface.getRegistryEntry("USERDATA/username", sync)) || "";

    let input = container.createElement("input");
    input.set("value", username);
    input.set("style", "display", "block");
    input.set("style", "width", "100%");
    input.on("change", (name) => {
        username = name;
    }, (event) => {
        return event.target.value;
    });

    let button = container.createElement("button");
    button.set("innerHTML", "Go!");
    button.on("click", go);
    button.set("style", "margin", "10px");

    window.show();
}

function go()
{
    if (username.trim().length >= 2)
    {
        web32.Interface.setRegistryEntry("USERDATA/username", username);
        web32.Interface.launch("system.taskbar");
        close();
    }
}
