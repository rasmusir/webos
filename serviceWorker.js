"use strict";


self.addEventListener("fetch", event => {
    if (/web32$|web32.js$/.test(event.request.url))
    {
        event.respondWith(fetch("web32.webos.js"));
    }
    else {
        return;
    }
});
