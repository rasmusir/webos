"use strict";

class System
{
    constructor()
    {
        this._processes = new Map();
        this._apps = new Map();
        this._shells = new Map();
        this._register = this.getStorage();

        this.shell = null;
    }

    setShell(fingerprint)
    {
        let shell = this.getRegistryEntry("SYSTEM/SHELLS/" + fingerprint);
        if (this._styleElement)
        {
            this._styleElement.parentNode.removeChild(this._styleElement);
        }
        let style = document.createElement("link");
        style.href = shell.source + "/shell.css";
        style.type = "text/css";
        style.rel = "stylesheet";
        this.shell = shell;
        this.setRegistryEntry("SYSTEM/CURRENT_SHELL", shell.fingerprint);
        this._styleElement = style;
        document.head.appendChild(style);
    }

    getStorage()
    {
        let storage = localStorage.register;
        if (storage)
        {
            try
            {
                storage = JSON.parse(storage);
            }
            catch (e) { }
        }

        if (typeof (storage) !== "object")
        {
            storage = {};
        }


        return storage;
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
                this.setRegistryEntry("SYSTEM/APPS/" + app.fingerprint, app);
                resolve(app);
            });
        });
    }

    installAllShells(...urls)
    {
        let shells = urls.map(url => this.installShell(url));
        return Promise.all(shells);
    }

    installShell(url)
    {
        return new Promise((resolve) => {
            let u = `${url}/shell.json`;
            GET(u).then(res => {
                let shell = JSON.parse(res);
                shell.source = url + "/";
                this._shells.set(shell.fingerprint, shell);
                this.setRegistryEntry("SYSTEM/SHELLS/" + shell.fingerprint, shell);
                resolve(shell);
            });
        });
    }

    run(fingerprint)
    {
        let app = this._apps.get(fingerprint);
        let w = new Worker(app.source + app.main);
        let i = new web32.Interface(this, w, app);
        this._processes.set(i.id, i);
    }

    getProcesses(fingerprint)
    {
        return this._processes.filter((v, k) => { return v.app.fingerprint === fingerprint; }).toArray();
    }

    getProcess(id)
    {
        return this._processes.get(id);
    }

    getRegistryEntry(path, parent)
    {
        return this._gotoRegistryEntry(path);
    }

    setRegistryEntry(path, value, parent, parentpath)
    {
        this._gotoRegistryEntry(path, value);
        localStorage.register = JSON.stringify(this._register);
    }

    _gotoRegistryEntry(path, value, parent, parentpath)
    {
        if (path === "ROOT")
        {
            return this._register;
        }
        let pa = path.split("/");
        let name = pa[0];
        parent = parent || this._register;
        parentpath = parentpath || "";
        let register = parent[name];
        if (pa.length > 1)
        {
            if (!register)
            {
                register = {};

                parent[name] = register;
            }

            if (typeof (parent[name]) !== "object") { throw new Error("Registry path " + parentpath + " is not a directory."); }

            return this._gotoRegistryEntry(path.substr(name.length + 1), value, register, parentpath + name + "/");
        }
        else
        {
            if (value)
            {
                parent[name] = value;
            }

            return parent[name];
        }
    }

    tell(source, target, message, data)
    {
        let process = this.getProcess(target);
        if (target)
        {
            process.tell(source, message, data);
        }
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
