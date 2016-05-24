"use strict";

web32.Area = class Area extends web32.Module
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
        this.element = document.createElement("div");
        document.body.appendChild(this.element);
        this.element.setAttribute("tabindex", 0);
        this.element.focus();
    }

    hostDestroy()
    {
        this.element.parentNode.removeChild(this.element);
    }

    on(event, callback)
    {
        this._events.set(event, callback);
        this.host("on", event);
    }

    h_on(event)
    {
        this.element.addEventListener(event, e => {
            this.client("on", event);
        });
    }

    c_on(event)
    {
        let callback = this._events.get(event);
        if (callback)
        {
            callback();
        }
    }

    set(...args)
    {
        this.host("setProperty", args);
    }

    h_setProperty(args)
    {
        let value = args[args.length - 1];
        let name = args[0];
        let obj = this.element;
        for (let i = 1; i < args.length - 1; i++)
        {
            obj = obj[name];
            name = args[i];
        }
        obj[name] = value;
    }

    addElement(element)
    {
        this.elements.set(element.id, element);
    }

    createElement(type, properties)
    {
        let element = new web32.Element(this, type, properties);
        this.addElement(element);
        return element;
    }
};


web32.Module.register(web32.Area);
