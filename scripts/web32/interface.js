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
        };

        this.worker.postMessage({action: "start", app: this.app});
    }

    createModule(data)
    {
        if (typeof (WorkerGlobalScope) !== "undefined")
        {
            let module = data;
            postMessage({action: "create", module: module.name, id: module.id});
        }
        else
        {
            let ModuleType = web32.Module.get(data.name);
            let module = new ModuleType();
            module._id = data.id;

            this.objects.set(module.id, module);
            module.onHost();
        }
    }
};
