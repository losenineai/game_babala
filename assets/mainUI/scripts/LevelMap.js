cc.Class({
    extends: cc.Component,
    properties: {
        lockNode: cc.Node,
        mapNameLabel: cc.Label,
        mapTipLabel: cc.Label,
        lockMapTipLabel: cc.Label,
        battlePanel: cc.Node,
        sweepBtn: cc.Node,
        battleBtn: cc.Node,
        sweepTimesLabel: cc.Label,
        sweepAdNode: cc.Node,
        boxSpineList: [sp.Skeleton],
        boxLabelList: [cc.Label],
        boxRewardPanel: cc.Node,
        rewardParent: cc.Node
    },
    onHideBoxRewardPanel: function () {
        this.boxRewardPanel.active = !1;
    },
    initLevelMap: function (e) {
        this.boxRewardPanel.active = !1;
        this.curBoxId = -1;
        this.stageLevel = e;
        this.levelJson = cc.JsonControl.getLevelJson(this.stageLevel);
        this.curStageLevel = cc.pvz.PlayerData.getStageLevel();
        this.sweepTimes = cc.pvz.PlayerData.getSweepTimes();
        this.maxWave = cc.pvz.PlayerData.getMaxLevelWave();
        this.isLock = this.stageLevel > this.curStageLevel;
        this.isFinish = this.stageLevel < this.curStageLevel;
        this.mapNameLabel.string = this.levelJson.name;
        this.lockNode.active = this.isLock;
        this.mapTipLabel.node.active = !this.isLock;
        this.lockMapTipLabel.node.active = this.isLock;
        this.battlePanel.active = !this.isLock;
        this.sweepBtn.active = this.isFinish;
        if (this.isFinish) {
            this.mapTipLabel.string = cc.pvz.GameConfig.LevelFinishTip;
            this.sweepTimesLabel.string = this.sweepTimes;
            this.sweepTimesLabel.node.active = this.sweepTimes > 0;
            this.sweepAdNode.active = this.sweepTimes <= 0;
        } else {
            if (this.isLock) {
                this.lockMapTipLabel.string = cc.pvz.GameConfig.LevelLockTip.replace("$", this.stageLevel - 1);
            } else {
                this.mapTipLabel.string = cc.pvz.GameConfig.LevelMaxWaveTip.replace("$", this.maxWave);
            }
        }
        this.levelBoxData = cc.pvz.PlayerData.getLevelBoxData(this.stageLevel);
        for (var t = 0; t < this.boxLabelList.length; t++) {
            var i = this.levelJson["wave" + (t + 1)];
            this.boxLabelList[t].string = cc.pvz.GameConfig.LevelBoxTip.replace("$", i);
            var o = this.boxSpineList[t];
            if (this.isLock) {
                o.setAnimation(0, "baoxiang1", !1);
            } else {
                if (1 == this.levelBoxData[t]) {
                    o.setAnimation(0, "baoxiang4", !1);
                } else {
                    if (i <= this.maxWave || this.isFinish) {
                        o.setAnimation(0, "baoxiang2", !0);
                    } else {
                        o.setAnimation(0, "baoxiang1", !1);
                    }
                }
            }
        }
    },
    onClickBox: function (e, t) {
        if (!cc.MainUI.isLookAd) {
            var i = parseInt(t);
            if (1 != this.levelBoxData[i - 1]) {
                var o;
                var a = this.levelJson["wave" + i];
                o = !this.isLock && (a <= this.maxWave || this.isFinish);
                var c = this.levelJson["reward" + i];
                var s = Math.floor(c.length / 2);
                var n = 0;
                this.rewardData = [];
                for (var r = 0; r < s; r++) {
                    var h = cc.pvz.utils.getRewardItem(c[n], c[n + 1]);
                    this.rewardData.push(h);
                    n += 2;
                }
                if (o) {
                    this.boxRewardPanel.active = !1;
                    cc.pvz.PlayerData.updateLevelBoxData(this.stageLevel, i);
                    var p = this.boxSpineList[i - 1];
                    p.setAnimation(0, "baoxiang3", !1);
                    p.setCompleteListener(function () {
                        p.setAnimation(0, "baoxiang4", !1);
                        p.setCompleteListener(null);
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
                        cc.pvz.GameConfig.UIFromType["关卡宝箱"]
                    );
                } else {
                    if (i != this.curBoxId) {
                        this.curBoxId = i;
                        this.boxRewardPanel.active = !0;
                        this.refreshBoxPanelInfo(i);
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
    onClickSweep: function () {
        var e = this;
        if (cc.MainUI.isLookAd) {
            //
        } else {
            if (cc.pvz.PlayerData.getPower() < cc.pvz.GameConfig.BattlePower) {
                if (cc.pvz.PlayerData.isHaveBuyPowerTimes()) {
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
                } else {
                    cc.popupManager.showToast("体力不足");
                }
            } else {
                cc.pvz.PlayerData.usePlayerPower(-5),
                    cc.MainControl.checkPowerInfo(),
                    this.sweepTimes > 0
                        ? (cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["扫荡关卡n次"], 1),
                          cc.pvz.PlayerData.updateSweepTimes(),
                          this.sweepTimes--,
                          (this.sweepTimesLabel.string = this.sweepTimes),
                          (this.sweepTimesLabel.node.active = this.sweepTimes > 0),
                          (this.sweepAdNode.active = this.sweepTimes <= 0),
                          cc.popupManager.popup(
                              "game",
                              "win",
                              "UIGameEnd",
                              {
                                  ad: !1,
                                  scale: !0
                              },
                              this,
                              !1
                          ),
                          cc.RedControl.onCheckBattleRed())
                        : ((cc.MainUI.isLookAd = !0),
                          cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["关卡扫荡"], function (t) {
                              e.onAdClose(t);
                          }));
            }
        }
    },
    onAdClose: function (e) {
        cc.MainUI.isLookAd = !1;
        if (e) {
            cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["扫荡关卡n次"], 1);
            cc.popupManager.popup(
                "game",
                "win",
                "UIGameEnd",
                {
                    ad: !1,
                    scale: !0
                },
                this,
                !1
            );
            cc.RedControl.onCheckBattleRed();
        }
    },
    onClickBattle: function () {
        if (cc.MainUI.isLookAd) {
            //
        } else {
            if (cc.pvz.PlayerData.isEnoughArrayTool()) {
                if (cc.pvz.PlayerData.getPower() < cc.pvz.GameConfig.BattlePower) {
                    if (cc.pvz.PlayerData.isHaveBuyPowerTimes()) {
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
                    } else {
                        cc.popupManager.showToast("体力不足");
                    }
                } else {
                    cc.pvz.PlayerData.usePlayerPower(-cc.pvz.GameConfig.BattlePower),
                        cc.MainControl.checkPowerInfo(),
                        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["挑战主线章节1次"], 1),
                        cc.MainUI.setClubBtnVisible(!1),
                        cc.pvz.runtimeData.init(0, this.stageLevel),
                        cc.director.loadScene("game1"),
                        cc.pvz.TAUtils.trackBackpack(this.stageLevel);
                }
            } else {
                cc.popupManager.showToast("还有未上阵的卡皮巴拉！");
            }
        }
    }
});
