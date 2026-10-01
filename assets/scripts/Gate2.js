var $pool = require("./Pool");
var $battleGround2Ctrl = require("./BattleGround2Ctrl");
var $role2 = require("./Role2");
var c = cc._decorator;
var s = c.ccclass;
var r = c.property;
var l = (function (e) {
    function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        t.sep = null;
        t.gates = [];
        t.gateStrs = [];
        t.gateColors = [];
        t.par = null;
        t.sepWidth = 5;
        t.nextHitTime = 0;
        t.v = 0;
        t.buffs = [
            [300, 0, 0, 0],
            [300, 0, 0, 0]
        ];
        return t;
    }
    __extends(t, e);
    t.prototype.init = function (e) {
        if (void 0 === e) {
            e = {};
        }
        this.par = e.par;
        this.v = $battleGround2Ctrl.default.JSONManager.ConfigBattle[6].v[0];
        this.buffs[0][0] = this.par.WIDTH / 2;
        this.buffs[1][0] = this.par.WIDTH / 2;
        this.buffs[0][3] = 0;
        this.buffs[1][3] = 0;
        this.gates[0].width = this.par.WIDTH / 2;
        this.gates[0].x = -this.par.WIDTH / 4;
        this.gates[1].width = this.par.WIDTH / 2;
        this.gates[1].x = this.par.WIDTH / 4;
        this.buffs[0][1] = e.gateInfo[0][0];
        this.buffs[0][2] = e.gateInfo[0][1];
        this.buffs[1][1] = e.gateInfo[1][0];
        this.buffs[1][2] = e.gateInfo[1][1];
        this.sep.x = 0;
        this.nextHitTime = 0;
        this.setText();
    };
    t.prototype.moving = function (e) {
        if (10 === this.par.state) {
            this.node.y -= this.v * e;
            this.nextHitTime -= e;
            if (this.nextHitTime <= 0) {
                if (this.buffs[0][3] > 0) {
                    this.addBuff(0);
                    if (this.buffs[0][3] > this.buffs[1][3]) {
                        this.setGateWidth(0, this.sepWidth);
                        this.setGateWidth(1, -this.sepWidth);
                    }
                    this.nextHitTime = $battleGround2Ctrl.default.JSONManager.ConfigBattle[6].v[1];
                }
                if (this.buffs[1][3] > 0) {
                    this.addBuff(1);
                    if (this.buffs[1][3] > this.buffs[0][3]) {
                        this.setGateWidth(1, this.sepWidth);
                        this.setGateWidth(0, -this.sepWidth);
                    }
                    this.nextHitTime = $battleGround2Ctrl.default.JSONManager.ConfigBattle[6].v[1];
                }
                this.buffs[0][3] = 0;
                this.buffs[1][3] = 0;
            }
            if (this.node.y < this.par.endLineY + this.node.height / 2) {
                this.use();
            }
        }
    };
    t.prototype.addBuff = function (e) {
        this.buffs[e][2]++;
        if (0 === this.buffs[e][2]) {
            this.buffs[e][2] = 1;
        }
        if (2 === this.buffs[e][1] && this.buffs[e][2] > 8) {
            this.buffs[e][2] = 8;
        }
    };
    t.prototype.setGateWidth = function (e, t) {
        this.buffs[e][0] += t;
        if (this.buffs[e][0] < 10 * this.sepWidth) {
            this.buffs[e][0] = 10 * this.sepWidth;
        } else {
            if (this.buffs[e][0] > this.par.WIDTH - 10 * this.sepWidth) {
                this.buffs[e][0] = this.par.WIDTH - 10 * this.sepWidth;
            }
        }
        this.gates[e].width = this.buffs[e][0];
        if (0 === e) {
            this.gates[e].x = -this.par.WIDTH / 2 + this.gates[e].width / 2;
            this.sep.x = -this.par.WIDTH / 2 + this.gates[e].width;
        } else {
            this.gates[e].x = this.par.WIDTH / 2 - this.gates[e].width / 2;
        }
        this.gates[e].getComponent(cc.Sprite).spriteFrame = this.gateColors[t > 0 ? 0 : 1];
    };
    t.prototype.beHit = function (e) {
        if (e.node.x < -this.par.WIDTH / 2 + this.buffs[0][0]) {
            this.buffs[0][3]++;
        } else {
            this.buffs[1][3]++;
        }
        this.setText();
    };
    t.prototype.use = function () {
        if (this.par.player.x < this.sep.x) {
            this.getBuff(this.buffs[0][1], this.buffs[0][2]);
        } else {
            this.getBuff(this.buffs[1][1], this.buffs[1][2]);
        }
        this.node.parent.getComponent($pool.default).destroyPoolItem(this.node);
    };
    t.prototype.getBuff = function (e, t) {
        var o = this.par.player.getComponent($role2.default);
        switch (e) {
            case 1:
                if (t > 0) {
                    o.bulletConfig.rate -= 0.015 * t;
                    o.bulletConfig.rate < 1 / 15 && (o.bulletConfig.rate = 1 / 15);
                } else {
                    o.bulletConfig.rate *= Math.abs(t);
                }
                break;
            case 2:
                o.bulletConfig.nums += t;
                if (o.bulletConfig.nums < 1) {
                    o.bulletConfig.nums = 1;
                }
                if (o.bulletConfig.nums > 10) {
                    o.bulletConfig.nums = 10;
                }
                break;
            case 3:
                if (t > 0) {
                    o.bulletConfig.dmg *= t;
                } else {
                    o.bulletConfig.dmg /= Math.abs(t);
                    o.bulletConfig.dmg = Math.floor(o.bulletConfig.dmg);
                }
                this.par.refreshAtk();
                break;
            case 4:
            case 5:
                o.bulletConfig.dmg += t;
                this.par.refreshAtk();
        }
    };
    t.prototype.setText = function () {
        var e = {
            1: ["攻速 ", "x", "÷"],
            2: ["弹道 ", "+", "-"],
            3: ["攻击 ", "x", "÷"],
            4: ["攻击 ", "+", "-"],
            5: ["攻击 ", "+", "-"]
        };
        this.gateStrs[0].node.setScale(this.buffs[0][0] / 300);
        this.gateStrs[1].node.setScale(this.buffs[1][0] / 300);
        this.gateStrs[0].string =
            e[this.buffs[0][1]][0] +
            e[this.buffs[0][1]][this.buffs[0][2] >= 0 ? 1 : 2] +
            " " +
            Math.abs(this.buffs[0][2]);
        this.gateStrs[1].string =
            e[this.buffs[1][1]][0] +
            e[this.buffs[1][1]][this.buffs[1][2] >= 0 ? 1 : 2] +
            " " +
            Math.abs(this.buffs[1][2]);
    };
    t.prototype.start = function () {};
    t.prototype.update = function (e) {
        this.moving(e);
    };
    __decorate([r(cc.Node)], t.prototype, "sep", void 0);
    __decorate([r(cc.Node)], t.prototype, "gates", void 0);
    __decorate([r(cc.Label)], t.prototype, "gateStrs", void 0);
    __decorate([r(cc.SpriteFrame)], t.prototype, "gateColors", void 0);
    return __decorate([s], t);
})(cc.Component);
exports.default = l;
