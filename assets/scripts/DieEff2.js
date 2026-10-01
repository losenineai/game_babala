var $tool = require("./Tool");
var $pool = require("./Pool");
var i = cc._decorator;
var c = i.ccclass;
var s = i.property;
var r = (function (e) {
    function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        t.bodySpine = null;
        return t;
    }
    __extends(t, e);
    t.prototype.init = function () {
        this.bodySpine.setAnimation(0, "die" + $tool.default.randomInt(1, 3), !1);
    };
    t.prototype.start = function () {
        var e = this;
        this.bodySpine.setCompleteListener(function () {
            e.node.parent.getComponent($pool.default).destroyPoolItem(e.node);
        });
    };
    __decorate([s(sp.Skeleton)], t.prototype, "bodySpine", void 0);
    return __decorate([c], t);
})(cc.Component);
exports.default = r;
