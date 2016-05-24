"use strict";
importScripts("/web32.js");

function *main()
{
    let sync = yield;
    let area = new web32.Area();

    area.set("className", "taskbar");

    let button = area.createElement("button");
    button.set("innerHTML", "Start");
    button.set("className", "start");

    button.on("click", () => web32.Interface.launch("system.appdrawer"));

    let clock = area.createElement("div");
    clock.set("className", "clock");

    clockTick(clock);

    let apps = new Map();

    web32.Interface.listen("window_create", (other, data) => {
        let appbutton = area.createElement("button", {
            className : "instance",
            innerHTML : data.title
        });
        appbutton.set("className", "instance");
        appbutton.set("innerHTML", data.title);
        apps.set(data.id, appbutton);

        appbutton.on("click", () => {
            web32.Interface.tell(other, "focus_" + data.id, {});
        });
    });

    web32.Interface.listen("window_destroy", (other, data) => {
        let app = apps.get(data.id);
        app.destroy();
    });
}

function clockTick(clock)
{
    let time = new Date();

    setTimeout(() => clockTick(clock), 1000 - time.getMilliseconds());
    clock.set("innerHTML", `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
}
