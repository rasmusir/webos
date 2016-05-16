"use strict";

web32.Window = class Window extends web32.Module
{
    constructor()
    {
        super();
        this.createHost();
    }

    onHost(id)
    {
        let template = document.querySelector("#window");
        let win = document.importNode(template.content, true).firstElementChild;
        document.body.appendChild(win);
        this._window = win;


        this.h_setTitle(this.id);
    }

    h_setPosition(x, y)
    {
        this._window.style.left = x + "px";
        this._window.style.top = y + "px";
    }

    h_setTitle(title)
    {
        let t = this._window.querySelector(".title");
        t.innerHTML = "";
        t.appendChild(document.createTextNode(title));
    }

    setPosition(x, y)
    {
        this.host("setPosition", x, y);
    }
};

web32.Module.register(web32.Window);
