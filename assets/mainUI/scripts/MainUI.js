cc.Class({
    extends: cc.Component,
    properties: {
        stageLeftBtn: cc.Node,
        stageRigthBtn: cc.Node,
        levelPlayerPanel: cc.Node,
        levelMapPanel: cc.Node,
        leftRedNode: cc.Node,
        rigthRedNode: cc.Node,
        shareBtnNode: cc.Node
    },
    onLoad: function () {
        cc.MainUI = this;
    },
    start: function () {
        this.isLookAd = !1;
        console.log("  Start Main ");
        cc.pvz.PlayerData.checkAndResetGameDate();
        cc.pvz.PlayerData.checkAndResetAdData();
        cc.pvz.PlayerData.checkAndResetShare();
        this.initMainUI();
    },
    initMainUI: function () {
        this.stageLevel = cc.pvz.PlayerData.getStageLevel();
        this.curStageLevel = this.stageLevel;
        this.refreshLevelMapShow(this.stageLevel);
        this.refreshLevelEnemyShow(this.stageLevel);
        this.refreshLevelPlayerShow();
        this.refreshPageBtnShow();
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["关卡扫荡"]);
    },
    refreshLevelMapShow: function (e) {
        if (this.levelMap) {
            //
        } else {
            this.levelMap = this.levelMapPanel.getComponent("LevelMap");
        }
        this.levelMap.initLevelMap(e);
    },
    refreshLevelPlayerShow: function () {
        if (this.levelPlayer) {
            //
        } else {
            this.levelPlayer = this.levelPlayerPanel.getComponent("LevelPlayer");
        }
        this.levelPlayer.initHeroShow();
    },
    refreshLevelEnemyShow: function (e) {
        if (this.levelPlayer) {
            //
        } else {
            this.levelPlayer = this.levelPlayerPanel.getComponent("LevelPlayer");
        }
        this.levelPlayer.initEnemyShow(e);
    },
    refreshPageBtnShow: function () {
        if (1 == this.curStageLevel) {
            this.stageLeftBtn.active = !1;
            this.stageRigthBtn.active = !0;
            this.onCheckPageBtnRedTip(!1);
        } else {
            if (this.curStageLevel == cc.pvz.GameConfig.MaxLevel || this.curStageLevel - this.stageLevel == 2) {
                (this.stageRigthBtn.active = !1), (this.stageLeftBtn.active = !0), this.onCheckPageBtnRedTip(!0);
            } else {
                (this.stageLeftBtn.active = !0),
                    (this.stageRigthBtn.active = !0),
                    this.onCheckPageBtnRedTip(!0),
                    this.onCheckPageBtnRedTip(!1);
            }
        }
    },
    onCheckPageBtnRedTip: function (e) {
        if (e) {
            for (var t = this.curStageLevel - 1; t > 0; t--) {
                var i = this.stageLevel > t;
                var o = cc.pvz.PlayerData.getLevelBoxData(t);
                var a = cc.JsonControl.getLevelJson(t);
                for (var c = 0; c < o.length; c++) {
                    var s = a["wave" + (c + 1)];
                    if (0 == o[c]) {
                        if (i) {
                            return void (this.leftRedNode.active = !0);
                        }
                        if (this.levelMap.maxWave >= s && this.stageLevel == t) {
                            return void (this.leftRedNode.active = !0);
                        }
                    }
                }
            }
            this.leftRedNode.active = !1;
        } else {
            for (var n = this.curStageLevel + 1; n <= this.stageLevel; n++) {
                var r = this.stageLevel > n;
                var h = cc.pvz.PlayerData.getLevelBoxData(n);
                var p = cc.JsonControl.getLevelJson(n);
                for (var l = 0; l < h.length; l++) {
                    var d = p["wave" + (l + 1)];
                    if (0 == h[l]) {
                        if (r) {
                            return void (this.rigthRedNode.active = !0);
                        }
                        if (this.levelMap.maxWave >= d && this.stageLevel == n) {
                            return void (this.rigthRedNode.active = !0);
                        }
                    }
                }
            }
            this.rigthRedNode.active = !1;
        }
    },
    showMainUI: function () {
        this.node.active = !0;
        cc.pvz.utils.fadeInBtn(this.node);
        this.stageLevel = cc.pvz.PlayerData.getStageLevel();
        this.curStageLevel = this.stageLevel;
        this.refreshLevelMapShow(this.stageLevel);
        this.levelPlayerPanel.active = !0;
        this.refreshLevelEnemyShow(this.stageLevel);
        this.refreshPageBtnShow();
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["关卡扫荡"]);
        this.setClubBtnVisible(!0);
        cc.RedControl.onCheckMissionRed();
        if (cc.UITool && cc.UITool.isChangeArray) {
            this.refreshLevelPlayerShow();
        }
    },
    onHideLvBoxPanel: function () {
        if (this.levelMap) {
            //
        } else {
            this.levelMap = this.levelMapPanel.getComponent("LevelMap");
        }
        this.levelMap.onHideBoxRewardPanel();
    },
    hideMainUI: function () {
        this.onHideLvBoxPanel();
        this.node.active = !1;
        this.setClubBtnVisible(!1);
    },
    setClubBtnVisible: function () {},
    onPopup1st: function () {
        this.onHideLvBoxPanel();
        this.setClubBtnVisible(!1);
    },
    onAllClosed: function () {
        if (this.node.active) {
            this.setClubBtnVisible(!0);
        }
    },
    onClickStagePage: function (e, t) {
        if (this.isLookAd) {
            //
        } else {
            if (parseInt(t) < 0) {
                this.curStageLevel--;
            } else {
                this.curStageLevel++;
            }
            this.refreshLevelMapShow(this.curStageLevel);
            this.levelPlayerPanel.active = this.stageLevel >= this.curStageLevel;
            this.refreshLevelEnemyShow(this.curStageLevel);
            this.refreshPageBtnShow();
        }
    },
    onClickSet: function () {
        if (this.isLookAd) {
            //
        } else {
            cc.popupManager.popup(
                "mainUI",
                "set",
                "UISet",
                {
                    ad: !1,
                    scale: !0
                },
                0
            );
        }
    },
    onClickSign: function () {
        if (this.isLookAd) {
            //
        } else {
            cc.popupManager.popup("mainUI", "signUI", "UISign", {
                ad: !1,
                scale: !0
            });
        }
    },
    onClickTask: function () {
        if (this.isLookAd) {
            //
        } else {
            cc.popupManager.popup("mainUI", "TaskUI", "UITask", {
                ad: !1,
                scale: !1
            });
        }
    },
    onClickFund: function () {
        if (this.isLookAd) {
            //
        } else {
            cc.popupManager.popup("mainUI", "FundUI", "UIFund", {
                ad: !1,
                scale: !1
            });
        }
    },
    onClickOther: function () {
        this.onHideLvBoxPanel();
        cc.popupManager.showToast("暂未开启");
    },
    onClickShareUI: function () {
        cc.popupManager.popup("mainUI", "FenxiangUI", "UIShare", {
            ad: !1,
            scale: !0
        });
    },
    onClickRankMode: function () {
        cc.popupManager.popup(
            "mainUI",
            "Rank",
            "UIRankMode",
            {
                ad: !1,
                scale: !1
            },
            this.node
        );
    },
    enterGame2: function () {
        cc.assetManager.loadBundle("game2", function (e, t) {
            if (t) {
                cc.director.loadScene("game2");
                cc.player.game2t = Date.now();
            }
        });
    },
    onClickGame2: function () {
        var e = cc.player.game2t || -1;
        if (Date.now() - e < 18e5) {
            cc.popupManager.popup(
                "mainUI",
                "ModeTipUI",
                "UIAdGame2",
                {
                    ad: !1,
                    scale: !1
                },
                this
            );
        } else {
            this.enterGame2();
        }
    },
    test: function () {
        cc.view.emit("canvas-resize");
    }
});
