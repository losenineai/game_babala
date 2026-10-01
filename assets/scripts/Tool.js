var $subpub = require("./Subpub");
var n = (function () {
    function e() {}
    e.init = function (t) {
        var o = cc.find("Canvas");
        e.ScreenWH[0] = o.width;
        e.ScreenWH[1] = o.height;
        e.BattlegroundBoard[0] = t.x - t.width / 2;
        e.BattlegroundBoard[1] = t.x + t.width / 2;
        e.BattlegroundBoard[2] = t.y - t.height / 2;
        e.BattlegroundBoard[3] = t.y + t.height / 2;
        cc.director.getCollisionManager().enabled = !0;
    };
    e.isInBattleGround = function (t, o) {
        return (
            t >= e.BattlegroundBoard[0] - 100 &&
            t <= e.BattlegroundBoard[1] + 100 &&
            o >= e.BattlegroundBoard[2] - 100 &&
            o <= e.BattlegroundBoard[3] + 100
        );
    };
    e.getAngle = function (e, t) {
        if (0 === e) {
            if (0 === t) {
                return 0;
            } else {
                if (t > 0) {
                    return 90;
                } else {
                    return 270;
                }
            }
        }
        if (0 === t) {
            if (e > 0) {
                return 0;
            } else {
                return 180;
            }
        }
        var o = (180 * Math.atan(Math.abs(t) / Math.abs(e))) / Math.PI;
        if (t > 0) {
            if (e < 0) {
                o = 180 - o;
            }
        } else {
            if (e > 0) {
                o = 360 - o;
            } else {
                o = 180 + o;
            }
        }
        return o;
    };
    e.setValueTo = function (e, t, o) {
        if (e < t) {
            return t;
        } else {
            if (e > o) {
                return o;
            } else {
                return e;
            }
        }
    };
    e.isInEllipse = function (e, t, o, a, n, i) {
        return ((e - o) * (e - o)) / (n * n) + ((t - a) * (t - a)) / (i * i) <= 1;
    };
    e.isInRect = function (e, t, o, a, n, i) {
        return e >= o - n / 2 && e <= o + n / 2 && t >= a - i / 2 && t <= a + i / 2;
    };
    e.randomPointInNode = function (e) {
        return [e.x - e.width / 2 + Math.random() * e.width, e.y - e.height / 2 + Math.random() * e.height];
    };
    e.randomInt = function (e, t) {
        return Math.floor(Math.random() * (t - e + 1)) + e;
    };
    e.randomFromArr = function (e) {
        return e[Math.floor(Math.random() * e.length)];
    };
    e.randomFromArr2 = function (e, t) {
        if (e.length <= t) {
            return e;
        }
        if (t <= 0) {
            return [];
        }
        var o = [];
        var a = e.map(function (e) {
            return e;
        });
        for (var n = 0; n < t; n++) {
            var i = Math.floor(Math.random() * (a.length - n));
            o.push(a[i]);
            a[i] = a[a.length - 1 - n];
        }
        return o;
    };
    e.randomByWeight = function (e, t) {
        if (void 0 === t) {
            t = [];
        }
        var o = [];
        var a = 0;
        var n = {};
        t.map(function (e) {
            n[e] = 1;
        });
        for (var i = 0; i < e.length; i++) {
            if (n[i]) {
                //
            } else {
                o.push({
                    idx: i,
                    w: e[i]
                });
                a += e[i];
            }
        }
        var c = Math.random() * a;
        for (i = 0; i < o.length; i++) {
            if (c < o[i].w) {
                return o[i].idx;
            }
            c -= o[i].w;
        }
        console.log("Tools.randombyWeight发生未知错误：", o, a, c);
    };
    e.getPrefab = function (e, t, o) {
        var a = e.getChildByName(o);
        if (a) {
            //
        } else {
            (a = cc.instantiate(t)).setParent(e);
            a.name = o;
        }
        a.active = !0;
        return a;
    };
    e.showVideoAd = function (e, t) {
        cc.pvz.AdUtils.showAdRewardVideo(e, function (e) {
            if (e) {
                t();
            }
        });
    };
    e.formatBigNum3 = function (e) {
        if (e < 1e4) {
            return "" + e;
        } else {
            if (e % 1e3 == 0) {
                return e / 1e3 + "K";
            } else {
                return (e / 1e3).toFixed(1) + "K";
            }
        }
    };
    e.resetGamePauseInfo = function () {
        e.gameTimeScale = 1;
        e.gamePause = 0;
    };
    e.pauseGame = function () {
        e.gamePause = 1;
        $subpub.default.publishEx("Spine.SetTimeScale", {
            timeScale: 0
        });
    };
    e.resumeGame = function () {
        e.gamePause = 0;
        $subpub.default.publishEx("Spine.SetTimeScale", {
            timeScale: e.gameTimeScale
        });
    };
    e.setGameTimeScale = function (t) {
        e.gameTimeScale = t;
        if (e.gamePause) {
            //
        } else {
            $subpub.default.publishEx("Spine.SetTimeScale", {
                timeScale: t
            });
        }
    };
    e.copyArr = function (t) {
        if (void 0 === t) {
            t = [];
        }
        var o = [];
        for (var a = 0; a < t.length; a++) {
            if (Array.isArray(t[a])) {
                o.push(e.copyArr(t[a]));
            } else {
                o.push(t[a]);
            }
        }
        return o;
    };
    e.getRGBColor = function (e) {
        var t = [0, 0, 0];
        for (var o = 0; o < 3; o++) {
            t[o] = parseInt("0x" + e[2 * o + 1] + e[2 * o + 2]);
        }
        return new cc.Color(t[0], t[1], t[2]);
    };
    e.shuffle = function (e) {
        for (var t = 0; t < e.length; t++) {
            var o = Math.floor(Math.random() * (e.length - t)) + t;
            var a = e[t];
            e[t] = e[o];
            e[o] = a;
        }
        return e;
    };
    e.ScreenWH = [0, 0];
    e.BattlegroundBoard = [0, 0, 0, 0];
    e.inSceneTest = 1;
    e.gameTimeScale = 1;
    e.gamePause = 0;
    return e;
})();
exports.default = n;
