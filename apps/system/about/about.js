"use strict";
importScripts("/web32.js");

function *main()
{
    let sync = yield;
    let window = new web32.Window();
    window.setPosition(100, 100);

    window.on("close", close);

    let container = window.createElement("div");
    container.set("style", "text-align", "center");

    let text = container.createElement("div");
    text.set("innerHTML", `WebOS is created by Rasmus Israelsson<br>You can find the github <a target="_blank" href="https://github.com/rasmusir/webos">Here</a><br><br>`);

    let button = container.createElement("button");
    button.set("innerHTML", "Close");

    button.on("click", close);

    window.show();
}
