var $soundManager = require("./SoundManager");
var $pool = require("./Pool");
var $battleGround2Ctrl = require("./BattleGround2Ctrl");
var $gate2 = require("./Gate2");
var $role2 = require("./Role2");
var r = cc._decorator;
var l = r.ccclass;
var u = r.property;
var p = (function (e) {
    function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        t.label = null;
        t.bodySpr = null;
        t.bodySFS = [];
        t.collBody = null;
        t.par = null;
        t.v = 500;
        t.dmg = 1;
        t.hitTimes = 0;
        t.fCount = 0;
        t.state = 0;
        t.cIdx = 0;
        t.tarColHandle = null;
        return t;
    }
    var o;
    __extends(t, e);
    o = t;
    t.prototype.init = function (e, t, o) {
        this.node.x = e;
        this.node.y = t;
        this.par = o.par;
        this.hitTimes = 0;
        this.v = $battleGround2Ctrl.default.JSONManager.ConfigBattle[6].v[6];
        this.dmg = o.dmg;
        this.bodySpr.getComponent(cc.Sprite).spriteFrame = this.bodySFS[0];
        this.cIdx = Math.floor((this.node.x + 299) / 10);
        if (this.par.bulletHandles[this.cIdx]) {
            //
        } else {
            this.par.bulletHandles[this.cIdx] = [];
        }
        this.par.bulletHandles[this.cIdx].push(this.node);
        this.collBody.enabled = 1 === this.par.bulletHandles[this.cIdx].length;
        $soundManager.default.playEffect2(0);
        this.state = 0;
    };
    t.prototype.remove = function (e) {
        this.updateBulletHandles();
        if (1 === e) {
            this.v = 0;
            this.state = 1;
            this.fCount = 0;
            this.bodySpr.getComponent(cc.Sprite).spriteFrame = this.bodySFS[1];
        } else {
            this.node.parent.getComponent($pool.default).destroyPoolItem(this.node);
        }
    };
    t.prototype.start = function () {};
    t.prototype.onCollisionEnter = function (e) {
        o.collTimes++;
        if (this.hitTimes > 0) {
            //
        } else {
            if (1 === e.tag) {
                e.node.getComponent($role2.default).beHit(this);
            } else {
                3 === e.tag && e.node.getComponent($gate2.default).beHit(this);
            }
            this.collBody.enabled = !1;
            this.hitTimes++;
            this.remove(1);
        }
    };
    t.prototype.updateBulletHandles = function () {
        this.par.bulletHandles[this.cIdx].shift();
        if (this.par.bulletHandles[this.cIdx].length >= 1) {
            this.par.bulletHandles[this.cIdx][0].getComponent(o).collBody.enabled = !0;
        }
    };
    t.prototype.update = function (e) {
        if (10 === this.par.state) {
            if (1 === this.state) {
                this.fCount++,
                    3 === this.fCount
                        ? (this.bodySpr.getComponent(cc.Sprite).spriteFrame = this.bodySFS[2])
                        : 6 === this.fCount && this.remove(0);
            } else {
                (this.node.y += this.v * e), this.node.y >= 799 && this.remove(0);
            }
        }
    };
    t.collTimes = 0;
    __decorate([u(cc.Label)], t.prototype, "label", void 0);
    __decorate([u(cc.Node)], t.prototype, "bodySpr", void 0);
    __decorate([u(cc.SpriteFrame)], t.prototype, "bodySFS", void 0);
    __decorate([u(cc.BoxCollider)], t.prototype, "collBody", void 0);
    return (o = __decorate([l], t));
})(cc.Component);
exports.default = p;
