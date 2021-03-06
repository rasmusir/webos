"use strict";

web32.Module = class Module
{
    constructor()
    {
        if (typeof (WorkerGlobalScope) !== "undefined")
        {
            this._id = web32.id();
            this.isHost = false;
            web32.Interface.set(this._id, this);
        }
        else
        {
            this._id = "";
            this.isHost = true;
        }
    }

    get id()
    {
        return this._id;
    }

    onHost(i)
    {
        this.interface = i;
    }

    hostDestroy()
    {

    }

    createHost(...args)
    {
        if (!this.isHost)
        {
            self.postMessage({action: "create", name: this.constructor.name, id: this.id, args: args});
        }
    }

    host(func, ...args)
    {
        if (!this.isHost)
        {
            self.postMessage({action: "execute", id: this.id, function: func, args: args});
        }
    }

    client(func, ...args)
    {
        if (this.isHost)
        {
            this.interface.postMessage({action: "execute", id: this.id, function: func, args: args});
        }
    }

    destroy()
    {
        self.postMessage({action: "destroymodule", id: this.id});
        web32.Interface.delete(this.id);
    }

    static register(module)
    {
        module.id = web32.hashString(module.name);
        web32.Module.__modules.set(module.name, module);
    }

    static get(name)
    {
        return web32.Module.__modules.get(name);
    }
};

web32.Module.__modules = new Map();
