cc.Class({
    extends: cc.Component,
    properties: {
        waveLabel: cc.Label,
        levelLabel: cc.Label,
        bgNodes: [cc.Node],
        batterWaveTip: cc.Node,
        bgSpine: sp.Skeleton,
        tiSpine: sp.Skeleton,
        baseItemNode: cc.Node,
        rewardParent: cc.Node,
        infoPanel: cc.Node,
        sweepTip: cc.Node,
        actGameTip: cc.Node,
        btnPanel: cc.Node,
        adBtn: cc.Node
    },
    initBy: function (t, e) {
        var i = this;
        if (void 0 === e) {
            e = !0;
        }
        this.scene = t;
        this.isInGame = e;
        this.isLookAd = !1;
        this.rewardParent.active = !1;
        this.btnPanel.active = !1;
        this.infoPanel.active = !1;
        this.actGameTip.active = !1;
        this.levelLabel.node.active = !1;
        this.sweepTip.active = !1;
        this.bgNodes[0].active = !1;
        this.bgNodes[1].active = !1;
        if (this.isInGame) {
            this.bgSpine.setAnimation(0, "", !1);
            if (this.scene.isSucc) {
                cc.pvz.utils.spineFromTo(this.bgSpine, "shengli1_2", "shengli2_2"),
                    cc.pvz.utils.spineFromTo(this.tiSpine, "shengli1_1", "shengli2_1", !0, function () {
                        i.onGameSpineEnd();
                    });
            } else {
                cc.pvz.utils.spineFromTo(this.bgSpine, "shibai1_2", "shibai2_2"),
                    cc.pvz.utils.spineFromTo(this.tiSpine, "shibai1_1", "shibai2_1", !0, function () {
                        i.onGameSpineEnd();
                    });
            }
            this.levelLabel.string = "" + cc.pvz.runtimeData.level;
            this.waveLabel.string = cc.pvz.runtimeData.wave;
            cc.pvz.runtimeData.level == cc.pvz.PlayerData.getStageLevel() &&
                this.scene.isSucc &&
                cc.pvz.PlayerData.updateStageLevel(1);
            if (
                cc.pvz.runtimeData.level == cc.pvz.PlayerData.getStageLevel() &&
                cc.pvz.runtimeData.wave > cc.pvz.PlayerData.getMaxLevelWave()
            ) {
                (this.batterWaveTip.active = !0), cc.pvz.PlayerData.updateMaxLevelWave(cc.pvz.runtimeData.wave);
            } else {
                this.batterWaveTip.active = !1;
            }
            this.scene.isSucc &&
                (0 == cc.pvz.runtimeData.mode
                    ? cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["通关主线副本n次"], 1)
                    : cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["通关挑战关卡n次"], 1));
            cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["关卡结算"]);
            cc.pvz.PlayerData.getStageLevel() > 1 && cc.pvz.PlayerData.saveDataToLocalOnline();
        } else {
            this.levelLabel.string = "" + this.scene.stageLevel;
            cc.pvz.utils.spineFromTo(this.bgSpine, "shengli1_2", "shengli2_2");
            cc.pvz.utils.spineFromTo(this.tiSpine, "shengli1_1", "shengli2_1", !0, function () {
                i.levelLabel.node.active = !0;
                i.sweepTip.active = !0;
                i.bgNodes[0].active = !0;
                var t = cc.JsonControl.getLevelData(i.scene.stageLevel);
                i.initRewardData(t.reward, 1);
            });
        }
        if (this.isInGame) {
            cc.butler.resumeDirector(1);
        }
    },
    onGameSpineEnd: function () {
        this.infoPanel.active = !0;
        this.levelLabel.node.active = 0 == cc.pvz.runtimeData.mode;
        this.actGameTip.active = 0 != cc.pvz.runtimeData.mode;
        this.bgNodes[this.scene.isSucc ? 0 : 1].active = !0;
        this.initInGameReward();
    },
    initInGameReward: function () {
        var t;
        if (this.scene.isSucc) {
            t = 1;
        } else {
            t = Math.max(1, cc.pvz.runtimeData.wave) / this.scene.maxWave;
        }
        var e = this.scene.hub.levelData;
        switch (cc.pvz.runtimeData.mode) {
            case 0:
                this.adBtn.active = !0;
                this.initRewardData(e.reward, t);
                break;
            case 1:
                this.adBtn.active = !1;
                this.initRewardData(e.reward, t);
        }
    },
    initRewardData: function (t, e) {
        var i = this;
        var n = e;
        if (this.isInGame && 0 == cc.pvz.runtimeData.mode) {
            n *= 1 + 0.01 * cc.pvz.runtimeData.getBuffValue(7);
        }
        var o = Math.floor(t.length / 2);
        var s = 0;
        var c = [];
        for (var a = 0; a < o; a++) {
            var r = Math.floor(n * t[s + 1]);
            var h = cc.pvz.utils.getRewardItem(t[s], r);
            c.push(h);
            s += 2;
        }
        this.rewardData = [];
        for (var d = 0; d < c.length; d++) {
            var u = c[d];
            if (u.itemId >= 5 && u.itemId <= 7) {
                cc.pvz.utils.onCheckRandomTool(u, this.rewardData);
            } else {
                this.rewardData.push(u);
            }
        }
        this.rewardParent.active = !0;
        var p = this.rewardData.length;
        this.baseItemNode.active = !0;
        if (this.isInGame) {
            //
        } else {
            cc.pvz.utils.fadeInBtn(this.baseItemNode);
        }
        this.baseItemNode.getComponent("RewardItem").initRewardItem(this.rewardData[0], !0);
        if (this.isInGame) {
            for (var l = 1; l < p; l++) {
                var f = cc.instantiate(this.baseItemNode);
                f.parent = this.rewardParent;
                cc.pvz.utils.fadeInBtn(f);
                f.getComponent("RewardItem").initRewardItem(this.rewardData[l], !0);
            }
            this.btnPanel.active = !0;
        } else {
            var m = function (t) {
                setTimeout(function () {
                    var e = cc.instantiate(i.baseItemNode);
                    e.parent = i.rewardParent;
                    cc.pvz.utils.fadeInBtn(e);
                    e.getComponent("RewardItem").initRewardItem(i.rewardData[t], !1);
                    if (t == p - 1) {
                        i.onSaveLogic();
                        cc.pvz.utils.fadeInBtn(i.btnPanel);
                    }
                }, 40 * (t - 1) + 120);
            };
            for (var v = 1; v < p; v++) {
                m(v);
            }
        }
    },
    onSaveLogic: function () {
        console.log(" save ");
        for (var t = 1; t < this.rewardData.length; t++) {
            this.rewardParent.children[t].getComponent("RewardItem").onSaveReward();
        }
    },
    onClickAd: function () {
        var t = this;
        if (this.isLookAd) {
            //
        } else {
            this.isLookAd = !0;
            cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["关卡结算"], function (e) {
                t.onAdClose(e);
            });
        }
    },
    onAdClose: function (t) {
        this.isLookAd = !1;
        if (t) {
            this.onShowDoubleReward();
        }
    },
    onShowDoubleReward: function () {
        var t = this;
        this.onGetDoubleReward();
        cc.popupManager.removePopup(this);
        cc.popupManager.popup(
            "mainUI",
            "getrewardUI",
            "UIReward",
            {
                ad: !1,
                scale: !1
            },
            this.rewardData,
            cc.pvz.GameConfig.UIFromType["双倍结算"],
            function () {
                t.onClickClose();
            }
        );
    },
    onGetDoubleReward: function () {
        for (var t = 0; t < this.rewardData.length; t++) {
            this.rewardParent.children[t].getComponent("RewardItem").onSaveReward();
            this.rewardData[t].count *= 2;
        }
    },
    onClickShare: function () {
        if (this.isLookAd) {
            //
        } else {
            cc.popupManager.showToast("分享成功了哟！");
            this.onShowDoubleReward();
        }
    },
    onClickClose: function () {
        if (this.isLookAd) {
            //
        } else {
            cc.butler.playEffectAsync("game", "sound/getCoin");
            if (this.isInGame) {
                cc.popupManager.removeAllPopups(),
                    1 == cc.pvz.PlayerData.getStageLevel()
                        ? (cc.pvz.runtimeData.init(0, 1),
                          cc.director.loadScene("game1"),
                          cc.pvz.TAUtils.trackBackpack(1))
                        : (cc.pvz.runtimeData.removeData(), cc.director.loadScene("mainUI"));
            } else {
                cc.popupManager.removePopup(this), cc.MainControl.updateItemInfo(), cc.RedControl.refreshAllRedTip();
            }
        }
    }
});
