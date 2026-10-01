var $soundManager = require("./SoundManager");
var $tool = require("./Tool");
var $pool = require("./Pool");
var $battleGround2Ctrl = require("./BattleGround2Ctrl");
var $enemySpawner2 = require("./EnemySpawner2");
var $num2 = require("./Num2");
var l = cc._decorator;
var u = l.ccclass;
var p = l.property;
var d = (function (e) {
    function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        t.body = null;
        t.bulletSPos = null;
        t.bodySpine = null;
        t.bodySDS = [];
        t.collBody = null;
        t.team = 0;
        t.tCount = 0;
        t.v = 50;
        t.par = null;
        t.bulletConfig = {
            rate: 0,
            nums: 0,
            dmg: 0
        };
        t.hp = 100;
        t.state = 0;
        t.hpY = 0;
        t.isDragging = !1;
        t.dXYRec = [0, 0];
        t.hpNumberHandle = null;
        return t;
    }
    __extends(t, e);
    t.prototype.init = function (e) {
        if (void 0 === e) {
            e = {};
        }
        this.team = e.team;
        this.par = e.par;
        if (0 === this.team) {
            this.collBody.enabled = !1;
            this.bulletConfig = {
                rate: $battleGround2Ctrl.default.JSONManager.ConfigBattle[6].v[5],
                nums: $battleGround2Ctrl.default.JSONManager.ConfigBattle[6].v[3],
                dmg: $battleGround2Ctrl.default.JSONManager.ConfigBattle[6].v[4]
            };
            this.initDragEvent();
        } else {
            this.bodySpine.skeletonData = this.bodySDS[e.rId];
            this.bodySpine.setAnimation(0, "walk", !0);
            this.hp = e.config.hp;
            this.bodySpine.node.setScale(e.config.spineSize);
            this.hpY = e.config.hpy;
            this.v = $battleGround2Ctrl.default.JSONManager.ConfigBattle[6].v[2];
            this.createNewHpNum();
        }
        this.par.refreshAtk();
    };
    t.prototype.initDragEvent = function () {
        var e = this;
        this.body.on(cc.Node.EventType.TOUCH_START, function (t) {
            e.isDragging = !0;
            e.dXYRec[0] = t.getLocationX();
            e.dXYRec[1] = t.getLocationY();
        });
        this.body.on(cc.Node.EventType.TOUCH_MOVE, function (t) {
            var o = t.getLocationX();
            var a = t.getLocationY();
            e.node.x += o - e.dXYRec[0];
            if (e.node.x < -300) {
                e.node.x = -300;
            } else {
                if (e.node.x > 300) {
                    e.node.x = 300;
                }
            }
            e.dXYRec[0] = o;
            e.dXYRec[1] = a;
        });
        this.body.on(cc.Node.EventType.TOUCH_END, function () {
            e.isDragging = !1;
        });
        this.body.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            e.isDragging = !1;
        });
    };
    t.prototype.createNewBullet = function (e) {
        if (10 === this.par.state && ((this.tCount += e), !(this.tCount < this.bulletConfig.rate))) {
            this.tCount -= this.bulletConfig.rate;
            var t = $battleGround2Ctrl.default.JSONManager.ConfigBattle[6].v[7];
            var o = this.node.x + this.bulletSPos.x - Math.floor(this.bulletConfig.nums / 2) * t;
            var a = this.node.y + this.bulletSPos.y;
            for (var n = 0; n < this.bulletConfig.nums; n++) {
                this.par.createNewBullet(o, a, {
                    dmg: this.bulletConfig.dmg
                });
                o += t;
            }
            this.bodySpine.setAnimation(1, "atk", !1);
        }
    };
    t.prototype.createNewHpNum = function () {
        this.hpNumberHandle = this.par.createNewHpNum(this);
    };
    t.prototype.moving = function (e) {
        if (10 === this.par.state) {
            this.node.y -= this.v * e;
            if (this.node.y < this.par.endLineY + this.node.height / 2) {
                this.par.beHit();
                this.remove();
            }
        }
    };
    t.prototype.beHit = function (e) {
        this.hp -= e.dmg;
        if (this.hp <= 0) {
            this.par.createNewDieEff(this.node);
            this.par.node.getComponent($enemySpawner2.default).updateEnemyHandles(this.node.x);
            this.remove();
            $soundManager.default.playEffect2($tool.default.randomInt(3, 5));
        } else {
            this.hpNumberHandle.getComponent($num2.default).changeHpTo();
        }
    };
    t.prototype.remove = function () {
        this.hpNumberHandle.parent.getComponent($pool.default).destroyPoolItem(this.hpNumberHandle);
        this.node.parent.getComponent($pool.default).destroyPoolItem(this.node);
    };
    t.prototype.start = function () {};
    t.prototype.update = function (e) {
        if (0 === this.team) {
            this.createNewBullet(e);
        } else {
            this.moving(e);
        }
    };
    __decorate([p(cc.Node)], t.prototype, "body", void 0);
    __decorate([p(cc.Node)], t.prototype, "bulletSPos", void 0);
    __decorate([p(sp.Skeleton)], t.prototype, "bodySpine", void 0);
    __decorate([p(sp.SkeletonData)], t.prototype, "bodySDS", void 0);
    __decorate([p(cc.BoxCollider)], t.prototype, "collBody", void 0);
    return __decorate([u], t);
})(cc.Component);
exports.default = d;
