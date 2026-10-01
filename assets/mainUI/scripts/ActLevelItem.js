cc.Class({
    extends: cc.Component,
    properties: {
        timeLabel: cc.Label,
        timePanel: cc.Node,
        battleTimesLabel: cc.Label,
        battleBtn: cc.Node,
        redTip: cc.Node
    },
    initActLevelItem: function (e) {
        this.actType = e;
        this.stageLevel = cc.pvz.PlayerData.getStageLevel();
        this.lockLevel = cc.pvz.GameConfig.OpenSysLv[this.actType];
        this.timePanel.active = this.stageLevel > this.lockLevel;
        var t = this.battleBtn.children[0].getComponent(cc.Sprite);
        cc.JsonControl.setSpriteGray(t, this.stageLevel <= this.lockLevel);
        if (this.actType === cc.pvz.GameConfig.ActType["挑战副本"]) {
            this.initActLevelInfo();
        }
        this.onCheckActLevelRed();
    },
    initActLevelInfo: function () {
        cc.pvz.PlayerData.checkAndResetActLevel();
        this.ActLevelData = cc.pvz.PlayerData.getActLevelData();
        this.battleTimesLabel.string = this.ActLevelData.times;
        this.lastTime = cc.pvz.utils.getTodayLastTimes();
        this.timeLabel.string = "" + cc.pvz.utils.formatSeconds3(this.lastTime);
        this.schedule(this.refreshLoastTime, 1);
    },
    refreshLoastTime: function () {
        this.lastTime--;
        this.timeLabel.string = cc.pvz.utils.formatSeconds3(this.lastTime);
        if (this.lastTime <= 0) {
            this.lastTime = 86400;
            this.timeLabel.string = cc.pvz.utils.formatSeconds3(this.lastTime);
            if (this.actType == cc.pvz.GameConfig.ActType["挑战副本"]) {
                cc.pvz.PlayerData.checkAndResetActLevel();
                this.ActLevelData = cc.pvz.PlayerData.getActLevelData();
                this.battleTimesLabel.string = this.ActLevelData.times;
            }
            this.redTip.active = this.stageLevel > this.lockLevel;
        }
    },
    onCheckActLevelRed: function () {
        if (this.stageLevel <= this.lockLevel) {
            this.redTip.active = !1;
        } else {
            if (this.actType == cc.pvz.GameConfig.ActType["挑战副本"]) {
                if (this.ActLevelData.times > 0) {
                    return void (this.redTip.active = !0);
                }
                var e = cc.JsonControl.ActLevelBoxJson;
                for (var t = 0; t < 4; t++) {
                    if (e[t].score <= this.ActLevelData.score && 0 == this.ActLevelData.boxStatus[t]) {
                        return void (this.redTip.active = !0);
                    }
                }
            } else if (this.ActBallData.times > 0) {
                return void (this.redTip.active = !0);
            }
            this.redTip.active = !1;
        }
    },
    onClickActStart: function () {
        if (this.stageLevel <= this.lockLevel) {
            cc.popupManager.showToast("通过关卡第" + this.lockLevel + "关解锁！");
        } else if (this.actType === cc.pvz.GameConfig.ActType["挑战副本"]) {
            cc.popupManager.popup(
                "mainUI",
                "TiaozhanInfoUI",
                "UIActLevelInfo",
                {
                    ad: !1,
                    scale: !1
                },
                function () {
                    cc.UIActLevel.initActItemList();
                }
            );
        }
    }
});
