"use strict";

web32.Editor = class Editor extends web32.Element
{
    constructor(parent, data)
    {
        super(parent, null, data);
        this.data = data;

    }

    onHost(i, parentid, type, data)
    {
        super.onHost(i, parentid);
        this.element = document.createElement("div");
        this.element.id = web32.id();
        this.parent.element.appendChild(this.element);

        let editor = ace.edit(this.element.id);
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/javascript");
    }
};

web32.Module.register(web32.Editor);
