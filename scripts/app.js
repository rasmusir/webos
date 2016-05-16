"use strict";

function main()
{

    let s = new System();
    s.installAll("apps/system/about").then(apps => {
        apps.forEach(app => s.run(app.fingerprint));

    });
}

main();
