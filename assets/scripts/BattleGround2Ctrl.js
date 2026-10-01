var $soundManager = require("./SoundManager");
var $tool = require("./Tool");
var $pool = require("./Pool");
var $bullet2 = require("./Bullet2");
var $dieEff2 = require("./DieEff2");
var $gate2 = require("./Gate2");
var $num2 = require("./Num2");
var $role2 = require("./Role2");
var p = cc._decorator;
var d = p.ccclass;
var h = p.property;
var f = (function (e) {
    function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        t.jsonAssets = [];
        t.pools = [];
        t.startNode = null;
        t.endNode = null;
        t.hpProgBar = null;
        t.hitAni = null;
        t.atkStr = null;
        t.WIDTH = 600;
        t.state = 10;
        t.baseLineY = -500;
        t.endLineY = -500;
        t.player = null;
        t.winTCount = -99999999;
        t.hp = [3, 3];
        t.waveEnemyHandles = [[], [], [], [], [], []];
        t.bulletHandles = [];
        return t;
    }
    var o;
    __extends(t, e);
    o = t;
    t.prototype.start = function () {
        var e = ["ConfigBattle"];
        var t = function (t) {
            o.JSONManager[e[t]] = {};
            n.jsonAssets[t].json.map(function (a) {
                o.JSONManager[e[t]][a.id] = a;
            });
        };
        var n = this;
        for (var i = 0; i < this.jsonAssets.length; i++) {
            t(i);
        }
        this.baseLineY = this.startNode.y;
        this.endLineY = this.endNode.y;
        this.state = 10;
        this.createNewPlayer();
        setTimeout(function () {
            $soundManager.default.playBgm(0);
        }, 1e3);
        cc.director.getCollisionManager().enabled = !0;
    };
    t.prototype.createNewPlayer = function () {
        var e = this.pools[4].getComponent($pool.default).getNewPoolItem();
        this.player = e;
        e.setPosition(new cc.Vec2(0, this.baseLineY));
        e.getComponent($role2.default).init({
            team: 0,
            rId: 1,
            par: this
        });
    };
    t.prototype.createNewEnemy = function (e, t, o) {
        if (void 0 === o) {
            o = {};
        }
        var a = this.pools[0].getComponent($pool.default).getNewPoolItem();
        a.setPosition(new cc.Vec2(e, t));
        a.getComponent($role2.default).init({
            team: 1,
            rId: o.rId,
            config: o.config,
            par: this
        });
        return a;
    };
    t.prototype.createNewBullet = function (e, t, o) {
        var a = this.pools[2].getComponent($pool.default).getNewPoolItem();
        o.par = this;
        a.getComponent($bullet2.default).init(e, t, o);
    };
    t.prototype.createNewHpNum = function (e) {
        var t = this.pools[1].getComponent($pool.default).getNewPoolItem();
        t.getComponent($num2.default).initAsHp(e);
        return t;
    };
    t.prototype.createNewHitNum = function () {};
    t.prototype.createNewDieEff = function (e) {
        var t = this.pools[5].getComponent($pool.default).getNewPoolItem();
        t.setPosition(e.position);
        t.getComponent($dieEff2.default).init();
    };
    t.prototype.createNewGate = function (e) {
        if (void 0 === e) {
            e = {};
        }
        var t = this.pools[3].getComponent($pool.default).getNewPoolItem();
        t.y = 800;
        var o = [];
        for (var a = 1; a <= 5; a++) {
            if (0 !== e["door" + a]) {
                o.push(a);
            }
        }
        var c = $tool.default.randomFromArr2(o, 2);
        $tool.default.shuffle(c);
        var s = [
            [c[0], e["door" + c[0]]],
            [c[1], e["door" + c[1]]]
        ];
        t.getComponent($gate2.default).init({
            par: this,
            gateInfo: s
        });
    };
    t.prototype.beHit = function () {
        this.hitAni.play();
        this.hp[0]--;
        this.hpProgBar.progress = this.hp[0] / this.hp[1];
        if (this.hp[0] <= 0) {
            console.log("game over.");
            cc.popupManager.popup(
                "game2",
                "win",
                "UIGame2End",
                {
                    ad: !1,
                    scale: !0
                },
                !1
            );
            this.state = 0;
        }
    };
    t.prototype.refreshAtk = function () {
        this.atkStr.string = "" + this.player.getComponent($role2.default).bulletConfig.dmg;
    };
    t.prototype.showPauseMenu = function () {
        this.state = 0;
        cc.popupManager.popup(
            "game2",
            "set",
            "UIGame2Set",
            {
                scale: !1
            },
            this
        );
    };
    t.prototype.hidePauseMenu = function () {
        this.state = 10;
    };
    t.prototype.update = function (e) {
        if (10 === this.state && this.winTCount > 0) {
            this.winTCount -= e;
            if (this.winTCount <= 0) {
                cc.popupManager.popup(
                    "game2",
                    "win",
                    "UIGame2End",
                    {
                        ad: !1,
                        scale: !0
                    },
                    !0
                );
            }
        }
    };
    t.JSONManager = {
        ConfigBattle: {}
    };
    __decorate([h(cc.JsonAsset)], t.prototype, "jsonAssets", void 0);
    __decorate([h(cc.Node)], t.prototype, "pools", void 0);
    __decorate([h(cc.Node)], t.prototype, "startNode", void 0);
    __decorate([h(cc.Node)], t.prototype, "endNode", void 0);
    __decorate([h(cc.ProgressBar)], t.prototype, "hpProgBar", void 0);
    __decorate([h(cc.Animation)], t.prototype, "hitAni", void 0);
    __decorate([h(cc.Label)], t.prototype, "atkStr", void 0);
    return (o = __decorate([d], t));
})(cc.Component);
exports.default = f;
