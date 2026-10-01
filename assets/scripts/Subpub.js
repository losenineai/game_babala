var a = (function () {
    function e(t) {
        if (void 0 === t) {
            t = {};
        }
        this.idx = 0;
        this.config = {};
        this.idx = e.subPubUniqueIdx++;
        this.config = t;
    }
    e.clearAll = function () {
        e.subPubUniqueIdx = 1;
        e.subRec = {};
    };
    e.prototype.subscribe = function (t, o) {
        if (e.subRec[t]) {
            //
        } else {
            e.subRec[t] = {};
        }
        e.subRec[t][this.idx] = {
            cb: o
        };
    };
    e.prototype.deSubscribe = function (t) {
        if (e.subRec[t]) {
            delete e.subRec[t][this.idx];
        }
    };
    e.prototype.publish = function (t, o) {
        for (var a in e.subRec[t]) e.subRec[t][a].cb(this.idx, o, this.config);
    };
    e.publishEx = function (t, o) {
        for (var a in (void 0 === o && (o = {}), e.subRec[t]))
            try {
                e.subRec[t][a].cb(-1, o, {});
            } catch (e) {}
    };
    e.subPubUniqueIdx = 1;
    e.subRec = {};
    return e;
})();
exports.default = a;
