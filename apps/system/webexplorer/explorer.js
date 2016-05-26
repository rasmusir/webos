"use strict";
importScripts("/web32.js");

function *main(url)
{
    let window = new web32.Window();
    window.on("close", () => close());


    let container = window.createElement("div");
    container.set("style", "display", "flex");
    container.set("style", "flexDirection", "column");
    container.set("style", "height", "100%");

    let iframe = container.createElement("iframe");

    iframe.setAttribute("referrerpolicy", "no-referrer");
    iframe.setAttribute("src", url || "http://lnu.se");
    iframe.set("style", "flexGrow", "1");

    window.setSize(800, 600);

    window.show();
}
