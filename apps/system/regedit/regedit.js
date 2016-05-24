"use strict";
importScripts("/web32.js");

function *main()
{
    let sync = yield;

    let window = new web32.Window("Registry Editor");

    let apps = yield web32.Interface.getRegistryEntry("ROOT", sync);
    console.log(apps);

    let tree = window.createTreeView(apps);

    window.setSize(400, 600);

    window.show();
    window.on("close", () => close());
}
