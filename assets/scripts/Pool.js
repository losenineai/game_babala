var a = cc._decorator;
var n = a.ccclass;
var i = a.property;
var c = (function (e) {
    function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        t.inPool = null;
        t.poolIdx = 0;
        t.pool = [];
        t.poolDirc = {};
        t.size = 100;
        t.actives = {};
        t.sleeps = {};
        return t;
    }
    __extends(t, e);
    t.prototype.createPool = function (e) {
        this.size = e;
    };
    t.prototype.getNewPoolItem = function () {
        for (var e in this.sleeps) {
            delete this.sleeps[e];
            this.actives[e] = 1;
            var t = parseInt(e) - 1e5 * this.poolIdx;
            this.pool[t].active = !0;
            return this.pool[t];
        }
        var o = cc.instantiate(this.inPool);
        o.setParent(this.node);
        this.pool.push(o);
        o.inPoolIdx = this.pool.length - 1 + 1e5 * this.poolIdx;
        o.name = "pool" + o.inPoolIdx;
        this.actives[o.inPoolIdx] = 1;
        this.poolDirc[o.inPoolIdx] = o;
        return o;
    };
    t.prototype.destroyPoolItem = function (e) {
        this.pool[e.inPoolIdx - 1e5 * this.poolIdx].active = !1;
        delete this.actives[e.inPoolIdx];
        this.sleeps[e.inPoolIdx] = 1;
    };
    t.prototype.destroyAllPoolItem = function () {
        for (var e = 0; e < this.node.children.length; e++) {
            if (this.node.children[e].active) {
                this.destroyPoolItem(this.node.children[e]);
            }
        }
    };
    t.prototype.getAllActiveItem = function () {
        var e = [];
        for (var t in this.actives) {
            var o = parseInt(t) - 1e5 * this.poolIdx;
            e.push(this.pool[o]);
        }
        return e;
    };
    t.prototype.start = function () {};
    __decorate([i(cc.Prefab)], t.prototype, "inPool", void 0);
    __decorate([i(cc.Integer)], t.prototype, "poolIdx", void 0);
    __decorate([i(cc.Integer)], t.prototype, "size", void 0);
    return __decorate([n], t);
})(cc.Component);
exports.default = c;
