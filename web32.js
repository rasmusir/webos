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

if (typeof (WorkerGlobalScope) !== "undefined")
{
    importScripts("/scripts/web32/module.js", "/scripts/web32/interface.js", "/scripts/web32/element.js", "/scripts/web32/window.js");

    self._close = self.close;
    self.close = function close(data) {
        self.postMessage({action: "terminate", data: data});
        self._close();
    };

    web32.Interface = {
        objects: new Map(),
        get: function (id) { return web32.Interface.objects.get(id); },
        set: function (id, object) { return web32.Interface.objects.set(id, object); },
        execute: function (object, func, args) { object["c_" + func](...args); },
        delete: function (id) { web32.Interface.objects.delete(id); }
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
                let r = func.next();
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
