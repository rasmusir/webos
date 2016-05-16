"use strict";

web32.Window = class Window extends web32.Module
{
    constructor()
    {
        super();
        this.createHost();
    }

    onHost()
    {
        let template = document.querySelector("#window");
        let win = document.importNode(template.content, true).firstElementChild;
        document.body.appendChild(win);
        this._div = win;
    }

    h_setPosition(x, y)
    {
        this._div.style.left = x + "px";
        this._div.style.top = y + "px";
    }

    setPosition(x, y)
    {
        this.host("setPosition", x, y);
    }
};

web32.Module.register(web32.Window);
