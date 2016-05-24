"use strict";
importScripts("/web32.js");

function *main()
{
    let window = new web32.Window();
    window.on("close", () => close());

    let iframe = window.createElement("iframe");
    iframe.setAttribute("referrerpolicy", "no-referrer");
    iframe.setAttribute("src", "http://lnu.se");
    iframe.set("style", "width", "100%");
    iframe.set("style", "height", "100%");

    window.setSize(800, 600);

    window.show();
}
