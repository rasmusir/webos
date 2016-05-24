"use strict";
let web32 = {
    id: function generateID()
    {
        return 'xxxxxx'.replace(/[x]/g, c => {
            let r = Math.random() * 36|0, v = r;
            return v.toString(36);
        });
    },
    hashString: function hashString(s) {
        // Source http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
        let hash = 0, i, chr, len;
        if (s.length === 0) { return hash; }
        for (i = 0, len = s.length; i < len; i++) {
            chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
};

console.log(web32);

if (typeof (WorkerGlobalScope) !== "undefined")
{
    importScripts("/scripts/web32/module.js", "/scripts/web32/interface.js", "/scripts/web32/element.js", "/scripts/web32/window.js", "/scripts/web32/area.js", "/scripts/web32/treeview.js");

    self._close = self.close;
    self.close = function close(data) {
        self.postMessage({action: "terminate", data: data});
        self._close();
    };

    let listeners = new Map();



    web32.Interface = {
        objects: new Map(),
        listeners: new Map(),
        get: function (id) { return web32.Interface.objects.get(id); },
        set: function (id, object) { return web32.Interface.objects.set(id, object); },
        execute: function (object, func, args) { object["c_" + func](...args); },
        delete: function (id) { web32.Interface.objects.delete(id); },
        launch: function (fingerprint) { self.postMessage({action: "launch", fingerprint: fingerprint}); },
        listen: function (message, callback) {
            web32.Interface.listeners.set(message, callback);
            self.postMessage({action: "listen", message: message});
        },
        getMessage: function (action, callback)
        {
            let listener = listeners.get(action);
            if (Array.isArray(listener))
            {
                listener.push(callback);
            }
            else
            {
                listeners.set(action, [callback]);
            }
        },
        triggerMessage: function (action, data)
        {
            let listener = listeners.get(action);
            if (listener)
            {
                let callback = listener.shift();
                callback(data);
            }
        },
        tell: function (id, message, data)
        {
            self.postMessage({action: "tell", id: id, message: message, data: data});
        },
        getRegistryEntry: function (path, callback)
        {
            this.getMessage("registry_get", (data) => {
                callback(data.value);
            });
            self.postMessage({action: "registry_get", path: path});
        },
        getShells: function (callback)
        {
            this.getMessage("shells_get", (data) => {
                callback(data.shells);
            });
            self.postMessage({action: "shells_get"});
        },
        setShell: function (shellid, callback)
        {
            self.postMessage({action: "shell_set", shell: shellid});
        }
    };

    self.addEventListener("message", message => {
        if (message.data.action === "start")
        {
            if (typeof (main) !== "undefined")
            {
                console.log = console.log.bind(console, message.data.app.fingerprint + ":");
                sync(main());
            }
            else
            {
                console.error("No main funciton found");
                self.close();
            }
        }
        else if (message.data.action === "execute")
        {
            let object = web32.Interface.get(message.data.id);
            web32.Interface.execute(object, message.data.function, message.data.args);
        }
        else if (message.data.action === "tell")
        {
            let callback = web32.Interface.listeners.get(message.data.message);
            if (callback)
            {
                callback(message.data.other, message.data.data);
            }
        }
        else
        {
            web32.Interface.triggerMessage(message.data.action, message.data);
        }
    });
}

let __dummy = (function *() { yield; })();

function sync(func, parent)
{
    /*
    Usage:
        function *runner()
        {
            let data = yield sync(async(arguments));
            //runner will wait until async has returned it's data
        }

        function *async(arguments)
        {
            let sync = yield;
            //do async stuff
            //when done, call sync(data);
        }
     */
    //Start the generatorFunction
    func.next();
    //Prepare a scope for the generatorFunction
    func.sync = function (innerf) {
        //If scoped sync is called with another generatorFunction, start the function and create a new scope for it.
        if (innerf && innerf.__proto__.constructor === __dummy.__proto__.constructor)
        {
            sync(innerf, func);
        }
        else
        {
            try {
                let r = func.next(innerf);
                if (r.done && parent)
                {
                    let pr = parent.next(innerf);
                    if (pr.done)
                    {
                        setTimeout(() => parent.sync(r.value), 0);
                    }
                }
            }
            catch (e)
            {
                parent.next(innerf);
            }
        }
    };
    // Pass yield scope to the generatorfunciton
    func.next(func.sync);
}
