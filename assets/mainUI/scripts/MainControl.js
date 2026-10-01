cc.UIPage = cc.Enum({
    Shop: 1,
    Rank: 2,
    Battle: 3,
    Tool: 4,
    Fuben: 5
});
cc.Class({
    extends: cc.Component,
    properties: {
        bgMusic: cc.AudioClip,
        lvUpSound: cc.AudioClip,
        rewardSound: cc.AudioClip,
        coinLabel: cc.Label,
        diamondLabel: cc.Label,
        powerPanel: cc.Node,
        btnNodeList: [cc.Node],
        mainPagePanel: cc.Node,
        spineList: [sp.Skeleton]
    },
    getItemEffectPos: function (e) {
        switch (e) {
            case cc.pvz.GameConfig.ItemType["钻石"]:
                return this.diamondLabel.node.convertToWorldSpaceAR(cc.v2());
            case cc.pvz.GameConfig.ItemType["体力"]:
                return this.powerInfo.powerLabel.node.convertToWorldSpaceAR(cc.v2());
            default:
                return this.coinLabel.node.convertToWorldSpaceAR(cc.v2());
        }
    },
    onLoad: function () {
        cc.MainControl = this;
    },
    clearUICatch: function () {
        cc.UIShop = null;
        cc.UITool = null;
        cc.UIActLevel = null;
        cc.UIRankMode = null;
    },
    start: function () {
        var e = this;
        console.log("  Start MainControl ");
        cc.RedControl.refreshAllRedTip();
        this.powerInfo = this.powerPanel.getComponent("PowerInfo");
        this.updatePowerInfo();
        this.updateItemInfo();
        this.clearUICatch();
        this.initMainControl();
        cc.butler.playMusic(this.bgMusic);
        if (1 != cc.player.guide1) {
            cc.tempGuideIndex = 0;
            var t = this.btnNodeList[3];
            cc.guideManager.showGuide(
                0,
                [
                    {
                        tip: "进入角色升级拥有的卡皮巴拉",
                        focus: t,
                        btn: t.name
                    }
                ],
                function (e) {
                    if (e) {
                        cc.tempGuideIndex = 1;
                    }
                }
            );
        } else {
            if (cc.pvz.PlayerData.getStageLevel() > cc.pvz.GameConfig.OpenSysLv[1]) {
                cc.pvz.cloud.myRank(function (t, i) {
                    if (t) {
                        cc.tmpScore = i.info.score;
                        if (
                            -1 != i.info.rankLastWeek &&
                            (!cc.player.rankWeek || cc.pvz.utils.getStartOfWeek() > cc.player.rankWeek)
                        ) {
                            cc.popupManager.popup(
                                "rank",
                                "RankReward",
                                "UIRankReward",
                                {
                                    ad: !1,
                                    scale: !0
                                },
                                i.info.rankLastWeek,
                                function () {
                                    e.updateItemInfo();
                                    e.onRankRewardShown();
                                }
                            );
                        } else {
                            e.onRankRewardShown();
                        }
                    } else {
                        e.onRankRewardShown();
                    }
                });
            } else {
                this.onRankRewardShown();
            }
        }
    },
    onRankRewardShown: function () {
        var e = this;
        if (cc.hasPopupType) {
            //
        } else {
            if (cc.pvz.runtimeData.hasPreGame()) {
                cc.popupManager.popup(
                    "mainUI",
                    "leveltipUI",
                    "UIPreGame",
                    {
                        ad: !1,
                        scale: !0
                    },
                    function () {
                        e.onRankRewardShown();
                    }
                );
            } else {
                cc.pvz.PlayerData.checkAndResetSign(),
                    cc.pvz.PlayerData.getSignData().isReward
                        ? cc.pvz.PlayerData.hasPastOneDay() &&
                          !cc.player.isShare &&
                          cc.player.adTimes >= 5 &&
                          cc.MainUI.onClickShareUI()
                        : cc.popupManager.popup("mainUI", "signUI", "UISign", {
                              ad: !1,
                              scale: !0
                          });
            }
        }
    },
    initMainControl: function () {
        this.isChangeCard = !1;
        this.curStatus = cc.UIPage.Battle;
        this.lastStatus = this.curStatus;
        this.onShopOpenStatus = 0;
        this.isLockRank = cc.pvz.PlayerData.getStageLevel() <= cc.pvz.GameConfig.OpenSysLv[1];
        this.initBtnStatus();
        if (cc.hasPopupType == cc.UIPage.Rank) {
            this.isChangeCard = !0;
            this.curStatus = cc.UIPage.Rank;
            this.onChangePage();
        } else {
            if (cc.hasPopupType == cc.UIPage.Fuben) {
                this.isChangeCard = !0;
                this.curStatus = cc.UIPage.Fuben;
                this.onChangePage();
            }
        }
    },
    onClickPageBtn: function (e, t) {
        if (!this.isChangeCard) {
            var i = parseInt(t);
            if (i == cc.UIPage.Rank && cc.pvz.PlayerData.getStageLevel() <= cc.pvz.GameConfig.OpenSysLv[1]) {
                cc.popupManager.showToast("通过关卡第" + cc.pvz.GameConfig.OpenSysLv[1] + "关解锁");
            } else {
                if (i != this.curStatus) {
                    this.onShopOpenStatus = 0;
                    this.isChangeCard = !0;
                    this.curStatus = i;
                    this.onChangePage();
                }
            }
        }
    },
    onChangePage: function () {
        this.onHidePageUI();
        this.onShowPageUI();
        this.onChangeBtnAni();
    },
    onShowPageUI: function () {
        switch (this.curStatus) {
            case cc.UIPage.Shop:
                if (cc.UIShop) {
                    cc.UIShop.initBy();
                    if (1 == this.onShopOpenStatus) {
                        cc.UIShop.onShopToCoin();
                    } else {
                        2 == this.onShopOpenStatus && cc.UIShop.onShopToDiamond();
                    }
                } else {
                    this.onLoadMainPageUI("shop", "UIShop");
                }
                cc.pvz.TAUtils.trackSystemUI(1);
                break;
            case cc.UIPage.Rank:
                if (cc.UIRankMode) {
                    cc.UIRankMode.initBy();
                } else {
                    this.onLoadMainPageUI("Rank", "UIRankMode");
                }
                break;
            case cc.UIPage.Battle:
                cc.MainUI.showMainUI();
                break;
            case cc.UIPage.Tool:
                if (cc.UITool) {
                    cc.UITool.initBy();
                } else {
                    this.onLoadMainPageUI("plant", "UITool");
                }
                cc.pvz.TAUtils.trackSystemUI(2);
                break;
            case cc.UIPage.Fuben:
                if (cc.UIActLevel) {
                    cc.UIActLevel.initBy();
                } else {
                    this.onLoadMainPageUI("TiaozhanUI", "UIActLevel");
                }
                cc.pvz.TAUtils.trackSystemUI(3);
        }
    },
    onLoadMainPageUI: function (e, t) {
        var i = this;
        cc.assetManager.getBundle("mainUI").load(e, cc.Prefab, function (o, a) {
            if (o) {
                console.log("prefabName load error: ", e, o);
            } else {
                var c = cc.instantiate(a);
                var s = c.getComponent(t);
                c.parent = i.mainPagePanel;
                c.position = cc.v2(0, 0);
                s.initBy();
                if ("UIShop" == t && cc.UIShop) {
                    if (1 == i.onShopOpenStatus) {
                        cc.UIShop.onShopToCoin();
                    } else {
                        2 == i.onShopOpenStatus && cc.UIShop.onShopToDiamond();
                    }
                }
            }
        });
    },
    onHidePageUI: function () {
        switch (this.lastStatus) {
            case cc.UIPage.Shop:
                cc.UIShop.onCloseUI();
                break;
            case cc.UIPage.Rank:
                cc.UIRankMode.onClickClose();
                break;
            case cc.UIPage.Battle:
                cc.MainUI.hideMainUI();
                break;
            case cc.UIPage.Tool:
                cc.UITool.onCloseUI();
                break;
            case cc.UIPage.Fuben:
                cc.UIActLevel.onCloseUI();
        }
    },
    initBtnStatus: function () {
        for (var e = 0; e < 5; e++) {
            var t = "";
            var i = e + 1;
            if (i < this.curStatus) {
                t = "_4_R";
                i == cc.UIPage.Rank && this.isLockRank && (t = "_5_R");
                this.spineList[e].setAnimation(0, "anniu" + i + t, !1);
            } else {
                if (i > this.curStatus) {
                    (t = "_4_L"),
                        i == cc.UIPage.Rank && this.isLockRank && (t = "_5_L"),
                        this.spineList[e].setAnimation(0, "anniu" + i + t, !1);
                } else {
                    this.spineList[e].setAnimation(0, "anniu" + i + "_3", !0),
                        this.spineList[e].node.setSiblingIndex(6);
                }
            }
        }
    },
    onChangeBtnAni: function () {
        var e = this;
        var t = function (t) {
            if (t < Math.min(e.lastStatus, e.curStatus) || t > Math.max(e.lastStatus, e.curStatus)) {
                return "continue";
            }
            if (t === e.curStatus) {
                var i = e.spineList[t - 1];
                var o;
                if (e.curStatus < e.lastStatus) {
                    o = "R";
                } else {
                    o = "L";
                }
                i.setAnimation(0, "anniu" + t + "_1_" + o, !1);
                i.setCompleteListener(function () {
                    i.setAnimation(0, "anniu" + t + "_3", !0);
                    e.isChangeCard = !1;
                    i.setCompleteListener(null);
                });
                i.node.setSiblingIndex(6);
            } else if (t === e.lastStatus) {
                var a;
                if (e.curStatus > e.lastStatus) {
                    a = "R";
                } else {
                    a = "L";
                }
                e.spineList[t - 1].setAnimation(0, "anniu" + t + "_2_" + a, !1);
                e.spineList[t - 1].addAnimation(0, "anniu" + t + "_4_" + a, !1);
            } else {
                var c;
                if (e.curStatus > e.lastStatus) {
                    c = "R";
                } else {
                    c = "L";
                }
                if (e.isLockRank && t == cc.UIPage.Rank) {
                    e.spineList[t - 1].setAnimation(0, "anniu" + t + "_5_" + c, !1);
                } else {
                    e.spineList[t - 1].setAnimation(0, "anniu" + t + "_4_" + c, !1);
                }
            }
        };
        for (var i = 1; i <= 5; i++) {
            t(i);
        }
        this.lastStatus = this.curStatus;
        for (var o = 0; o < 5; o++) {
            this.btnNodeList[o].active = o !== this.curStatus - 1;
            this.btnNodeList[o + 5].active = o === this.curStatus - 1;
        }
    },
    updateItemInfo: function () {
        var e = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["金币"]);
        this.coinLabel.string = cc.pvz.utils.formatItemNum(e);
        var t = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["钻石"]);
        this.diamondLabel.string = cc.pvz.utils.formatItemNum(t);
    },
    updatePowerInfo: function () {
        this.powerInfo.updatePowerInfo();
    },
    checkPowerInfo: function () {
        this.powerInfo.checkPowerShow();
    },
    onClickBuyPower: function () {
        cc.popupManager.popup(
            "mainUI",
            "powerbuy",
            "UIPowerBuy",
            {
                ad: !1,
                scale: !0
            },
            cc.pvz.GameConfig.UIFromType["主界面"]
        );
    },
    onClickBuyCoin: function () {
        if (this.curStatus != cc.UIPage.Shop) {
            this.onShopOpenStatus = 1;
            this.isChangeCard = !0;
            this.curStatus = cc.UIPage.Shop;
            this.onChangePage();
        } else {
            if (cc.UIShop) {
                cc.UIShop.onShopToCoin();
            }
        }
    },
    onClickBuyDiamond: function () {
        if (this.curStatus != cc.UIPage.Shop) {
            this.onShopOpenStatus = 2;
            this.isChangeCard = !0;
            this.curStatus = cc.UIPage.Shop;
            this.onChangePage();
        } else {
            if (cc.UIShop) {
                cc.UIShop.onShopToDiamond();
            }
        }
    },
    onAutoChangePage: function (e) {
        this.onShopOpenStatus = 0;
        this.isChangeCard = !0;
        this.curStatus = e;
        this.onChangePage();
    }
});
