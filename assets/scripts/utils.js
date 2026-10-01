var o = {
    getRGBColor: function (e) {
        var t = new cc.Color();
        t.fromHEX("#" === e[0] ? e.substring(1) : e);
        return t;
    },
    getReminDays: function (e, t) {
        var o = Date.now() - t;
        return e - Math.floor(o / 864e5);
    },
    getTodayZeroTimes: function () {
        var e = Date.now();
        return e - (e % 864e5);
    },
    getTodayLastTimes: function () {
        var e = new Date();
        var t = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59);
        return Math.floor((t - e) / 1e3);
    },
    getCurDayInYears: function () {
        var e = new Date().getFullYear().toString();
        var t = new Date() - new Date(e) + 288e5;
        return Math.ceil(t / 864e5) + 1;
    },
    getDate: function () {
        var e = new Date();
        return 1e4 * e.getFullYear() + 100 * e.getMonth() + e.getDate();
    },
    getStartOfWeek: function () {
        var e = new Date();
        var t = e.getDay();
        var o;
        if (0 == t) {
            o = -6;
        } else {
            o = 1 - t;
        }
        e.setDate(e.getDate() + o);
        e.setHours(0, 0, 0, 0);
        return e.getTime();
    },
    getCurDayInWeek: function () {
        var e = new Date().getDay();
        if (0 == e) {
            return 7;
        } else {
            return e;
        }
    },
    formatItemNum: function (e) {
        var t = e;
        if (t < 1e4) {
            return e;
        }
        var o = parseInt(t / 1e3);
        return (o = (t / 1e3).toFixed((t - 1e3 * o) % 100 == 0 ? 1 : 2)) + "k";
    },
    foramtAttributeNum: function (e) {
        var t = e;
        if ((10 * e) % 10 == 0) {
            return t.toFixed(0);
        } else {
            return t.toFixed(1);
        }
    },
    randomWeightIndex: function (e) {
        var t = 0;
        var o = [0];
        var a = e.length;
        for (var n = 0; n < a; n++) {
            t += e[n];
            o.push(t);
        }
        var i = Math.random() * o[o.length - 1] - 1;
        var c = 0;
        var s = 0;
        var r = 0;
        for (var l = o.length - 1; r < l; ) {
            if ((s = o[(c = parseInt((r + l) / 2)) + 1]) < i) {
                r = c + 1;
            } else {
                if (!(s > i)) {
                    r = c;
                    break;
                }
                l = c;
            }
        }
        return r;
    },
    getZIndex: function (e) {
        return e.zIndex;
    },
    checkZIndex: function (e, t) {
        return e.zIndex <= t.zIndex;
    },
    getTargetLength: function (e, t) {
        return e.position.sub(t.position).len();
    },
    _withinTarget: function (e, t) {
        var o = e.getBoundingBox();
        var a = t.convertToWorldSpaceAR(cc.v2());
        var n = e.parent.convertToNodeSpaceAR(a);
        return o.contains(n);
    },
    _withinTargetPlace: function (e, t) {
        var o = e.getBoundingBox();
        var a = t.getLocation();
        var n = e.parent.convertToNodeSpaceAR(a);
        return o.contains(n);
    },
    _withinTargetSun: function (e, t) {
        var o = e.getBoundingBox();
        var a = t.getLocation();
        var n = e.parent.convertToNodeSpaceAR(a);
        return o.contains(n);
    },
    getSpineCurrentName: function (e) {
        return e.animation;
    },
    getTargetNodeComponent: function (e, t) {
        return e.getComponent(t);
    },
    ComputeBulletPosition: function (e, t) {
        var o = cc.v2(t.worldX, t.worldY);
        return e.convertToWorldSpaceAR(o);
    },
    ComputeDistance: function (e, t) {
        var o = e.convertToWorldSpaceAR(cc.v2());
        var a = t.convertToWorldSpaceAR(cc.v2());
        return o.sub(a).mag();
    },
    ComputeListSum: function (e) {
        return e.reduce(function (e, t) {
            return e + t;
        }, 0);
    },
    getRotationRadians: function (e, t) {
        var o = t.sub(e);
        return Math.atan2(o.y, o.x);
    },
    shuffleArray: function (e) {
        var t;
        var o;
        for (var a = e.length; a; ) {
            o = Math.floor(Math.random() * a--);
            t = e[a];
            e[a] = e[o];
            e[o] = t;
        }
        return e;
    },
    compareVersion: function (e, t) {
        e = e.split(".");
        t = t.split(".");
        for (var o = Math.max(e.length, t.length); e.length < o; ) {
            e.push("0");
        }
        for (; t.length < o; ) {
            t.push("0");
        }
        for (var a = 0; a < o; a++) {
            var n = parseInt(e[a]);
            var i = parseInt(t[a]);
            if (n > i) {
                return 1;
            }
            if (n < i) {
                return -1;
            }
        }
        return 0;
    },
    formatCDTime: function (e) {
        var t = "";
        var o = e % 60;
        if (e >= 86400) {
            t += Math.floor(e / 86400) + "天";
            t += Math.floor((e / 3600) % 24) + "小时";
        } else {
            if (e >= 3600) {
                return (t += Math.floor(e / 3600) + "小时") + Math.floor((e / 60) % 60) + "分";
            }
            if (e > 60) {
                return (t += Math.floor((e / 60) % 60) + "分") + Math.floor(o) + "秒";
            }
            if (o > 0) {
                t += Math.floor(o) + "秒";
            }
        }
        return t;
    },
    formatSeconds3: function (e) {
        var t = Math.floor(e / 3600);
        e -= 3600 * t;
        var o = Math.floor(e / 60);
        var a = e % 60;
        return (
            (t = t.toString().padStart(2, "0")) +
            ":" +
            (o = o.toString().padStart(2, "0")) +
            ":" +
            a.toString().padStart(2, "0")
        );
    },
    formatSeconds: function (e) {
        var t = e % 60;
        var o = "";
        if (e >= 3600) {
            o += Math.floor(e / 3600) + "小时";
        }
        if (e >= 60) {
            o += Math.floor((e / 60) % 60) + "分";
        }
        if (t > 0) {
            o += Math.floor(t) + "秒";
        }
        return o;
    },
    formatSeconds2: function (e) {
        var t = e % 60;
        var o = "";
        if (e >= 60) {
            var a = e / 60;
            o += ((a = parseInt(a)) >= 10 ? a : "0" + a) + ":";
        } else {
            o += "00:";
        }
        return o + (t > 0 ? (t >= 10 ? t : "0" + t) : "00");
    },
    getNodeSelfBoundBox: function (e) {
        var t = e.getBoundingBox();
        t.x = e.convertToWorldSpaceAR(cc.v2()).x - t.width / 2;
        t.y = e.convertToWorldSpaceAR(cc.v2()).y - t.height / 2;
        return t;
    },
    getNodeSelfBoundBox2: function (e) {
        if (e._parent) {
            e._parent._updateWorldMatrix();
            var t = e.getBoundingBox();
            e._calculWorldMatrix();
            t.transformMat4(t, e._worldMatrix);
            return t;
        }
        return e.getBoundingBox();
    },
    uploadScore: function (e) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            var t = [];
            var o = {};
            o.key = String("s");
            o.value = String(e);
            t.push(o);
            wx.setUserCloudStorage({
                KVDataList: t,
                success: function () {},
                fail: function () {}
            });
        }
    },
    fadeInBtn: function (e) {
        e.opacity = 0;
        e.active = !0;
        e.runAction(cc.fadeIn(0.16));
    },
    bindSpine: function (e, t, o) {
        var a = e.attachUtil.generateAttachedNodes(t)[0];
        o.parent = a;
    },
    getbindSpine: function (e, t) {
        return e.attachUtil.generateAttachedNodes(t)[0].children[0];
    },
    bindSpines: function (e, t) {
        var o = e.attachUtil;
        t.forEach(function (e) {
            var t = o.generateAttachedNodes(e.bone)[0];
            e.node.parent = t;
        });
    },
    sendMsg: function (e, t, o, a) {
        if (void 0 === a) {
            a = 5e3;
        }
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            return new Promise(function (n, i) {
                var c = {
                    url: e,
                    data: t || {},
                    method: o,
                    success: function (e) {
                        n(e.data);
                    },
                    fail: function (e) {
                        i(e);
                    },
                    timeout: a
                };
                if (t) {
                    c.data = t;
                }
                wx.request(c);
            });
        }
        var n = new XMLHttpRequest();
        return new Promise(function (i, c) {
            var s = function () {
                c("error:xhr status=" + n.status);
                n = null;
            };
            var r = setTimeout(function () {
                console.error("xhr timeout");
                if (n) {
                    n.abort();
                    s();
                }
            }, a);
            n.onreadystatechange = function () {
                if (4 == n.readyState) {
                    if (n.status >= 200 && n.status < 400) {
                        (function () {
                            var t = n.responseText;
                            if (0 == t.length) {
                                cc.error("empty response, url:", e), i({});
                            } else {
                                var o = JSON.parse(t);
                                i("object" == typeof o && o ? o : t);
                            }
                            n = null;
                            clearTimeout(r);
                        })();
                    } else {
                        n.status >= 400 && s();
                    }
                }
            };
            console.log("xhr start by " + o + " method!url=" + e + ", data=" + t);
            n.open(o, e, !0);
            if ("POST" == o && t) {
                var l = new Blob([JSON.stringify(t)]);
                n.send(l);
            } else {
                n.send();
            }
        });
    },
    setSpriteFrame: function (e, t, o) {
        if (e) {
            this.useBundleAsset(t, o, cc.SpriteFrame, function (t) {
                e.spriteFrame = t;
            });
        } else {
            console.warn("sprite is null", t, o);
        }
    },
    setSpriteFrames: function (e, t, o) {
        this.useBundleAsset(t, o, cc.SpriteFrame, function (t) {
            e.forEach(function (e) {
                return (e.spriteFrame = t);
            });
        });
    },
    useBundleAsset: function (e, t, o, a) {
        var n = function (e) {
            var n = e.get(t, o);
            if (n) {
                a(n);
            } else {
                e.load(t, o, function (e, t) {
                    if (e) {
                        console.warn(e);
                    } else {
                        a(t);
                    }
                });
            }
        };
        var i = cc.assetManager.getBundle(e);
        if (i) {
            n(i);
        } else {
            cc.assetManager.loadBundle(e, function (e, t) {
                if (e) {
                    console.warn(e);
                } else {
                    n(t);
                }
            });
        }
    },
    releaseAsset: function (e, t, o) {
        var a = cc.assetManager.getBundle(e);
        if (a && a.get(t, o)) {
            a.release(t, o);
        }
    },
    manuallyCheckCollider: function (e) {
        var t = cc.director.getCollisionManager();
        var o = [];
        var a = t._contacts[0].constructor;
        var n = 0;
        var i = 0;
        var c = t._colliders;
        var s = 0;
        for (var r = c.length; s < r; s++) {
            var l = c[s];
            if (t.shouldCollide(e, l)) {
                o.push(new a(e, l));
            }
        }
        t.initCollider(e);
        t.updateCollider(e);
        var u = [];
        n = 0;
        for (i = o.length; n < i; n++) {
            var p = o[n].updateState();
            if (p !== a.CollisionType.None) {
                u.push([p, o[n]]);
            }
        }
        n = 0;
        for (i = u.length; n < i; n++) {
            var d = u[n];
            t._doCollide(d[0], d[1]);
        }
        return u.length > 0;
    },
    manuallyCheck2Collider: function (e, t) {
        var o = cc.director.getCollisionManager();
        var a = o._contacts[0].constructor;
        o.initCollider(e);
        o.initCollider(t);
        o.updateCollider(e);
        o.updateCollider(t);
        return new a(e, t).test();
    },
    updateColliders: function (e) {
        var t = cc.director.getCollisionManager();
        var o = 0;
        for (var a = e.length; o < a; o++) {
            var n = e[o];
            t.initCollider(n);
            t.updateCollider(n);
        }
    },
    getCollideWith: function (e, t) {
        var o = cc.director.getCollisionManager();
        if (o._contacts[0]) {
            //
        } else {
            console.error("s");
        }
        var a = o._contacts[0].constructor;
        o.initCollider(e);
        o.updateCollider(e);
        var n = 0;
        for (var i = t.length; n < i; n++) {
            var c = t[n];
            o.initCollider(c);
            o.updateCollider(c);
            if (new a(e, c).test()) {
                return c;
            }
        }
        return null;
    },
    inRange2: function (e, t, o) {
        var a = o.x - e.x;
        var n = o.y - e.y;
        return a * a + (n * n) / 0.49 <= t;
    },
    getRewardItem: function (e, t) {
        var o = new cc.pvz.GameConfig.RewardData();
        o.itemId = e;
        o.count = t;
        o.toolId = -1;
        return o;
    },
    getRewardToolItem: function (e, t) {
        if (void 0 === t) {
            t = 1;
        }
        var o = new cc.pvz.GameConfig.RewardData();
        o.itemId = cc.pvz.GameConfig.ItemType["固定碎片"];
        o.count = t;
        o.toolId = e;
        return o;
    },
    onCheckRandomTool: function (e, t, o) {
        if (void 0 === o) {
            o = !0;
        }
        var a = [];
        var n = cc.JsonControl.getItemJson(e.itemId);
        var i = cc.pvz.utils.getOpenToolList(n.Quality, o);
        if (0 == i.length) {
            i.push(7);
        }
        var c = function () {
            var e = i[cc.math.randomRangeInt(0, i.length)];
            var t = cc.pvz.utils.getRewardToolItem(e, 1);
            var o = a.find(function (t) {
                return t.toolId == e;
            });
            if (o) {
                o.count++;
            } else {
                a.push(t);
            }
        };
        for (var s = 0; s < e.count; s++) {
            c();
        }
        for (var r = 0; r < a.length; r++) {
            t.push(a[r]);
        }
    },
    getOpenToolList: function (e, t) {
        if (void 0 === t) {
            t = !0;
        }
        var o = cc.pvz.PlayerData.getStageLevel();
        var a = [];
        var n = cc.pvz.GameConfig["Quality" + e + "Tools"];
        if (t) {
            for (var i = 0; i < n.length; i++) {
                var c = n[i];
                if (o > cc.pvz.GameConfig.ToolLockLevel[c - 1]) {
                    a.push(c);
                }
            }
            return a;
        }
        return n;
    },
    getLevelInterval: function (e) {
        var t = [
            [0, 3],
            [4, 7],
            [8, 11],
            [12, 15],
            [16, 999]
        ];
        for (var o = 0; o < t.length; o++) {
            if (e >= t[o][0] && e <= t[o][1]) {
                return o + 1;
            }
        }
        return null;
    },
    onChangeCNNUm: function (e) {
        return ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][e - 1];
    },
    spineFromTo: function (e, t, o, a, n) {
        if (void 0 === a) {
            a = !0;
        }
        if (void 0 === n) {
            n = null;
        }
        if (t) {
            e.setAnimation(0, t, !1);
        }
        var i = n;
        e.setCompleteListener(function () {
            e.setAnimation(0, o, a);
            if (i) {
                i();
            }
            e.setCompleteListener(null);
        });
    }
};
if (cc.pvz) {
    //
} else {
    cc.pvz = {};
}
cc.pvz.utils = o;
module.exports = o;
