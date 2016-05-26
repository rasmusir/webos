"use strict";

function main()
{

    let s = new System();
    s.installAllShells("css/shell.lnu", "css/shell.w95").then(shells => {
        let shell = s.getRegistryEntry("SYSTEM/CURRENT_SHELL");
        shell = typeof (shell) === "string" ? shell : "shell.w95";
        s.setShell(shell);


        s.installAll("apps/system/about", "apps/system/taskbar", "apps/system/appdrawer",
                    "apps/system/regedit", "apps/system/webexplorer", "apps/system/settings",
                    "apps/communication/messenger", "apps/system/codepad", "apps/system/login").then(apps => {
            s.run("system.login");
        });
    });
}


navigator.serviceWorker.register("./serviceWorker.js").then(() => {
    navigator.serviceWorker.ready.then(() => {
        console.log("ServiceWorker Registered!");
        main();
    });
}).catch( (e) => console.log("ServiceWorker registration failed", e));
