"use strict";
importScripts("/web32.js");

function *main()
{
    let sync = yield;
    let area = new web32.Area();
    area.set("className", "appdrawer");
    
    let app = area.createElement("div");
    app.set("className", "app");
    app.set("innerHTML", "About");
    app.on("click", () => {
       web32.Interface.launch("system.about");
       close();
    });
}