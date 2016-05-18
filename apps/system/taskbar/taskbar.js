"use strict";
importScripts("/web32.js");

function *main()
{
    let sync = yield;
    let area = new web32.Area();

    area.set("className", "taskbar");

    let button = area.createElement("button");
    button.set("innerHTML", "About");

    button.on("click", () => web32.Interface.launch("system.about"));
}
