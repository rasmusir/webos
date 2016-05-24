"use strict";
importScripts("/web32.js");

function *main()
{
    let sync = yield;
    let window = new web32.Window();
    window.on("close", close);

    window.setTitle("Settings");

    let shells = yield web32.Interface.getShells(sync);

    for (let shell in shells)
    {
        let b = window.createElement("button");
        b.set("innerHTML", shell);
        b.on("click", () => {
            web32.Interface.setShell(shell);
        });
    }

    window.show();
}
