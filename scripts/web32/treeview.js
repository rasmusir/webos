"use strict";

web32.TreeView = class TreeView extends web32.Element
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
        this.element.classList.add("tree");
        this.element.appendChild(this.createBranch(data));
        this.parent.element.appendChild(this.element);
    }

    createBranch(data)
    {
        if (typeof (data) === "object")
        {
            let ul = document.createElement("ul");
            ul.className = "branch";
            for (let branch in data)
            {
                let li = document.createElement("li");
                let label = document.createElement("label");
                let expander = document.createElement("input");
                expander.id = this.parent.id + "_" + web32.id();
                expander.type = "checkbox";
                label.setAttribute("for", expander.id);
                label.appendChild(document.createTextNode(branch));
                let branchElement = this.createBranch(data[branch]);
                if (typeof (data[branch]) === "object")
                {
                    li.appendChild(expander);
                }
                li.appendChild(label);
                li.appendChild(branchElement);
                ul.appendChild(li);
            }

            return ul;
        }
        else
        {
            let span = document.createElement("span");
            span.appendChild(document.createTextNode(": " + data));
            return span;
        }
    }
};

web32.Module.register(web32.TreeView);
