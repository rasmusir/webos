"use strict";

web32.Interface = class Interface
{
    constructor(system, worker, app, args)
    {
        this.modules = new Map();
        this.objects = new Map();
        this.system = system;
        this._listeners = new Map();
        this.id = web32.id();
        if (worker && (typeof (WorkerGlobalScope) === "undefined"))
        {
            this.worker = worker;
            this.app = app;
            this.attach(args);
        }
    }

    attach(args)
    {
        this.worker.onmessage = message => {
            let data = message.data;
            if (data.action === "create")
            {
                this.createModule(data);
            }
            else if (data.action === "execute")
            {
                let object = this.objects.get(data.id);
                object["h_" + data.function](...data.args);
            }
            else if (data.action === "destroymodule")
            {
                this.destroyModule(data.id);
            }
            else if (data.action === "terminate")
            {
                console.log("App terminated");
                this.objects.forEach(o => o.hostDestroy());
                this.object = null;
            }
            else if (data.action === "launch")
            {
                this.system.run(data.fingerprint, data.args);
            }
            else if (data.action === "listen")
            {
                this.listen(data.message, (other, data2) => {
                    this.worker.postMessage({action: "tell", id: other.id, message: data.message, data: data2, other: other.id});
                });
            }
            else if (data.action === "tell")
            {
                this.system.tell(this, data.id, data.message, data.data);
            }
            else if (data.action === "registry_get")
            {
                let value = this.system.getRegistryEntry(data.path);
                this.worker.postMessage({action: "registry_get", value: value});
            }
            else if (data.action === "registry_set")
            {
                this.system.setRegistryEntry(data.path, data.value);
            }
            else if (data.action === "shells_get")
            {
                let shells = this.system.getRegistryEntry("SYSTEM/SHELLS");
                this.worker.postMessage({action: "shells_get", shells: shells});
            }
            else if (data.action === "shell_set")
            {
                this.system.setShell(data.shell);
            }
        };

        this.worker.postMessage({action: "start", app: this.app, baseurl: this.system._url, args: args});
    }

    postMessage(data)
    {
        this.worker.postMessage(data);
    }

    createModule(data)
    {

        let ModuleType = web32.Module.get(data.name);
        let module = new ModuleType();
        module._id = data.id;

        this.objects.set(module.id, module);
        module.onHost(this, ...data.args);
    }

    destroyModule(id)
    {
        let m = this.getModule(id);
        m.hostDestroy();
        this.objects.delete(id);
    }

    getModule(id)
    {
        return this.objects.get(id);
    }

    tell(other, message, data)
    {
        let callback = this._listeners.get(message);
        if (callback)
        {
            callback(other, data);
        }
    }

    listen(message, callback)
    {
        this._listeners.set(message, callback);
    }
};
