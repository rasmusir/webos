"use strict";

function main()
{

    let s = new System();
    s.installAllShells("/css/shell.lnu", "/css/shell.w95").then(shells => {
        let shell = s.getRegistryEntry("SYSTEM/CURRENT_SHELL") || "shell.w95";
        s.setShell("shell.w95");


        s.installAll("apps/system/about", "apps/system/taskbar", "apps/system/appdrawer",
                    "apps/system/regedit", "apps/system/webexplorer", "apps/system/settings",
                    "apps/communication/messenger").then(apps => {
            s.run("system.taskbar");
        });
    });


}

main();
