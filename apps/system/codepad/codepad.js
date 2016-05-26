"use strict";
importScripts("web32");

function *main()
{
    let sync = yield;
    let window = new web32.Window("Codepad");
    window.on("close", close);
    window.setSize(600, 400);

    /*
    let tabs = window.createTabHolder();
    let tab = tabs.createTab();
    */
   
    let editor = window.createEditor();
    editor.set("style", "height", "100%");

    window.show();
}
