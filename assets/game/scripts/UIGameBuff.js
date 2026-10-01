var i = cc.Class({
    name: "BuffNode",
    properties: {
        bgSp: cc.Sprite,
        qualitySp: cc.Sprite,
        iconSp: cc.Sprite,
        nameLabel: cc.Label,
        descLabel: cc.RichText
    }
});
cc.Class({
    extends: cc.Component,
    properties: {
        heroJsonFile: cc.JsonAsset,
        buffJsonFile: cc.JsonAsset,
        buffNodes: [i],
        refreshNode: cc.Node,
        refreshTimesLabel: cc.Label,
        getAllNode: cc.Node,
        getAllTimesLabel: cc.Label,
        btnsLayout: cc.Layout
    },
    onLoad: function () {
        this.buffNodes.forEach(function (t) {
            return (t.descLabel.enabled = !1);
        });
    },
    initBy: function (t) {
        var e = this;
        this.scene = t;
        this.buffPool = [];
        this.buffJsonFile.json.forEach(function (t) {
            if (
                !(
                    cc.pvz.runtimeData.buffs.filter(function (e) {
                        return e == t.id;
                    }).length >= t.gettimes
                )
            ) {
                if (t.id < 100) {
                    e.buffPool.push(t.id);
                } else {
                    var i = Math.floor(t.id / 100);
                    var n = cc.pvz.PlayerData.getToolData(i);
                    if (n.pos >= 0 && n.lv >= t.locklevel) {
                        var o = parseInt(t.frontskill);
                        if (
                            "" == t.frontskill ||
                            cc.pvz.runtimeData.buffs.some(function (t) {
                                return t == o;
                            })
                        ) {
                            e.buffPool.push(t.id);
                        }
                    }
                }
            }
        });
        var i = [];
        if (1 == cc.pvz.PlayerData.getStageLevel() && cc.pvz.runtimeData.guide < 9) {
            i.push(24);
        }
        if (2 == cc.pvz.runtimeData.mode) {
            i.push(13, 14, 15, 16, 17, 18, 22, 23, 24, 31);
        }
        i.forEach(function (t) {
            var i = e.buffPool.findIndex(function (e) {
                return e == t;
            });
            if (-1 != i) {
                e.buffPool.splice(i, 1);
            }
        });
        this.refresh(!0);
        cc.pvz.PlayerData.checkAndResetAdData();
        this.getAllNode.active = this.getAdCount(1) > 0;
        this.getAllTimesLabel.string = this.getAdCount(1) + "/" + this.getAdMaxCount(1);
        this.updateRefreshTimes();
        if (this.getAllNode.active) {
            cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["buff全部"]);
        }
    },
    getAdMaxCount: function (t) {
        if (2 == cc.pvz.runtimeData.mode) {
            if (0 == t) {
                return 3;
            } else {
                return 1;
            }
        } else {
            if (0 == t) {
                return 10;
            } else {
                return 3;
            }
        }
    },
    getAdCount: function (t) {
        if (2 == cc.pvz.runtimeData.mode) {
            if (0 == t) {
                return cc.pvz.runtimeData.buffRefreshCount;
            } else {
                return cc.pvz.runtimeData.buffAllCount;
            }
        } else {
            return cc.pvz.PlayerData.getAdBuffTimes(t);
        }
    },
    useAdCount: function (t) {
        if (2 == cc.pvz.runtimeData.mode) {
            if (0 == t) {
                cc.pvz.runtimeData.buffRefreshCount--;
            } else {
                cc.pvz.runtimeData.buffAllCount--;
            }
        } else {
            cc.pvz.PlayerData.updateAdBuffTimes(t);
        }
    },
    updateRefreshTimes: function () {
        this.refreshNode.active = this.getAdCount(0) > 0;
        this.refreshTimesLabel.string = this.getAdCount(0) + "/" + this.getAdMaxCount(0);
        this.btnsLayout.updateLayout();
        if (this.refreshNode.active) {
            cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["buff刷新"]);
        }
    },
    refresh: function (t) {
        var e = this;
        this.buffs = [];
        if (t && cc.pvz.runtimeData.showGame1st) {
            [301, 501, 801].forEach(function (t) {
                if (cc.pvz.runtimeData.hasEnableBuff(t)) {
                    //
                } else {
                    e.buffs.push(t);
                }
            });
        }
        var i = t && 5 == cc.pvz.runtimeData.guide;
        if (i) {
            this.buffs.push(201);
        }
        var n = function () {
            for (
                var t = e.buffPool[cc.math.randomRangeInt(0, e.buffPool.length)];
                e.buffs.some(function (e) {
                    return e == t;
                });

            )
                t = e.buffPool[cc.math.randomRangeInt(0, e.buffPool.length)];
            e.buffs.push(t);
        };
        for (var o = this.buffs.length; o < this.buffNodes.length; o++) {
            n();
        }
        var s = function () {
            var t = e.buffs[c];
            var i = e.buffJsonFile.json.find(function (e) {
                return e.id == t;
            });
            var n = e.buffNodes[c];
            cc.pvz.utils.setSpriteFrame(n.bgSp, "uiImage", "game/buff_di" + i.quality);
            cc.pvz.utils.setSpriteFrame(n.qualitySp, "uiImage", "item/pz_" + i.quality);
            cc.pvz.utils.setSpriteFrame(n.iconSp, "uiImage", "skill/skill" + i.icon);
            n.nameLabel.string = i.name;
            n.descLabel.string = i.desc;
            n.descLabel.enabled = !0;
        };
        for (var c = 0; c < this.buffNodes.length; c++) {
            s();
        }
        if (i) {
            var a = this.scene;
            a.timePaused = !0;
            cc.butler.resumeDirector(1);
            var r = this.buffNodes[0].bgSp.node.parent;
            cc.guideManager.showGuide(
                0,
                [
                    {
                        tip: "击败怪物提升等级，能获得卡皮巴拉的强化",
                        focus: r,
                        btn: r.name,
                        y: -450
                    },
                    {
                        hideFinger: !0,
                        tip: "尽量击败怪物们变得更强吧！"
                    }
                ],
                function (t) {
                    if (t) {
                        a.timePaused = !1;
                    }
                }
            );
        }
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
        this.scene.checkIsSucc();
    },
    onClickBuff: function (t, e) {
        var i = this.buffs[parseInt(e)];
        cc.pvz.runtimeData.addBuff(i, this.heroJsonFile.json);
        this.onClickClose();
    },
    onClickRefresh: function () {
        var t = this;
        if (this.getAdCount(0) <= 0) {
            //
        } else {
            cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["buff刷新"], function (e) {
                if (e) {
                    t.useAdCount(0);
                    t.updateRefreshTimes();
                    t.refresh(!1);
                }
            });
        }
    },
    onClickGetAll: function () {
        var t = this;
        if (this.getAdCount(1) <= 0) {
            //
        } else {
            cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["buff全部"], function (e) {
                if (e) {
                    t.useAdCount(1);
                    t.buffs.forEach(function (e) {
                        cc.pvz.runtimeData.addBuff(e, t.heroJsonFile.json);
                    });
                    t.onClickClose();
                }
            });
        }
    }
});
