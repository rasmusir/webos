"use strict";

web32.TabHolder = class TabHolder extends web32.Element
{
    constructor(parent, data)
    {
        super(parent, null, data);
        this.data = data;
    }

    onHost(i, parentid, type, data)
    {
        super.onHost(i, parentid);
        this.tabs = [];
        this.element = document.createElement("div");
        this.element.classList.add("tabs");
        this.tabHolder = document.createElement("div");
        this.tabHolder.classList.add("tabholder");
        this.tabSpace = document.createElement("div");
        this.tabSpace.classList.add("tabspace");

        this.element.appendChild(this.tabHolder);
        this.element.appendChild(this.tabSpace);
        this.parent.element.appendChild(this.element);
    }

    createElement(type, properties)
    {
        let element = new web32.Element(this, type, properties);
        this.addElement(element);
        return element;
    }

    createTab(name)
    {
        let element = new web32.Tab(this);
        this.addElement(element);
        return element;
    }

    h_createTab(tab)
    {
        let element = document.createElement("div");
        element.classList.add("tab");
        this.tabHolder.appendChild(tab.element);
        this.tabs.push(tab);
        return element;
    }
};

web32.Module.register(web32.TabHolder);
