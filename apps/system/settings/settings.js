"use strict";
importScripts("/web32.js");

function *main()
{
    let sync = yield;
    let window = new web32.Window();
    window.on("close", close);

    window.setTitle("Settings");

    let shells = yield web32.Interface.getShells(sync);
    let currentShell = yield web32.Interface.getRegistryEntry("SYSTEM/CURRENT_SHELL", sync);

    let options = [];

    for (let shell in shells)
    {
        options.push({text: shell, value: shell, selected: shell === currentShell});
    }

    let select = window.createSelect(options);

    select.on("change", o => {
        web32.Interface.setShell(o);
    });

    window.show();
}
