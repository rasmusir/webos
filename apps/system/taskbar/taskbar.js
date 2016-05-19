"use strict";
importScripts("/web32.js");

function *main()
{
    let sync = yield;
    let area = new web32.Area();

    area.set("className", "taskbar");

    let button = area.createElement("button");
    button.set("innerHTML", "Start");

    button.on("click", () => web32.Interface.launch("system.appdrawer"));
    
    let clock = area.createElement("div");
    clock.set("className", "clock");
    
    clockTick(clock);
}

function clockTick(clock)
{
    let time = new Date();
    
    setTimeout(() => clockTick(clock), 1000 - time.getMilliseconds());
    clock.set("innerHTML", `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
}
