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

    self.addEventListener("message", message => {
        if (typeof (main) !== "undefined")
        {
            console.log = console.log.bind(console, message.data.app.fingerprint + ":");
            main();
        }
        else {
            console.error("No main funciton found");
            stop();
        }
    });
}
