cc.Class({
    extends: cc.Component,
    properties: {
        rewardItem: cc.Node,
        finishNode: cc.Node,
        getNode: cc.Node,
        getPanel: cc.Node,
        goToNode: cc.Node,
        proBar: cc.ProgressBar,
        proLabel: cc.Label,
        descLabel: cc.Label
    },
    initMissionItem: function (e, t, i) {
        this.isDayMission = e;
        this.MissionJson = t;
        this.rewardBack = i;
        if (this.isDayMission) {
            this.MissionData = cc.pvz.PlayerData.getDayMissionData(this.MissionJson.func);
        } else {
            this.MissionData = cc.pvz.PlayerData.getWeekMissionData(this.MissionJson.func);
        }
        this.descLabel.string = this.MissionJson.desc;
        this.Func = this.MissionJson.func;
        this.rewardData = cc.pvz.utils.getRewardItem(this.MissionJson.reward[0], this.MissionJson.reward[1]);
        this.rewardItem.getComponent("RewardItem").initRewardItem(this.rewardData, !1);
        this.proBar.progress = this.MissionData.pro / this.MissionJson.need;
        var o = cc.pvz.utils.formatItemNum(this.MissionData.pro);
        var a = cc.pvz.utils.formatItemNum(this.MissionJson.need);
        this.proLabel.string = o + "/" + a;
        this.isFinish = this.MissionData.isReward;
        this.isCanReward = this.MissionJson.need <= this.MissionData.pro;
        this.finishNode.active = this.isFinish;
        this.goToNode.active = !this.isCanReward;
        this.getNode.active = this.isCanReward && !this.isFinish;
        this.getPanel.active = this.isCanReward && !this.isFinish;
    },
    initAchieveMissionItem: function (e, t) {
        this.rewardBack = t;
        this.Id = e;
        this.AchieveData = cc.pvz.PlayerData.getAchieveData(this.Id);
        this.achieveIndex = 100 * this.Id + this.AchieveData.lv;
        this.AchieveJson = cc.JsonControl.getAchieveJson(this.achieveIndex);
        this.AchieveProgress = cc.pvz.PlayerData.getAchieveProgress(this.AchieveJson.func);
        this.Func = this.AchieveJson.func;
        this.descLabel.string = this.AchieveJson.desc;
        this.rewardData = cc.pvz.utils.getRewardItem(this.AchieveJson.reward[0], this.AchieveJson.reward[1]);
        this.rewardItem.getComponent("RewardItem").initRewardItem(this.rewardData, !1);
        this.isFinish = this.AchieveData.end;
        this.isCanReward = this.AchieveJson.need[0] <= this.AchieveProgress;
        this.proBar.progress = this.AchieveProgress / this.AchieveJson.need[0];
        var i = cc.pvz.utils.formatItemNum(this.AchieveProgress);
        var o = cc.pvz.utils.formatItemNum(this.AchieveJson.need[0]);
        this.proLabel.string = i + "/" + o;
        this.finishNode.active = this.isFinish;
        this.goToNode.active = !this.isCanReward && !this.isFinish;
        this.getNode.active = this.isCanReward && !this.isFinish;
        this.getPanel.active = this.isCanReward && !this.isFinish;
    },
    finishRefresh: function () {
        this.isFinish = !0;
        this.finishNode.active = this.isFinish;
        this.goToNode.active = !1;
        this.getNode.active = !1;
        this.getPanel.active = !1;
        this.node.setSiblingIndex(this.node.parent.childrenCount - 1);
    },
    onClickGoto: function () {
        switch (this.Func) {
            case cc.pvz.GameConfig.MissionType["累计获得金币"]:
            case cc.pvz.GameConfig.MissionType["累计消耗钻石"]:
            case cc.pvz.GameConfig.MissionType["每日商店购买n次物品"]:
            case cc.pvz.GameConfig.MissionType["高级宝箱抽取装备n次"]:
            case cc.pvz.GameConfig.MissionType["观看广告n次"]:
                cc.UITask.onCloseUI();
                cc.MainControl.onAutoChangePage(cc.UIPage.Shop);
                break;
            case cc.pvz.GameConfig.MissionType["参与挑战关卡n次"]:
            case cc.pvz.GameConfig.MissionType["通关挑战关卡n次"]:
                cc.UITask.onCloseUI();
                cc.MainControl.onAutoChangePage(cc.UIPage.Fuben);
                break;
            case cc.pvz.GameConfig.MissionType["参与无尽挑战赛N次"]:
                cc.UITask.onCloseUI();
                cc.MainControl.onAutoChangePage(cc.UIPage.Rank);
                break;
            case cc.pvz.GameConfig.MissionType["挑战主线章节1次"]:
            case cc.pvz.GameConfig.MissionType["扫荡关卡n次"]:
            case cc.pvz.GameConfig.MissionType["购买体力n次"]:
            case cc.pvz.GameConfig.MissionType["通关主线副本n次"]:
            case cc.pvz.GameConfig.MissionType["通过主线章节n"]:
            case cc.pvz.GameConfig.MissionType["击败僵尸n个"]:
            case cc.pvz.GameConfig.MissionType["击败首领n个"]:
                cc.UITask.onCloseUI();
                cc.MainControl.onAutoChangePage(cc.UIPage.Battle);
                break;
            case cc.pvz.GameConfig.MissionType["装备最高等级达到n"]:
            case cc.pvz.GameConfig.MissionType["装备总等级n"]:
            case cc.pvz.GameConfig.MissionType["升级任意装备1次"]:
                cc.UITask.onCloseUI();
                cc.MainControl.onAutoChangePage(cc.UIPage.Tool);
                break;
            default:
                cc.UITask.onCloseUI();
        }
    },
    onClickAchieveReward: function () {
        if (!this.isFinish && this.isCanReward) {
            cc.pvz.PlayerData.updateAchieveData(this.Id, 1);
            cc.popupManager.popup(
                "mainUI",
                "getrewardUI",
                "UIReward",
                {
                    ad: !1,
                    scale: !1
                },
                [this.rewardData],
                cc.pvz.GameConfig.UIFromType["成就"],
                this.rewardBack
            );
            this.initAchieveMissionItem(this.Id, this.rewardBack);
            if (!this.isFinish && this.isCanReward) {
                //
            } else {
                this.node.setSiblingIndex(this.node.parent.childrenCount - 1);
            }
        }
    },
    onClickReward: function () {
        if (!this.isFinish && this.isCanReward) {
            cc.pvz.PlayerData.changeItemNum(this.MissionJson.reward[0], this.MissionJson.reward[1]);
            this.finishRefresh();
            if (this.isDayMission) {
                cc.pvz.PlayerData.finishDayMission(this.MissionJson.func);
            } else {
                cc.pvz.PlayerData.finishWeekMission(this.MissionJson.func);
            }
            if (this.rewardBack) {
                this.rewardBack();
            }
            var e;
            if (this.isDayMission) {
                e = cc.pvz.GameConfig.ItemType["日常任务积分"];
            } else {
                e = cc.pvz.GameConfig.ItemType["周常任务积分"];
            }
            var t = cc.math.randomRangeInt(1, 4);
            cc.popupManager.showEffectFly(e, cc.UITask.scoreLabel.node.convertToWorldSpaceAR(cc.v2()), t);
        }
    }
});
