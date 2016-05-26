"use strict";

web32.Tab = class Tab extends web32.Element
{
    constructor(parent)
    {
        super(parent, null, null);
    }
    onHost(i, parentid, type, properties)
    {
        super.onHost(i);
        let parent = i.getModule(parentid);
        this.init(parent, type, properties);

        if (type && parent instanceof web32.Tabs)
        {
            this.parent = parent;
            this.element = parent.h_createTab(this);
        }
        else
        {
            throw new Error("Tabs may only be created on TabHolders");
        }
    }

    hostDestroy()
    {
        this.parent.removeTab(this);
    }
};

web32.Module.register(web32.Tab);
