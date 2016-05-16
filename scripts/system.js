"use strict";

class System
{
    constructor()
    {
        this._processes = new Map();
        this._apps = new Map();
    }

    installAll(...urls)
    {
        let apps = urls.map(url => this.install(url));
        return Promise.all(apps);
    }

    install(url)
    {
        return new Promise((resolve) => {
            let u = `${url}/app.json`;
            GET(u).then(res => {
                let app = JSON.parse(res);
                app.source = url + "/";
                this._apps.set(app.fingerprint, app);
                resolve(app);
            });
        });
    }

    run(fingerprint)
    {
        let app = this._apps.get(fingerprint);
        let w = new Worker(app.source + app.main);
        let i = new web32.Interface(w, app);
    }
}

function GET(url)
{
    return new Promise((res, err) => {
        let x = new XMLHttpRequest();
        x.open("GET", url);
        x.onload = e => {
            res(x.responseText);
        };
        x.send();
    });

}
