cc.Class({
    extends: cc.Component,
    properties: {
        rewardItem: cc.Node,
        nameLabel: cc.Label,
        priceType: cc.Sprite,
        priceLabel: cc.Label,
        descLabel: cc.Label
    },
    initBy: function (e, t, i, o) {
        if (void 0 === o) {
            o = !0;
        }
        this.rewardData = e;
        this.priceData = t;
        this.callBack = i;
        this.isDailyShop = o;
        this.priceLabel.string = this.priceData[1];
        var a = cc.JsonControl.getItemJson(this.priceData[0]);
        cc.JsonControl.getItemIcon(this.priceType, a.Icon);
        this.rewardItem.getComponent("RewardItem").initRewardItem(this.rewardData, !1);
        this.itemId = this.rewardData.itemId;
        this.toolId = this.rewardData.toolId;
        if (this.itemId === cc.pvz.GameConfig.ItemType["固定碎片"]) {
            var c = cc.JsonControl.getToolJson(this.toolId);
            this.nameLabel.string = c.name;
            this.descLabel.string = c.desc;
        } else {
            var s = cc.JsonControl.getItemJson(this.itemId);
            this.nameLabel.string = s.Name;
            this.descLabel.string = s.Info;
        }
    },
    onClickBuy: function () {
        if (cc.pvz.PlayerData.isItemEnough(this.priceData[0], this.priceData[1])) {
            cc.pvz.PlayerData.changeItemNum(this.priceData[0], -this.priceData[1]);
            this.isDailyShop &&
                (cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["每日商店购买n次物品"], 1),
                cc.RedControl.onCheckBattleRed());
            cc.popupManager.popup(
                "mainUI",
                "getrewardUI",
                "UIReward",
                {
                    ad: !1,
                    scale: !1
                },
                [this.rewardData],
                cc.pvz.GameConfig.UIFromType["每日商店"],
                this.callBack
            );
            cc.popupManager.removePopup(this);
        } else {
            var e = 2 == this.priceData[0];
            if (cc.pvz.PlayerData.isHaveAdBuyBankTimes(e ? 0 : 1)) {
                var t = cc.pvz.utils.getRewardItem(this.priceData[0], e ? 2500 : 100);
                cc.popupManager.popup(
                    "mainUI",
                    "adbuyUI",
                    "UIAdBuy",
                    {
                        ad: !1,
                        scale: !0
                    },
                    t
                );
                cc.popupManager.removePopup(this);
            } else {
                var i;
                if (2 == this.priceData[0]) {
                    i = "金币";
                } else {
                    i = "钻石";
                }
                cc.popupManager.showToast(i + "不足！");
            }
        }
    },
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
    }
});
