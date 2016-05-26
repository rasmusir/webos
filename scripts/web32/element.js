"use strict";

web32.Element = class Element extends web32.Module
{
    constructor(parent, type, properties)
    {
        super();
        this._properties = new Map();
        this._events = new Map();
        this.elements = new Map();

        if (parent)
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

        if (type)
        {
            this.element = document.createElement(this.type);
            this.parent.element.appendChild(this.element);
        }

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

    on(event, callback, hostside)
    {
        let hostfunc = null;
        if (hostside)
        {
            hostfunc = hostside.toString();
        }
        this._events.set(event, callback);
        this.host("on", event, hostfunc);
    }

    h_on(event, func)
    {
        this.element.addEventListener(event, e => {
            let data = null;
            if (func)
            {
                let f = eval(func);
                data = f(e);
            }
            this.client("on", event, data);
        });
    }

    c_on(event, data)
    {
        let callback = this._events.get(event);
        if (callback)
        {
            callback(data);
        }
    }

    focus()
    {
        this.host("focus");
    }

    h_focus()
    {
        this.element.focus();
    }

    set(...args)
    {
        this.host("setProperty", args);
    }

    setAttribute(attr, value)
    {
        this.host("setAttribute", attr, value);
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

    h_setAttribute(attr, value)
    {
        this.element.setAttribute(attr, value);
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

web32.Module.register(web32.Element);
