"use strict";

web32.Window = class Window extends web32.Module
{
    constructor(title)
    {
        super();
        this.title = title;
        this.createHost(title);
        this.elements = new Map();
        this._events = new Map();
        this._position = { x: web32.Window._CURRENTPOS.x, y: web32.Window._CURRENTPOS.y};
        web32.Window._CURRENTPOS.x += 20;
        web32.Window._CURRENTPOS.y += 20;
    }

    get position()
    {
        return {x: this._position.x, y: this._position.y};
    }

    onHost(i, title)
    {
        super.onHost(i);
        let template = document.querySelector("#window");
        let win = document.importNode(template.content, true).firstElementChild;
        win.style.visibility = "hidden";
        document.body.appendChild(win);
        this._window = win;
        this._titlebar = win.querySelector(".titlebar");
        this._minimize = win.querySelector(".minimize");
        this._close = win.querySelector(".close");
        this.element = win.querySelector(".content");

        this._minimize.onclick = () => this.h_hide();

        this._window.style.zIndex = ++web32.Window._CURRENTTOP;

        this._drag = {};
        this._titlebar.onmousedown = e => this.hostStartMove(e);
        this._window.onmousedown = () => { this._window.style.zIndex = ++web32.Window._CURRENTTOP; };

        this._taskbar = i.system.getProcesses("system.taskbar")[0];

        i.listen("focus_" + this.id, () => { this.h_show(); this._window.style.zIndex = ++web32.Window._CURRENTTOP; });
        i.listen("minimize_" + this.id, () => this.h_hide() );

        this.h_setTitle(title || this.id);
        this.h_setPosition(this._position.x, this._position.y);

        if (this._taskbar)
        {
            this._taskbar.tell(i, "window_create", {id: this.id, title: this.title});
        }
    }

    hostDestroy()
    {
        this._window.parentNode.removeChild(this._window);
        if (this._taskbar)
        {
            this._taskbar.tell(this.interface, "window_destroy", {id: this.id, name: this.title});
        }
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

    setTitle(title)
    {
        this.title = title;
        this.host("setTitle", title);
    }

    h_setTitle(title)
    {
        let t = this._window.querySelector(".title");
        t.innerHTML = "";
        this.title = title;
        t.appendChild(document.createTextNode(title));
    }

    show()
    {
        this.host("show");
    }

    h_show()
    {
        this._window.style.visibility = "visible";
        this._window.classList.remove("hidden");
    }

    hide()
    {
        this.host("hide");
    }

    h_hide()
    {
        this._window.style.visibility = "hidden";
        this._window.classList.add("hidden");
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

    setPosition(x, y) {
        this._position.x = x;
        this._position.y = y;
        this.host("setPosition", x, y);
    }
    h_setPosition(x, y)
    {
        this._position.x = x;
        this._position.y = y;
        this._window.style.left = x + "px";
        this._window.style.top = y + "px";
    }

    setSize(width, height) {
        this.host("setSize", width, height);
    }
    h_setSize(width, height)
    {
        this._window.style.width = width + "px";
        this._window.style.height = height + "px";
    }

    createElement(type, properties)
    {
        let element = new web32.Element(this, type, properties);
        this.addElement(element);
        return element;
    }

    createTreeView(data)
    {
        let element = new web32.TreeView(this, data);
        this.addElement(element);
        return element;
    }

    createSelect(data)
    {
        let element = new web32.Select(this, data);
        this.addElement(element);
        return element;
    }

    createEditor(data)
    {
        let element = new web32.Editor(this, data);
        this.addElement(element);
        return element;
    }

    createTabHolder(data)
    {
        let element = new web32.TabHolder(this, data);
        this.addElement(element);
        return element;
    }
};

web32.Window._CURRENTTOP = 0;
web32.Window._CURRENTPOS = {x: 200, y: 200};


web32.Module.register(web32.Window);
