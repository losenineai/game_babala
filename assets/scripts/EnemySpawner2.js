var $battleGround2Ctrl = require("./BattleGround2Ctrl");
var $role2 = require("./Role2");
var i = cc._decorator;
var c = i.ccclass;
var s = i.property;
var r = (function (e) {
    function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        t.jsonConfig = null;
        t.par = null;
        t.tCount = 0;
        t.enemyLivingCount = [0, 0];
        t.waveId = 0;
        t.ePoint = 0;
        t.waveEnemies = [
            [[1], [-100, 100], [-100, 100]],
            [[1], [0], [-100, 100], [-200, 0, 200], [-100, 100], [0]],
            [[1], [0], [-50, 50], [-100, 0, 100], [-150, -50, 50, 150]],
            [[10], [-250, -150, -50, 50, 150, 250]]
        ];
        t.waveEnemyRec = [];
        return t;
    }
    __extends(t, e);
    t.prototype.init = function () {
        cc.pvz.runtimeData.wave = 0;
        this.prepareNewWaveEnemy();
    };
    t.prototype.prepareNewWaveEnemy = function (e) {
        if (void 0 === e) {
            e = 1;
        }
        this.par.waveEnemyHandles = [[], [], [], [], [], []];
        var t = 0;
        for (var o = 0; o < this.jsonConfig.json.length; o++) {
            if (this.jsonConfig.json[o].level === this.waveId + 1) {
                t = o;
                break;
            }
        }
        for (; this.jsonConfig.json[t].level === this.waveId + 1; ) {
            var a = this.jsonConfig.json[t].numb - 1;
            if (a > 2) {
                a = 3;
            }
            var n = this.waveEnemies[a][0][0];
            if (3 === a) {
                n = this.jsonConfig.json[t].numb;
            }
            this.waveEnemyRec = [];
            for (var i = 0; i < n; i++) {
                for (o = 1; o < this.waveEnemies[a].length; o++) {
                    for (var c = 0; c < this.waveEnemies[a][o].length; c++) {
                        this.waveEnemyRec.push([e, t, this.waveEnemies[a][o][c]]);
                    }
                    e += 1;
                }
            }
            t++;
            if (!this.jsonConfig.json[t]) {
                break;
            }
        }
        if (t >= this.jsonConfig.json.length) {
            //
        } else {
            this.waveEnemyRec.push([e + 3, t - 1, 99999]);
        }
        this.tCount = 0;
        this.ePoint = 0;
    };
    t.prototype.spawnNewEnemy = function (e) {
        if (10 === this.par.state) {
            this.tCount += e;
            for (
                var t = this.jsonConfig.json;
                this.ePoint < this.waveEnemyRec.length && this.tCount >= this.waveEnemyRec[this.ePoint][0];

            ) {
                if (99999 === this.waveEnemyRec[this.ePoint][2]) {
                    this.node
                        .getComponent($battleGround2Ctrl.default)
                        .createNewGate(t[this.waveEnemyRec[this.ePoint][1]]);
                } else {
                    var o = this.par.createNewEnemy(this.waveEnemyRec[this.ePoint][2], 800, {
                        rId: this.waveEnemyRec[this.ePoint][1],
                        config: t[this.waveEnemyRec[this.ePoint][1]]
                    });
                    o.zIndex = -this.ePoint;
                    if (t[this.waveEnemyRec[this.ePoint][1]].numb >= 10) {
                        var i = (this.waveEnemyRec[this.ePoint][2] + 250) / 100;
                        this.par.waveEnemyHandles[i].push(o);
                        if (1 === this.par.waveEnemyHandles[i].length) {
                            o.getComponent($role2.default).collBody.enabled = !0;
                        } else {
                            o.getComponent($role2.default).collBody.enabled = !1;
                        }
                    } else {
                        o.getComponent($role2.default).collBody.enabled = !0;
                    }
                }
                this.ePoint++;
            }
            if (this.ePoint === this.waveEnemyRec.length) {
                if (this.waveId + 1 === t[t.length - 1].level) {
                    -99999999 === this.par.winTCount && (this.par.winTCount = 6);
                } else {
                    this.waveId++, cc.pvz.runtimeData.wave++, this.prepareNewWaveEnemy(4);
                }
            }
        }
    };
    t.prototype.updateEnemyHandles = function (e) {
        var t = Math.floor((e + 250) / 100);
        if (this.par.waveEnemyHandles[t]) {
            this.par.waveEnemyHandles[t].shift();
            if (this.par.waveEnemyHandles[t].length >= 1) {
                this.par.waveEnemyHandles[t][0].getComponent($role2.default).collBody.enabled = !0;
            }
        }
    };
    t.prototype.start = function () {
        this.init();
    };
    t.prototype.update = function (e) {
        this.spawnNewEnemy(e);
    };
    __decorate([s(cc.JsonAsset)], t.prototype, "jsonConfig", void 0);
    __decorate([s($battleGround2Ctrl.default)], t.prototype, "par", void 0);
    return __decorate([c], t);
})(cc.Component);
exports.default = r;
