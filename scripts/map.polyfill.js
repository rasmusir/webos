"use strict";

Map.prototype.filter = function (filter) {
    let res = new Map();
    this.forEach((v, k) => {
        if (filter(v, k))
        {
            res.set(k, v);
        }
    });

    return res;
};

Map.prototype.toArray = function () {
    let a = [];
    this.forEach(v => a.push(v));
    return a;
};
