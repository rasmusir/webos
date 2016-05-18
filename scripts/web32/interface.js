"use strict";

web32.Interface = class Interface
{
    constructor(worker, app)
    {
        this.modules = new Map();
        this.objects = new Map();
        if (worker && (typeof (WorkerGlobalScope) === "undefined"))
        {
            this.worker = worker;
            this.app = app;
            this.attach();
        }
    }

    attach()
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
        };

        this.worker.postMessage({action: "start", app: this.app});
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
};
