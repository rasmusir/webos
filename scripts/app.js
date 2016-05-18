"use strict";

function main()
{

    let s = new System();
    s.installAll("apps/system/about", "apps/system/taskbar").then(apps => {
        s.run("system.taskbar");

    });
}

main();
