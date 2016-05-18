"use strict";

web32.Window = class Window extends web32.Module
{
    constructor()
    {
        super();
        this.createHost();
        this.elements = new Map();
        this._events = new Map();
    }

    onHost(i)
    {
        super.onHost(i);
        let template = document.querySelector("#window");
        let win = document.importNode(template.content, true).firstElementChild;
        win.style.visibility = "hidden";
        document.body.appendChild(win);
        this._window = win;
        this._titlebar = win.querySelector(".titlebar");
        this._close = win.querySelector(".close");
        this.element = win.querySelector(".content");

        this._drag = {};
        this._titlebar.onmousedown = e => this.hostStartMove(e);

        this.h_setTitle(this.id);
    }

    hostDestroy()
    {
        this._window.parentNode.removeChild(this._window);
    }

    hostStartMove(e)
    {
        this._drag = {x: this._window.offsetLeft - e.clientX, y: this._window.offsetTop - e.clientY};
        let move = e => this.hostMove(e);
        let stop = e => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", stop);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", stop);
    }

    hostMove(e)
    {
        let posx = Math.max(e.clientX + this._drag.x, 0);
        let posy = Math.max(e.clientY + this._drag.y, 0);
        this._window.style.left = Math.min(posx, window.innerWidth - this._window.offsetWidth - 0.5) + "px";
        this._window.style.top = Math.min(posy, window.innerHeight - this._window.offsetHeight - 0.5) + "px";
    }

    h_setTitle(title)
    {
        let t = this._window.querySelector(".title");
        t.innerHTML = "";
        t.appendChild(document.createTextNode(title));
    }

    show()
    {
        this.host("show");
    }

    h_show()
    {
        this._window.style.visibility = "visible";
    }

    on(event, callback)
    {
        this._events.set(event, callback);
        this.host("on", event);
    }

    h_on(event)
    {
        if (event === "close")
        {
            this._close.addEventListener("click", e => {
                this.client("on", "close");
            });
        }
        else
        {
            this.element.addEventListener(event, e => {
                this.client("on", event);
            });
        }
    }

    c_on(event)
    {
        let callback = this._events.get(event);
        if (callback)
        {
            callback();
        }
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
