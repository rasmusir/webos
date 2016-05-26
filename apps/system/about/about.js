"use strict";
importScripts("web32");

function *main()
{
    let sync = yield;
    let window = new web32.Window();

    window.on("close", close);

    let container = window.createElement("div");
    container.set("style", "text-align", "center");

    let text = container.createElement("div");
    text.set("innerHTML", `WebOS is created by Rasmus Israelsson<br>You can find the github <a target="_blank" href="https://github.com/rasmusir/webos">Here</a><br>He's a student at <a target="_blank" href="https://lnu.se/">Linneaus University</a><br> <br>`);
    text.on("click", (data) => {
        if (data)
        {
            web32.Interface.launch("system.explorer", data.url);
        }
    }, (event) => {
        if (event.target.tagName === "A")
        {
            event.preventDefault();
            return {url: event.target.href};
        }
    });

    let button = container.createElement("button");
    button.set("innerHTML", "Close");

    button.on("click", close);

    window.show();
}
