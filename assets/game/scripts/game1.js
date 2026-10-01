var $blockRoot = require("./BlockRoot");
var $itemRoot = require("./ItemRoot");
var $prefabInfo = require("../../scripts/PrefabInfo");
var s = [3, 6, 8, 10];
var c = [1, 2, 4, 5, 7, 9, 11, 12];
cc.Class({
    extends: cc.Component,
    properties: {
        adBlockBtnNode: cc.Node,
        adBlockCountLabel: cc.Label,
        refreshFree: cc.Node,
        refreshCoin: cc.Node,
        refreshCoinLabel: cc.Label,
        refreshLv2Node: cc.Node,
        blockRoot: $blockRoot,
        itemRoot: $itemRoot,
        itemPrefabs: [cc.Node],
        item3Preabs: [cc.Node],
        blockPrefabs: [cc.Node],
        adSupPrefab: $prefabInfo,
        setBtnNode: cc.Node,
        lv5btnNode: cc.Node,
        bagBottomUIRoot: cc.Node,
        startBtnNode: cc.Node,
        refreshBtnNode: cc.Node,
        placeBtnNode: cc.Node,
        stashNode: cc.Node,
        hpBar: cc.ProgressBar,
        hpLabel: cc.Label,
        heroJsonFile: cc.JsonAsset,
        buffJsonFile: cc.JsonAsset,
        moneyIconNode: cc.Node,
        bgMusic: cc.AudioClip,
        fingerSpine: sp.Skeleton
    },
    onLoad: function () {
        this.itemPrefabs.forEach(function (t) {
            return (t.active = !1);
        });
        this.blockPrefabs.forEach(function (t) {
            return (t.active = !1);
        });
        this.fingerSpine.node.active = !1;
    },
    start: function () {
        var t = this;
        this.adBlockBtnNode.active = cc.pvz.runtimeData.adBlockCount > 0;
        this.items = [];
        this.attItems = [];
        this.itemPrefabs.forEach(function (e, i) {
            var n = i + 1;
            if (cc.pvz.PlayerData.getToolData(n).pos >= 0) {
                t.items.push(n);
                if (
                    c.some(function (t) {
                        return t == n;
                    })
                ) {
                    t.attItems.push(n);
                }
            }
        });
        cc.pvz.runtimeData.loadJsonData(this.buffJsonFile.json);
        this.blockRoot.scene = this;
        this.itemRoot.scene = this;
        this.logicEveryWave();
        this.refreshLv2Node.active = cc.pvz.runtimeData.lv2Count > 0;
        if (this.refreshLv2Node.active) {
            cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["刷新2级"]);
        }
        this.blockRoot.startLogic();
        this.updateHp();
        this.itemRoot.node.removeAllChildren();
        if (cc.pvz.runtimeData.autoTimes > 0) {
            this.doRefreshLogic(!0);
            cc.pvz.runtimeData.autoTimes--;
            this.saveRuntimeData();
        } else {
            cc.pvz.runtimeData.bagItems.forEach(function (e) {
                if (0 == e.id) {
                    var i = t.blockPrefabs[e.id0Type];
                    var n = t.addItemByPrefab(i, -1, null);
                    if (n.hasAd && !e.hasAd) {
                        n.unlockAd();
                    }
                } else {
                    var o = t.newEquipItem(e.lv, e.id, null);
                    if (e.hasAd) {
                        o.lockByAd(t.adSupPrefab);
                    }
                }
            });
            this.itemRoot.layoutChildren();
        }
        this.blockRoot.resetBlocksPreview();
        this.updateMoney();
        cc.butler.node.on("money", this.updateMoney, this);
        if (1 == cc.pvz.PlayerData.getStageLevel()) {
            this.setBtnNode.active = !1;
            this.blockRoot.stashEnable = !1;
            if (0 == cc.pvz.runtimeData.guide) {
                if (cc.pvz.runtimeData.showGame1st) {
                    (this.bagBottomUIRoot.active = !1),
                        cc.guideManager.showGuide(
                            0,
                            [
                                {
                                    hideFinger: !0,
                                    tip: "【背包】能强化上阵植物的能力。"
                                },
                                {
                                    hideFinger: !0,
                                    tip: "将刷新出的【工具】全部放入背包中强化植物!"
                                }
                            ],
                            function (e) {
                                if (e) {
                                    t.bagBottomUIRoot.active = !0;
                                    t.startBtnNode.active = !1;
                                    t.refreshBtnNode.active = !1;
                                    t.refreshLv2Node.active = !1;
                                    cc.pvz.runtimeData.guide = 3;
                                    t.updateMoveFinger();
                                }
                            }
                        ),
                        (this.adBlockBtnNode.active = !1);
                } else {
                    (this.bagBottomUIRoot.active = !1),
                        cc.guideManager.showGuide(
                            0,
                            [
                                {
                                    hideFinger: !0,
                                    tip: "欢迎来到卡皮巴拉的世界！"
                                },
                                {
                                    hideFinger: !0,
                                    tip: "将刷新出的卡皮巴拉放入游乐场！"
                                }
                            ],
                            function (e) {
                                if (e) {
                                    cc.pvz.runtimeData.guide = 1;
                                    t.updateMoveFinger();
                                }
                            }
                        ),
                        (this.adBlockBtnNode.active = !1);
                }
            }
        }
        if (this.adBlockBtnNode.active) {
            this.adBlockCountLabel.string = cc.pvz.runtimeData.adBlockCount;
            cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["刷新广告格子"]);
        }
    },
    logicEveryWave: function () {
        cc.butler.playMusic(this.bgMusic);
        var t = cc.pvz.runtimeData.getBuffValue(13);
        if (t > 0) {
            this.refreshCost = Math.round(15 * (1 - 0.01 * t));
        } else {
            this.refreshCost = 15;
        }
        this.updateRefreshBtns();
    },
    updateRuntimeData: function () {
        var t = this;
        cc.pvz.runtimeData.blocks = [];
        this.blockRoot.datas.forEach(function (t, e) {
            if (-1 != t) {
                cc.pvz.runtimeData.blocks.push(e);
            }
        });
        this.blockRoot.boardItemsRoot.children.forEach(function (t) {
            t.getComponent("Item").near10 = !1;
        });
        this.blockRoot.boardItemsRoot.children.forEach(function (e) {
            var i = e.getComponent("Item");
            if (10 == i.id) {
                var n = i.myBlocks[0].i;
                t.blockRoot.getCrossItems(i.id, n, function (t) {
                    t.near10 = !0;
                });
            }
        });
        cc.pvz.runtimeData.items = [];
        this.blockRoot.boardItemsRoot.children.forEach(function (t, e) {
            var i = t.getComponent("Item");
            cc.pvz.runtimeData.items.push({
                id: i.id,
                lv: i.lv,
                bs: i.myBlocks.map(function (t) {
                    return t.i;
                })
            });
            i.index = e;
        });
        cc.pvz.runtimeData.bagItems = [];
        var e = function (t) {
            cc.pvz.runtimeData.bagItems.push({
                id: t.id,
                lv: t.lv,
                hasAd: t.hasAd && !t.canUse,
                id0Type: t.id0Type
            });
        };
        this.itemRoot.node.children.forEach(function (t) {
            var i = t.getComponent("Item");
            e(i);
        });
        this.itemRoot.dragingRoot.children.forEach(function (t) {
            var i = t.getComponent("Item");
            e(i);
        });
    },
    saveRuntimeData: function () {
        this.updateRuntimeData();
        cc.pvz.runtimeData.saveData();
    },
    updateMoveFinger: function (t) {
        if (void 0 === t) {
            t = !1;
        }
        if (0 != this.itemRoot.node.childrenCount) {
            var e;
            if (!t && this.itemRoot.dragingRoot.childrenCount > 0) {
                e = this.itemRoot.dragingRoot.children[0].getComponent("Item");
            } else {
                e = null;
            }
            var i = this.prePosA;
            if (!e) {
                var n = this.itemRoot.node.children.findIndex(function (t) {
                    return 0 == t.getComponent("Item").id;
                });
                if (-1 == n) {
                    n = 0;
                }
                if ((e = this.itemRoot.node.children[n].getComponent("Item")).node.y > 5) {
                    var o = e.node.y;
                    e.node.y = 0;
                    i = e.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                    e.node.y = o;
                } else {
                    i = e.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                }
                this.prePosA = i;
            }
            var s = null;
            var c = this.blockRoot.boardItemsRoot.children.find(function (t) {
                var i = t.getComponent("Item");
                return i.id == e.id && i.lv == e.lv;
            });
            if (c) {
                s = c.convertToWorldSpaceAR(cc.v2(15, -30));
            } else {
                var a;
                var r = 0 == e.id || this.blockRoot.isExtendMode;
                var h;
                if (r) {
                    h = this.blockRoot.findPosForBlock(e);
                } else {
                    h = this.blockRoot.findBlockForItem(e);
                }
                if (-1 != h) {
                    if (r) {
                        a = this.blockRoot.poses[h].node.position.add(e.offset);
                    } else {
                        a = this.blockRoot.blocks[h].node.position.add(e.offset);
                    }
                    s = this.itemRoot.blockItemsRootNode.convertToWorldSpaceAR(a).add(cc.v2(15, -30));
                } else {
                    s = this.blockRoot.node.convertToWorldSpaceAR(cc.v2(270, 0));
                }
            }
            this.showMoveFinger(i, s);
        }
    },
    showMoveFinger: function (t, e) {
        var i = this;
        var n = this.fingerSpine.node.parent.convertToNodeSpaceAR(t);
        var o = this.fingerSpine.node.parent.convertToNodeSpaceAR(e);
        this.fingerSpine.node.active = !0;
        this.fingerSpine.node.stopAllActions();
        (function t() {
            i.fingerSpine.node.position = n;
            i.fingerSpine.setAnimation(0, "1", !1);
            i.fingerSpine.setCompleteListener(function () {
                i.fingerSpine.node.runAction(
                    cc.sequence(
                        cc.moveTo(0.75, o),
                        cc.callFunc(function () {
                            i.fingerSpine.setAnimation(0, "3", !1);
                            i.fingerSpine.setCompleteListener(function () {
                                if (0 == i.itemRoot.node.childrenCount) {
                                    t();
                                } else {
                                    i.updateMoveFinger();
                                }
                            });
                        })
                    )
                );
                i.fingerSpine.setAnimation(0, "2", !0);
                i.fingerSpine.setCompleteListener(null);
            });
        })();
    },
    hideMoveFinger: function () {
        this.fingerSpine.node.active = !1;
        this.fingerSpine.node.stopAllActions();
    },
    startGuide2: function () {
        var t = this;
        this.hideMoveFinger();
        cc.pvz.runtimeData.guide = 2;
        this.bagBottomUIRoot.active = !0;
        this.startBtnNode.active = !1;
        this.refreshLv2Node.active = !1;
        var e = this.refreshBtnNode;
        cc.guideManager.showGuide(
            0,
            [
                {
                    tip: "【刷新】获得更多卡皮巴拉",
                    focus: e,
                    btn: e.name
                }
            ],
            function (i) {
                if (i) {
                    e.y = -1e3;
                    cc.pvz.runtimeData.guide = 3;
                    setTimeout(function () {
                        t.updateMoveFinger();
                    });
                }
            }
        );
    },
    startGuide4: function () {
        this.hideMoveFinger();
        cc.pvz.runtimeData.guide = 4;
        var t = this.blockRoot.boardItemsRoot.children.find(function (t) {
            return 3 == t.getComponent("Item").id;
        });
        this.refreshBtnNode.y = 90;
        var e = this.startBtnNode;
        e.active = !0;
        cc.guideManager.showGuide(
            0,
            [
                {
                    hideFinger: !0,
                    tip: "战斗中，【蝙蝠卡皮】每隔一段时间会产出更多钱币",
                    focus: cc.find("gezi", t),
                    y: -400
                },
                {
                    tip: "准备就绪，去对抗入侵乐园的怪兽们吧！",
                    focus: e,
                    btn: e.name
                }
            ],
            function (t) {
                if (t) {
                    cc.pvz.runtimeData.guide = 5;
                }
            }
        );
    },
    startGuide6: function () {
        var t = this;
        this.hideMoveFinger();
        this.bagBottomUIRoot.active = !0;
        this.startBtnNode.active = !1;
        this.refreshLv2Node.active = !1;
        this.refreshBtnNode.active = !1;
        cc.guideManager.showGuide(
            0,
            [
                {
                    tip: "确认放置位置",
                    focus: this.placeBtnNode,
                    btn: this.placeBtnNode.name
                }
            ],
            function (e) {
                if (e) {
                    cc.pvz.runtimeData.guide = 7;
                    if (0 == t.itemRoot.node.childrenCount) {
                        t.itemRoot.scene.startGuide8();
                    } else {
                        setTimeout(function () {
                            t.updateMoveFinger(!0);
                        });
                    }
                }
            }
        );
    },
    startGuide8: function () {
        var t = this;
        this.hideMoveFinger();
        cc.pvz.runtimeData.guide = 8;
        this.blockRoot.stashEnable = !0;
        var e = this.refreshBtnNode;
        e.active = !0;
        e.parent.getComponent(cc.Layout).updateLayout();
        cc.guideManager.showGuide(
            0,
            [
                {
                    tip: "使用【刷新】，能获得更多卡皮巴拉",
                    focus: e,
                    btn: e.name
                },
                {
                    hideFinger: !0,
                    tip: "充分利用游乐场空间，做个背包整理达人吧"
                }
            ],
            function (e) {
                if (e) {
                    cc.pvz.runtimeData.guide = 9;
                    t.startBtnNode.active = !0;
                    t.refreshLv2Node.active = !0;
                    t.adBlockBtnNode.active = !0;
                    t.adBlockCountLabel.string = cc.pvz.runtimeData.adBlockCount;
                    cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["刷新广告格子"]);
                }
            }
        );
    },
    checkStartGame: function () {
        return 0 != this.blockRoot.boardItemsRoot.childrenCount || (cc.popupManager.showToast("上阵卡皮迎战敌人"), !1);
    },
    onClickStart: function (t) {
        var e = this;
        if (this.checkStartGame(this.onClickStart)) {
            this.saveRuntimeData();
            this.blockRoot.boardItemsRoot.children.forEach(function (i) {
                i.getComponent("Item").startHeroLogic(e.itemRoot.barPrefab, t);
            });
            cc.pvz.TAUtils.trackLevel(cc.pvz.runtimeData.level, cc.pvz.runtimeData.wave);
        }
    },
    onBackFromGame: function () {
        this.blockRoot.boardItemsRoot.children.forEach(function (t) {
            t.getComponent("Item").stopHeroLogic();
        });
        this.blockRoot.backFromGame();
        this.itemRoot.node.removeAllChildren();
        this.logicEveryWave();
    },
    addItemByPrefab: function (t, e, i) {
        var n = cc.instantiate(t);
        n.position = cc.Vec2.ZERO;
        var o = n.getComponent("Item");
        o.initBy(this.itemRoot, e, i);
        n.active = !0;
        if (i) {
            //
        } else {
            n.parent = this.itemRoot.node;
            this.itemRoot.layoutChildren();
        }
        return o;
    },
    newEquipItem: function (t, e, i) {
        var n;
        if (void 0 === e) {
            e = -1;
        }
        if (void 0 === i) {
            i = null;
        }
        if (-1 == e) {
            e = this.items[cc.math.randomRangeInt(0, this.items.length)];
        }
        if (e > 100) {
            n = this.item3Preabs.find(function (t) {
                return t.getComponent("Item").id == e;
            });
        } else {
            n = this.itemPrefabs.find(function (t) {
                return t.getComponent("Item").id == e;
            });
        }
        return this.addItemByPrefab(n, t, i);
    },
    doRefreshLogic: function (t) {
        var e = this;
        var i;
        if (t) {
            i = 3 + cc.pvz.runtimeData.getBuffValue(9);
        } else {
            i = 3;
        }
        this.itemRoot.node.removeAllChildren();
        var n = cc.pvz.runtimeData.wave >= cc.pvz.runtimeData.forceAdWave;
        if (0 == cc.pvz.runtimeData.mode && 1 == cc.player.level) {
            if (0 == cc.pvz.runtimeData.guide) {
                if (cc.pvz.runtimeData.showGame1st) {
                    this.newEquipItem(0, 5);
                    this.newEquipItem(0, 8);
                    this.newEquipItem(0, 3);
                } else {
                    this.newEquipItem(0, 5);
                    this.newEquipItem(0, 4);
                    this.newEquipItem(0, 6);
                }
                return void this.itemRoot.layoutChildren();
            }
            if (3 == cc.pvz.runtimeData.guide) {
                this.newEquipItem(0, 4);
                this.newEquipItem(0, 2);
                this.newEquipItem(0, 3);
                return void this.itemRoot.layoutChildren();
            }
            if (5 == cc.pvz.runtimeData.guide) {
                var o = this.blockPrefabs[1];
                this.addItemByPrefab(o, -1);
                this.newEquipItem(0, 1);
                this.newEquipItem(0, 3);
                this.itemRoot.layoutChildren();
                this.bagBottomUIRoot.active = !1;
                cc.guideManager.showGuide(
                    0,
                    [
                        {
                            hideFinger: !0,
                            tip: "出现新的格子，赶紧把游乐场空间扩大吧！"
                        }
                    ],
                    function (t) {
                        if (t) {
                            cc.pvz.runtimeData.guide = 6;
                            e.updateMoveFinger();
                        }
                    }
                );
                return void (this.adBlockBtnNode.active = !1);
            }
            if (t && 6 == cc.pvz.runtimeData.wave) {
                this.newEquipItem(3, 2).lockByAd(this.adSupPrefab);
                this.newEquipItem(0, 6);
                var c = this.blockPrefabs[3];
                this.addItemByPrefab(c, -1);
                var a = this.itemRoot.getComponent(cc.Layout);
                a.paddingLeft = 100;
                a.paddingRight = 100;
                this.itemRoot.layoutChildren();
                var r = cc.find("guide7", this.node);
                r.active = !0;
                return void cc.guideManager.showGuide(
                    0,
                    [
                        {
                            hideFinger: !0,
                            focus: r,
                            tip: "前方有首领怪物，赶紧上阵强力卡皮巴拉！"
                        }
                    ],
                    function (t) {
                        if (t) {
                            r.active = !1;
                        }
                    }
                );
            }
        }
        var h = 0.87;
        var d = 0.97;
        var u = cc.pvz.runtimeData.getBuffValue(8);
        if (u > 0) {
            h -= 0.01 * u;
            d -= 0.01 * u;
        }
        var p = [];
        this.blockRoot.boardItemsRoot.children.forEach(function (t) {
            var e = t.getComponent("Item");
            if (0 == e.id || (2 != e.lv && 3 != e.lv)) {
                //
            } else {
                p.push(e.id);
            }
        });
        var l = Math.min(0.2, 0.06 + 0.02 * p.length);
        var f = !1;
        var m = !1;
        var v = [-1, -1, -1];
        for (var g = 0; g < i; g++) {
            var b = 0;
            var k = -1;
            var B = -1;
            if (n) {
                b = 1;
                k = cc.math.randomRangeInt(3, this.blockPrefabs.length);
            } else if (!m && Math.random() < l) {
                b = 3;
                B = this.items[cc.math.randomRangeInt(0, this.items.length)];
            } else if (!f) {
                var C = Math.random();
                if (C < h) {
                    b = 0;
                } else {
                    if (C < d) {
                        b = 1;
                    } else {
                        b = 2;
                    }
                }
            }
            if (2 == g && 1 != b && v[0] == v[1]) {
                do {
                    B = this.items[cc.math.randomRangeInt(0, this.items.length)];
                } while (B == v[0]);
            }
            if (3 == b) {
                for (; 3 == B; ) {
                    B = this.items[cc.math.randomRangeInt(0, this.items.length)];
                }
            }
            if (
                0 == b &&
                v.some(function (t) {
                    return s.some(function (e) {
                        return e == t;
                    });
                })
            ) {
                B = this.attItems[cc.math.randomRangeInt(0, this.attItems.length)];
            }
            switch (b) {
                case 0:
                    v[g] = this.newEquipItem(0, B).id;
                    break;
                case 1:
                    if (-1 == k) {
                        k = cc.math.randomRangeInt(0, this.blockPrefabs.length);
                    }
                    var y = this.blockPrefabs[k];
                    v[g] = this.addItemByPrefab(y, -1).id;
                    if (k > 2) {
                        f = !0;
                        if (n) {
                            cc.pvz.runtimeData.forceAdWave += 5;
                            n = !1;
                        }
                        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["广告格子"]);
                    }
                    break;
                case 2:
                    v[g] = this.newEquipItem(1, B).id;
                    break;
                case 3:
                    var R = this.newEquipItem(2, B);
                    R.lockByAd(this.adSupPrefab);
                    v[g] = R.id;
                    m = !0;
            }
        }
        this.itemRoot.layoutChildren();
    },
    onClickWave7Guide: function () {
        cc.guideManager.onStepFinished();
    },
    onClickRefresh: function () {
        var t = this;
        if (cc.pvz.runtimeData.freeTimes > 0) {
            cc.pvz.runtimeData.freeTimes--;
            this.updateRefreshBtns();
        } else {
            if (cc.pvz.runtimeData.money < this.refreshCost) {
                if (2 == cc.pvz.runtimeData.mode && cc.pvz.runtimeData.buyCoinCount <= 0) {
                    return void cc.popupManager.showToast("阳光不足");
                } else {
                    return void cc.popupManager.popup(
                        "game",
                        "YgbuyUI",
                        "UIGameMoney",
                        {
                            scale: !1
                        },
                        function () {
                            t.saveRuntimeData();
                        }
                    );
                }
            }
            cc.pvz.runtimeData.addMoney(-this.refreshCost);
            this.updateMoney();
        }
        this.doRefreshLogic(!1);
        this.saveRuntimeData();
    },
    onClickAd3: function () {
        var t = this;
        cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["刷新广告格子"], function (e) {
            if (e) {
                var i = cc.math.randomRangeInt(1, 3);
                var n = t.blockPrefabs[i];
                t.addItemByPrefab(n, -1);
                cc.pvz.runtimeData.adBlockCount--;
                t.adBlockBtnNode.active = cc.pvz.runtimeData.adBlockCount > 0;
                if (t.adBlockBtnNode.active) {
                    t.adBlockCountLabel.string = cc.pvz.runtimeData.adBlockCount;
                    cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["刷新广告格子"]);
                }
                t.saveRuntimeData();
            }
        });
    },
    onClickAdRefresh: function () {
        var t = this;
        cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["刷新2级"], function (e) {
            if (e) {
                cc.pvz.runtimeData.lv2Count = 0;
                t.refreshLv2Node.active = !1;
                t.doRefreshLogic(!1);
                t.newEquipItem(1);
                t.saveRuntimeData();
            }
        });
    },
    updateRefreshBtns: function () {
        this.refreshFree.active = cc.pvz.runtimeData.freeTimes > 0;
        this.refreshCoin.active = cc.pvz.runtimeData.freeTimes <= 0;
        this.refreshCoinLabel.string = this.refreshCost;
        if (cc.pvz.runtimeData.money < this.refreshCost) {
            this.refreshCoinLabel.node.color = cc.Color.RED;
        } else {
            this.refreshCoinLabel.node.color = cc.Color.WHITE;
        }
    },
    updateMoney: function () {
        if (cc.pvz.runtimeData.money < this.refreshCost) {
            this.refreshCoinLabel.node.color = cc.Color.RED;
        } else {
            this.refreshCoinLabel.node.color = cc.Color.WHITE;
        }
    },
    updateHp: function () {
        var t = this;
        this.blockRoot.boardItemsRoot.children.forEach(function (t) {
            t.getComponent("Item").near6 = !1;
        });
        this.blockRoot.boardItemsRoot.children.forEach(function (e) {
            var i = e.getComponent("Item");
            if (6 == i.id && i.myBlocks.length > 0) {
                var n = i.myBlocks[0].i;
                t.blockRoot.getCrossItems(i.id, n, function (t) {
                    t.near6 = !0;
                });
            }
        });
        var e = this.blockRoot.boardItemsRoot.children.reduce(function (t, e) {
            var i = e.getComponent("Item");
            i.updateMaxHp();
            return t + i.maxHp;
        }, 0);
        this.hpLabel.string = Math.round(e);
    },
    onItemChanged: function () {
        this.updateHp();
    },
    showLv5UI: function () {
        cc.popupManager.popup(
            "game",
            "HechengUI",
            "UIGameLv5Info",
            {
                scale: !1
            },
            this
        );
    }
});
