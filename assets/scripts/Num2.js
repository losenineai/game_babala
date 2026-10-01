var a = cc._decorator;
var n = a.ccclass;
var i = a.property;
var c = (function (e) {
    function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        t.label = null;
        t.type = 0;
        t.owner = null;
        return t;
    }
    __extends(t, e);
    t.prototype.initAsHp = function (e) {
        this.type = 0;
        this.owner = e;
        this.changeHpTo();
        this.updateAsHp();
    };
    t.prototype.updateAsHp = function () {
        this.node.setPosition(this.owner.node.position.x, this.owner.node.position.y + this.owner.hpY);
    };
    t.prototype.changeHpTo = function () {
        this.label.string = "" + this.owner.hp;
    };
    t.prototype.init = function () {};
    t.prototype.start = function () {};
    t.prototype.update = function () {
        if (0 === this.type) {
            this.updateAsHp();
        }
    };
    __decorate([i(cc.Label)], t.prototype, "label", void 0);
    return __decorate([n], t);
})(cc.Component);
exports.default = c;
