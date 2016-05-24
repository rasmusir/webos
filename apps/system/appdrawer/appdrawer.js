"use strict";
importScripts("/web32.js");

function *main()
{
    let sync = yield;
    let area = new web32.Area();
    area.set("className", "appdrawer");

    area.on("blur", () => {
        close();
    });


    let apps = yield web32.Interface.getRegistryEntry("SYSTEM/APPS", sync);

    for (let fingerprint in apps)
    {
        let app = apps[fingerprint];
        if (!app.service)
        {
            let div = area.createElement("div");
            div.set("className", "app");
            div.set("innerHTML", app.name);
            div.on("click", () => {
                web32.Interface.launch(fingerprint);
                close();
            });
        }
    }

}
