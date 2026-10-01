cc.Class({
    extends: cc.Component,
    properties: {
        buyTimesLabel: [cc.Label],
        priceLabel: cc.Label
    },
    initBy: function (e) {
        this.fromType = e;
        this.isLookAd = !1;
        cc.pvz.PlayerData.checkAndResetPowetBuy();
        this.refreshUIInfo();
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["体力购买"]);
    },
    refreshUIInfo: function () {
        for (var e = 0; e < 2; e++) {
            this.buyTimesLabel[e].string = cc.pvz.GameConfig.PowerBuyTip.replace(
                "$",
                cc.pvz.PlayerData.getPowerBuyTimes(0 == e)
            );
        }
        var t = 3 - cc.pvz.PlayerData.getPowerBuyTimes(!1);
        if (t < 0) {
            t = 0;
        } else {
            if (t >= 3) {
                t = 2;
            } else {
                t = t;
            }
        }
        this.diamondPrice = cc.pvz.GameConfig.PowerBuyPrices[t];
        this.priceLabel.string = "x" + this.diamondPrice;
    },
    onClickAdBuy: function () {
        var e = this;
        if (cc.pvz.PlayerData.getPowerBuyTimes(!0) <= 0) {
            cc.popupManager.showToast("今日免费次数已用完");
        } else {
            if (this.isLookAd) {
                //
            } else {
                this.isLookAd = !0;
                cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["体力购买"], function (t) {
                    e.onAdClose(t);
                });
            }
        }
    },
    onAdClose: function (e) {
        this.isLookAd = !1;
        if (e) {
            cc.pvz.PlayerData.updatePowerBuyTimes(!0, 1);
            this.refreshUIInfo();
            this.refreshAddPower(10);
        }
    },
    onClickDiamondBuy: function () {
        if (cc.pvz.PlayerData.getPowerBuyTimes(!1) <= 0) {
            cc.popupManager.showToast("今日购买次数已用完");
        } else {
            if (cc.pvz.PlayerData.isItemEnough(cc.pvz.GameConfig.ItemType["钻石"], this.diamondPrice)) {
                cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["钻石"], -this.diamondPrice),
                    cc.pvz.PlayerData.updatePowerBuyTimes(!1, 1),
                    this.refreshUIInfo(),
                    this.refreshAddPower(15);
            } else {
                cc.popupManager.showToast("钻石不足！");
            }
        }
    },
    refreshAddPower: function (e) {
        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["购买体力n次"], 1);
        cc.pvz.PlayerData.addPower(e, !0);
        if (this.fromType == cc.pvz.GameConfig.UIFromType["挑战副本"]) {
            cc.UIActLevelInfo.updateItemInfo();
            cc.UIActLevelInfo.checkPowerInfo();
        }
        cc.MainControl.updateItemInfo();
        cc.MainControl.checkPowerInfo();
        cc.popupManager.showEffectFly(
            cc.pvz.GameConfig.ItemType["体力"],
            cc.MainControl.getItemEffectPos(cc.pvz.GameConfig.ItemType["体力"])
        );
        cc.butler.playEffect(cc.MainControl.rewardSound);
        cc.RedControl.onCheckBattleRed();
        cc.RedControl.onCheckMissionRed();
    },
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
    }
});
