cc.Class({
    extends: cc.Component,
    properties: {
        rewardItem: cc.Node,
        nameLabel: cc.Label,
        descLabel: cc.Label
    },
    initBy: function (e, t) {
        if (void 0 === t) {
            t = null;
        }
        this.isLookAd = !1;
        this.rewardData = e;
        this.callBack = t;
        this.rewardItem.getComponent("RewardItem").initRewardItem(this.rewardData, !1);
        this.itemId = this.rewardData.itemId;
        this.toolId = this.rewardData.toolId;
        if (this.itemId === cc.pvz.GameConfig.ItemType["固定碎片"]) {
            var i = cc.JsonControl.getToolJson(this.toolId);
            this.nameLabel.string = i.name;
            this.descLabel.string = i.desc;
        } else {
            var o = cc.JsonControl.getItemJson(this.itemId);
            this.nameLabel.string = o.Name;
            this.descLabel.string = o.Info;
        }
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["道具不足"]);
    },
    onClickBuy: function () {
        var e = this;
        if (this.isLookAd) {
            //
        } else {
            this.isLookAd = !0;
            cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["道具不足"], function (t) {
                e.onAdClose(t);
            });
        }
    },
    onAdClose: function (e) {
        this.isLookAd = !1;
        if (e) {
            if (2 == this.itemId || 3 == this.itemId) {
                cc.pvz.PlayerData.updateAdBuyBankTimes(2 == this.itemId ? 0 : 1);
            } else {
                cc.pvz.PlayerData.updateAdBuyToolTimes(this.toolId);
            }
            cc.popupManager.popup(
                "mainUI",
                "getrewardUI",
                "UIReward",
                {
                    ad: !1,
                    scale: !1
                },
                [this.rewardData],
                cc.pvz.GameConfig.UIFromType["道具不足"],
                this.callBack
            );
            cc.popupManager.removePopup(this);
        }
    },
    onCloseUI: function () {
        if (this.isLookAd) {
            //
        } else {
            cc.popupManager.removePopup(this);
        }
    }
});
