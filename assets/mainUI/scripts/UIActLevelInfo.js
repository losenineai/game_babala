cc.Class({
    extends: cc.Component,
    properties: {
        coinLabel: cc.Label,
        diamondLabel: cc.Label,
        powerPanel: cc.Node,
        timeLabel: cc.Label,
        scoreLabel: cc.Label,
        scoreBar: cc.ProgressBar,
        buffIconList: [cc.Sprite],
        buffTipPanel: cc.Node,
        buffDescLabel: cc.RichText,
        boxSpineList: [sp.Skeleton],
        boxLabelList: [cc.Label],
        boxRewardPanel: cc.Node,
        rewardParent: cc.Node,
        battleBtn: cc.Node,
        moreAdNode: cc.Node,
        levelPlayerPanel: cc.Node
    },
    refreshLevelPlayerShow: function () {
        this.levelPlayerPanel.getComponent("LevelPlayer").initHeroShow();
    },
    updateItemInfo: function () {
        var e = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["金币"]);
        this.coinLabel.string = cc.pvz.utils.formatItemNum(e);
        var t = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["钻石"]);
        this.diamondLabel.string = cc.pvz.utils.formatItemNum(t);
    },
    updatePowerInfo: function () {
        this.powerPanel.getComponent("PowerInfo").updatePowerInfo();
    },
    checkPowerInfo: function () {
        this.powerPanel.getComponent("PowerInfo").checkPowerShow();
    },
    onLoad: function () {
        cc.UIActLevelInfo = this;
    },
    onCloseAllTip: function () {
        this.buffTipPanel.active = !1;
        this.boxRewardPanel.active = !1;
    },
    initBy: function (e) {
        if (void 0 === e) {
            e = null;
        }
        cc.hasPopupType = cc.UIPage.Fuben;
        this.callback = e;
        this.isLookAd = !1;
        this.ActLevelJson = cc.JsonControl.ActLevelJson;
        this.ActLevelBuffJson = cc.JsonControl.ActLevelBuffJson;
        this.ActLevelBoxJson = cc.JsonControl.ActLevelBoxJson;
        this.updatePowerInfo();
        this.updateItemInfo();
        this.stageLevel = cc.pvz.PlayerData.getStageLevel();
        cc.pvz.PlayerData.checkAndResetActLevel();
        this.ActLevelData = cc.pvz.PlayerData.getActLevelData();
        this.curBuffIndex = -1;
        this.buffTipPanel.active = !1;
        this.boxRewardPanel.active = !1;
        this.curBoxId = -1;
        this.scoreLabel.string = this.ActLevelData.score;
        if (this.ActLevelData.score <= 2500) {
            this.scoreBar.progress = 0;
        } else {
            this.scoreBar.progress = (this.ActLevelData.score - 2500) / (cc.pvz.GameConfig.MaxActLevelScore - 2500);
        }
        this.initActBuffData();
        this.initLevelBoxData();
        this.lastTime = cc.pvz.utils.getTodayLastTimes();
        this.timeLabel.string = cc.pvz.utils.formatSeconds3(this.lastTime);
        this.schedule(this.refreshLoastTime, 1);
        if (
            this.ActLevelData.score < cc.pvz.GameConfig.MaxActLevelScore &&
            this.ActLevelData.times <= 0 &&
            cc.pvz.PlayerData.isHaveMoreActTimes()
        ) {
            this.moreAdNode.active = !0;
            cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["额外挑战"]);
        } else {
            this.moreAdNode.active = !1;
            var t = this.ActLevelData.times <= 0;
            for (var i = 0; i < 1; i++) {
                var o = this.battleBtn.children[i].getComponent(cc.Sprite);
                cc.JsonControl.setSpriteGray(o, t);
            }
        }
        this.refreshLevelPlayerShow();
    },
    initLevelMap: function () {},
    initActBuffData: function () {
        for (var e = 0; e < 2; e++) {
            var t = this.ActLevelData.buffList[e];
            if (-1 == t) {
                t = this.getRandomBuff(0 == e);
                cc.pvz.PlayerData.updateActLevelBuff(e + 1, t);
            }
            var i = cc.JsonControl.getActBuffJson(t);
            cc.pvz.utils.setSpriteFrame(this.buffIconList[e], "uiImage", "tiaozhan/buff" + i.icon);
        }
    },
    getRandomBuff: function (e) {
        if (void 0 === e) {
            e = !0;
        }
        var t = [];
        for (var i = 0; i < this.ActLevelBuffJson.length; i++) {
            var o = this.ActLevelBuffJson[i];
            if (e) {
                if (o.id < 100) {
                    t.push(o.id);
                }
            } else {
                if (o.id > 100) {
                    t.push(o.id);
                }
            }
        }
        return t[cc.math.randomRangeInt(0, t.length)];
    },
    onClickBuff: function (e, t) {
        this.boxRewardPanel.active = !1;
        var i = parseInt(t);
        if (i != this.curBuffIndex) {
            this.curBuffIndex = i;
            var o = this.ActLevelData.buffList[i - 1];
            var a = cc.JsonControl.getActBuffJson(o);
            this.buffTipPanel.active = !0;
            this.buffDescLabel.string = a.desc;
            this.buffTipPanel.position = cc.v2(
                this.buffIconList[i - 1].node.parent.position.x,
                this.buffTipPanel.position.y
            );
        } else {
            this.buffTipPanel.active = !this.buffTipPanel.active;
        }
    },
    initLevelBoxData: function () {
        this.levelBoxData = this.ActLevelData.boxStatus;
        for (var e = 0; e < this.boxLabelList.length; e++) {
            var t = this.ActLevelBoxJson[e].score;
            this.boxLabelList[e].string = "" + t;
            var i = this.boxSpineList[e];
            if (1 == this.levelBoxData[e]) {
                i.setAnimation(0, "baoxiang4", !1);
            } else {
                if (t <= this.ActLevelData.score) {
                    i.setAnimation(0, "baoxiang2", !0);
                } else {
                    i.setAnimation(0, "baoxiang1", !1);
                }
            }
        }
    },
    onClickBox: function (e, t) {
        var i = this;
        if (!this.isLookAd) {
            this.buffTipPanel.active = !1;
            var o = parseInt(t);
            if (1 != this.levelBoxData[o - 1]) {
                var a = this.ActLevelBoxJson[o - 1].score <= this.ActLevelData.score;
                var c = this.ActLevelBoxJson[o - 1].reward;
                var s = Math.floor(c.length / 2);
                var n = 0;
                this.rewardData = [];
                for (var r = 0; r < s; r++) {
                    var h = c[n];
                    var p = c[n + 1];
                    if (h == cc.pvz.GameConfig.ItemType["金币"]) {
                        p += this.stageLevel * (1 == o ? 10 : 20);
                    } else {
                        if (h == cc.pvz.GameConfig.ItemType["钻石"]) {
                            p += this.stageLevel * (2 == o ? 3 : 5);
                        }
                    }
                    var l = cc.pvz.utils.getRewardItem(h, p);
                    this.rewardData.push(l);
                    n += 2;
                }
                if (a) {
                    this.boxRewardPanel.active = !1;
                    cc.pvz.PlayerData.updateActLevelBoxStatus(o);
                    var d = this.boxSpineList[o - 1];
                    d.setAnimation(0, "baoxiang3", !1);
                    d.setCompleteListener(function () {
                        d.setAnimation(0, "baoxiang4", !1);
                        d.setCompleteListener(null);
                    });
                    cc.popupManager.popup(
                        "mainUI",
                        "getrewardUI",
                        "UIReward",
                        {
                            ad: !1,
                            scale: !1
                        },
                        this.rewardData,
                        cc.pvz.GameConfig.UIFromType["挑战副本"],
                        function () {
                            i.updateItemInfo();
                        }
                    );
                } else {
                    if (o != this.curBoxId) {
                        this.curBoxId = o;
                        this.boxRewardPanel.active = !0;
                        this.refreshBoxPanelInfo(o);
                    } else {
                        this.boxRewardPanel.active = !this.boxRewardPanel.active;
                    }
                }
            } else {
                cc.popupManager.showToast("奖励已领取");
            }
        }
    },
    refreshBoxPanelInfo: function (e) {
        this.boxRewardPanel.position = cc.v2(
            this.boxSpineList[e - 1].node.parent.position.x,
            this.boxRewardPanel.position.y
        );
        for (var t = 0; t < this.rewardParent.childrenCount; t++) {
            var i = this.rewardParent.children[t];
            if (t < this.rewardData.length) {
                i.active = !0;
                i.getComponent("RewardItem").initBoxRewardItem(this.rewardData[t]);
            } else {
                i.active = !1;
            }
        }
    },
    refreshLoastTime: function () {
        this.lastTime--;
        this.timeLabel.string = cc.pvz.utils.formatSeconds3(this.lastTime);
        if (this.lastTime <= 0) {
            this.lastTime = 86400;
            this.timeLabel.string = cc.pvz.utils.formatSeconds3(this.lastTime);
            this.initBy();
        }
    },
    onAdInGameLogic: function () {
        var e = this;
        if (this.isLookAd) {
            //
        } else {
            this.isLookAd = !0;
            cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["额外挑战"], function (t) {
                e.onAdClose(t);
            });
        }
    },
    onAdClose: function (e) {
        this.isLookAd = !1;
        if (e) {
            cc.pvz.PlayerData.updateAdActTimes();
            this.inActBattleGame();
        }
    },
    inActBattleGame: function () {
        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["参与挑战关卡n次"], 1);
        cc.MainUI.setClubBtnVisible(!1);
        cc.pvz.runtimeData.init(1, cc.player.actLevelData.level);
        cc.director.loadScene("game1");
    },
    onClickBattleGame: function () {
        if (this.isLookAd) {
            //
        } else {
            if (cc.pvz.PlayerData.isEnoughArrayTool()) {
                if (this.ActLevelData.times <= 0) {
                    if (this.moreAdNode.active) {
                        this.onAdInGameLogic();
                    } else {
                        cc.popupManager.showToast("今日次数已用完！");
                    }
                } else {
                    if (cc.pvz.PlayerData.getPower() < cc.pvz.GameConfig.BattlePower) {
                        cc.pvz.PlayerData.isHaveBuyPowerTimes()
                            ? cc.popupManager.popup(
                                  "mainUI",
                                  "powerbuy",
                                  "UIPowerBuy",
                                  {
                                      ad: !1,
                                      scale: !0
                                  },
                                  cc.pvz.GameConfig.UIFromType["挑战副本"]
                              )
                            : cc.popupManager.showToast("体力不足");
                    } else {
                        cc.pvz.PlayerData.usePlayerPower(-5),
                            this.checkPowerInfo(),
                            cc.pvz.PlayerData.updateActLevelTimes(),
                            this.inActBattleGame();
                    }
                }
            } else {
                cc.popupManager.showToast("还有未上阵的卡皮巴拉的哦！");
            }
        }
    },
    onCloseUI: function () {
        cc.hasPopupType = 0;
        cc.popupManager.removePopup(this);
        if (this.callback) {
            this.callback();
        }
    },
    onClickBuyPower: function () {},
    onClickBuyCoin: function () {
        cc.popupManager.removePopup(this);
        cc.MainControl.onClickBuyCoin();
    },
    onClickBuyDiamond: function () {
        cc.popupManager.removePopup(this);
        cc.MainControl.onClickBuyDiamond();
    }
});
