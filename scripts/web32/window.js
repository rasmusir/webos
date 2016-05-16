"use strict";

web32.Window = class Window extends web32.Module
{
    constructor()
    {
        super();
        this.createHost();
        this.elements = new Map();
    }

    onHost()
    {
        let template = document.querySelector("#window");
        let win = document.importNode(template.content, true).firstElementChild;
        document.body.appendChild(win);
        this._window = win;
        this.element = win.querySelector(".content");

        this.h_setTitle(this.id);
    }

    h_setTitle(title)
    {
        let t = this._window.querySelector(".title");
        t.innerHTML = "";
        t.appendChild(document.createTextNode(title));
    }

    addElement(element)
    {
        this.elements.set(element.id, element);
    }

    setPosition(x, y) { this.host("setPosition", x, y); }
    h_setPosition(x, y)
    {
        this._window.style.left = x + "px";
        this._window.style.top = y + "px";
    }

    createElement(type, properties)
    {
        let element = new web32.Element(this, type, properties);
        this.addElement(element);
        return element;
    }
};


web32.Module.register(web32.Window);
