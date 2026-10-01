var o = {
    showGame1st: !1,
    mode: 0,
    level: 1,
    money: 0,
    autoTimes: 0,
    freeTimes: 1,
    lv2Count: 1,
    wave: 0,
    lv: 0,
    exp: 0,
    speed: 1,
    blocks: [],
    items: [],
    bagItems: [],
    buffs: [],
    buffValues: {},
    actBuff1: -1,
    actBuff2: -1,
    openSpeed: !0,
    hasReborn: !1,
    forceAdWave: 3,
    tryPlantId: 0,
    stats: [],
    guide: 0,
    adBlockCount: 3,
    buyCoinCount: 10,
    buffRefreshCount: 3,
    buffAllCount: 1,
    anger: 500,
    hasUseReborn: !1,
    init: function (e, t) {
        this.removeData();
        this.showGame1st = !1;
        this.mode = e;
        this.level = t;
        this.anger = 500;
        this.hasUseReborn = !1;
        this.blocks = [];
        var o = null;
        switch (this.mode) {
            case 0:
                o = cc.JsonControl.levelDataJson[this.level - 1];
                this.actBuff1 = -1;
                this.actBuff2 = -1;
                for (var a = 2; a < 5; a++) {
                    for (var n = 1; n < 4; n++) {
                        this.blocks.push(5 * a + n);
                    }
                }
                break;
            case 1:
                o = cc.JsonControl.ActLevelJson[this.level - 1];
                this.actBuff1 = cc.player.actLevelData.buffList[0];
                this.actBuff2 = cc.player.actLevelData.buffList[1];
                for (var i = 1; i < 6; i++) {
                    for (var c = 1; c < 4; c++) {
                        this.blocks.push(5 * i + c);
                    }
                }
                break;
            case 2:
                o = cc.JsonControl.rankLevelJsonFile.json[0];
                this.actBuff1 = -1;
                this.actBuff2 = -1;
                for (var s = 2; s < 5; s++) {
                    for (var r = 1; r < 4; r++) {
                        this.blocks.push(5 * s + r);
                    }
                }
                this.buyCoinCount = 20;
                this.buffRefreshCount = 3;
                this.buffAllCount = 1;
        }
        this.money = o.startyinbi;
        this.tryPlantId = 0;
        this.stats = new Array(14).fill(0);
        this.autoTimes = 1;
        this.freeTimes = 1;
        this.lv2Count = 1;
        this.wave = 0;
        this.lv = 0;
        this.exp = 0;
        this.speed = 1;
        this.openSpeed = !0;
        this.items = [];
        this.bagItems = [];
        this.buffs = [];
        this.buffValues = {};
        this.buffInfo = null;
        this.hasReborn = !1;
        this.forceAdWave = 3;
        this.adBlockCount = 3;
        this.guide = 0;
    },
    loadJsonData: function (e) {
        var t = this;
        if (!this.buffInfo) {
            this.buffInfo = {};
            var o = new Set();
            e.forEach(function (e) {
                t.buffInfo[e.id] = {
                    type: e.type,
                    value: e.value
                };
                o.add(e.type);
            });
            o.forEach(function (e) {
                t.buffValues[e] = 0;
            });
        }
    },
    addMoney: function (e) {
        this.money += e;
        if (e > 0) {
            cc.butler.playEffectAsync("game", "sound/getSunShine");
        }
        cc.butler.node.emit("money");
    },
    hasEnableBuff: function (e) {
        return this.buffs.some(function (t) {
            return t == e;
        });
    },
    getBuffValue: function (e) {
        return this.buffValues[e];
    },
    addBuff: function (e) {
        var t = this.buffInfo[e];
        switch (t.type) {
            case 1:
                break;
            case 6:
                this.addMoney(t.value);
                break;
            case 12:
                var o = [];
                this.items.forEach(function (e, t) {
                    if (e.lv < 3) {
                        o.push(t);
                    }
                });
                if (o.length > 0) {
                    var a = o[cc.math.randomRangeInt(0, o.length)];
                    var n = this.items[a];
                    n.lv++;
                    cc.butler.node.emit("lvup", a, n.lv);
                }
        }
        this.buffValues[t.type] += t.value;
        this.buffs.push(e);
        if (1 == t.type) {
            cc.butler.node.emit("maxHp");
        }
    },
    hasPreGame: function () {
        var e = cc.sys.localStorage.getItem("kapi-rt1");
        return !!e && ((this.preData = JSON.parse(e)), !0);
    },
    saveData: function () {
        delete this.preData;
        cc.sys.localStorage.setItem("kapi-rt1", JSON.stringify(this));
    },
    removeData: function () {
        cc.sys.localStorage.removeItem("kapi-rt1");
        delete this.preData;
    },
    initByPreData: function () {
        var e = this;
        Object.keys(this.preData).forEach(function (t) {
            e[t] = e.preData[t];
        });
    }
};
if (cc.pvz) {
    //
} else {
    cc.pvz = {};
}
cc.pvz.runtimeData = o;
module.exports = o;
