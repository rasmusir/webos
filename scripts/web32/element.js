"use strict";

web32.Element = class Element extends web32.Module
{
    constructor(parent, type, properties)
    {
        super();
        this._properties = new Map();
        this._events = new Map();

        if (parent && type)
        {
            this.init(parent, type, properties);
        }
    }

    init(parent, type, properties)
    {
        this.createHost(parent.id, type, properties);
        this.parent = parent;
        this.type = type;
    }

    onHost(i, parentid, type, properties)
    {
        super.onHost(i);
        let parent = i.getModule(parentid);
        this.init(parent, type, properties);

        this.element = document.createElement(this.type);
        this.parent.element.appendChild(this.element);

        this.parent.addElement(this);
    }

    hostDestroy()
    {
        this.element.parentNode.removeChild(this.element);
    }

    destroy()
    {
        super.destroy();
        this.parent.elements.delete(this.id);
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
};

web32.Module.register(web32.Element);
