"use strict";
importScripts("/web32.js");

let messages;
let channel;
let username;

function *main()
{
    let sync = yield;
    let apikey = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    let socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");

    username = yield web32.Interface.getRegistryEntry("USERDATA/username", sync);
    channel = (yield web32.Interface.getAppData("currentChannel", sync)) || "all";

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

    let channelElement = container.createElement("input");
    channelElement.set("id", channelElement.id);
    channelElement.set("value", channel);

    channelElement.on("change", (data) => {
        web32.Interface.setAppData("currentChannel", data);
        channel = data;
    }, (event) => {
        return event.target.value;
    });

    messages = container.createElement("div");
    messages.set("className", "container");
    messages.set("style", "flexGrow", "1");

    let input = container.createElement("input");
    input.on("keydown", (data) => {
        if (data)
        {
            socket.send(JSON.stringify({
                "type" : "message",
                "data" : data,
                "username" : username,
                "channel" : channel,
                "key" : apikey
            }));
            input.set("value", "");
        }
    }, (event) => {
        if (event.keyCode === 13)
        {
            return event.target.value;
        }
    });

    window.show();
    input.focus();
}

function handleData(data)
{
    if (data.type !== "heartbeat" && (channel === "all" || data.channel === channel || (!data.channel)))
    {
        let div = messages.createElement("div");
        div.set("innerHTML", `${data.username}: ${data.data}`);
    }
}
