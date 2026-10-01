cc.Class({
    extends: cc.Component,
    properties: {
        maxWaveLabel: cc.Label,
        tryCountLabel: cc.Label,
        rankDot: cc.Node,
        levelPlayerPanel: cc.Node
    },
    onLoad: function () {
        cc.UIRankMode = this;
    },
    refreshLevelPlayerShow: function () {
        this.levelPlayerPanel.getComponent("LevelPlayer").initHeroShow();
    },
    initBy: function () {
        this.node.active = !0;
        cc.pvz.utils.fadeInBtn(this.node);
        cc.hasPopupType = cc.UIPage.Rank;
        this.maxWaveLabel.string = cc.tmpScore;
        this.tryCountLabel.string = cc.player.rankCount;
        this.rankDot.active = cc.tmpNewRecord;
        this.refreshLevelPlayerShow();
    },
    showFinish: function () {},
    onClickClose: function () {
        cc.hasPopupType = 0;
        this.node.active = !1;
    },
    onClickStart: function () {
        if (cc.player.rankCount <= 0) {
            cc.popupManager.showToast("今日次数已用完");
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
                            cc.pvz.GameConfig.UIFromType["排位赛"]
                        );
                    } else {
                        cc.popupManager.showToast("体力不足");
                    }
                } else {
                    cc.player.rankCount--,
                        cc.pvz.PlayerData.usePlayerPower(-cc.pvz.GameConfig.BattlePower),
                        cc.MainControl.checkPowerInfo(),
                        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["参与无尽挑战赛N次"], 1),
                        cc.MainUI.setClubBtnVisible(!1),
                        cc.pvz.runtimeData.init(2, -1),
                        cc.director.loadScene("game1");
                }
            } else {
                cc.popupManager.showToast("还有未上阵的卡皮巴拉哟！");
            }
        }
    },
    onClickTip: function () {
        cc.popupManager.popup("rank", "RankTipUI", "UIRankTip", {
            ad: !1,
            scale: !1
        });
    },
    onClickLastRank: function () {
        cc.tmpNewRecord = !1;
        this.rankDot.active = !1;
        cc.popupManager.popup(
            "rank",
            "RankList",
            "UIRankList",
            {
                ad: !1,
                scale: !1
            },
            this.node
        );
    },
    testUpload_1_5: function () {
        cc.pvz.cloud.uploadScore(cc.math.randomRangeInt(1, 6), "" + cc.math.randomRangeInt(1, 14), function () {});
    },
    testUpload_6_10: function () {
        cc.pvz.cloud.uploadScore(cc.math.randomRangeInt(6, 11), "" + cc.math.randomRangeInt(1, 14), function () {});
    }
});
