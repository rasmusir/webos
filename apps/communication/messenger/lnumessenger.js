"use strict";
importScripts("/web32.js");

let messages;

function *main()
{
    let sync = yield;
    let apikey = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    let socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");

    socket.onopen = event => {
        console.log("Connected to server!");
    };

    socket.onmessage = event => {
        handleData(JSON.parse(event.data));
    };

    let window = new web32.Window("LNU Messenger");
    window.on("close", close);
    window.setSize(300, 400);
    let container = window.createElement("div");
    container.set("style", "display", "flex");
    container.set("style", "flexDirection", "column");
    container.set("style", "height", "100%");
    messages = container.createElement("div");
    messages.set("className", "container");
    messages.set("style", "flexGrow", "1");

    let input = container.createElement("input");


    window.show();
}

function handleData(data)
{
    if (data.type !== "heartbeat")
    {
        let div = messages.createElement("div");
        div.set("innerHTML", data.data);
    }
}
