"use strict";

web32.Select = class Select extends web32.Element
{
    constructor(parent, data)
    {
        super(parent, null, data);
        this.data = data;

    }

    onHost(i, parentid, type, data)
    {
        super.onHost(i, parentid);
        this.element = document.createElement("select");

        data.forEach( option => {
            let elem = document.createElement("option");
            elem.innerHTML = option.text;
            elem.value = option.value;
            elem.selected = option.selected === true;
            this.element.appendChild(elem);
        });

        this.parent.element.appendChild(this.element);
    }

    h_on(event, func)
    {
        if (event === "change")
        {
            this.element.addEventListener("change", e => {
                let data = null;
                if (func)
                {
                    let f = eval(func);
                    data = f(e);
                }
                else
                {
                    data = this.element.value;
                }
                this.client("on", event, data);
            });
        }
        else
        {
            this.element.addEventListener(event, e => {
                let data = null;
                if (func)
                {
                    let f = eval(func);
                    data = f(e);
                }
                this.client("on", event, data);
            });
        }
    }


};

web32.Module.register(web32.Select);
