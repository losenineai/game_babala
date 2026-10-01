cc.Class({
    extends: cc.Component,
    properties: {
        countLabel: cc.Label,
        priceLabel: cc.Label,
        finishNode: cc.Node,
        freeNode: cc.Node,
        adPanel: cc.Node,
        adTimesLabel: cc.Label,
        cdTimeLabel: cc.Label
    },
    initShopCoinItem: function (e, t) {
        this.shopId = e;
        this.shopJson = t;
        if (7 == this.shopId) {
            var i = cc.pvz.PlayerData.getShopTimes(cc.pvz.GameConfig.ShopTimesType["金币免费"]);
            this.isFree = 7 == i;
            this.isFinish = i <= 0;
            this.finishNode.active = this.isFinish;
            this.freeNode.active = this.isFree && !this.isFinish;
            this.adPanel.active = !this.isFree && !this.isFinish;
            this.adTimesLabel.string = "(" + i + ")";
            this.cdTimeLabel.node.active = !1;
        } else {
            this.priceLabel.string = this.shopJson.priceNum[0];
        }
        this.count = this.shopJson.num1[0];
        this.countLabel.string = "x" + this.count;
        this.rewardData = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["金币"], this.count);
    },
    onClickBuy: function () {
        var e = this;
        if (!cc.UIShop.isLookAd) {
            cc.UIShop.onStopShopScroll();
            if (7 == this.shopId) {
                if (this.isFinish) {
                    return void cc.popupManager.showToast("已售罄！");
                }
                if (this.isFree) {
                    cc.pvz.PlayerData.updateShopTimes(cc.pvz.GameConfig.ShopTimesType["金币免费"]);
                    cc.UIShop.updateRedTip();
                    cc.popupManager.popup(
                        "mainUI",
                        "getrewardUI",
                        "UIReward",
                        {
                            ad: !1,
                            scale: !1
                        },
                        [this.rewardData],
                        cc.pvz.GameConfig.UIFromType["金币商店"],
                        function () {
                            e.initShopCoinItem(e.shopId, e.shopJson);
                        }
                    );
                } else {
                    cc.UIShop.isLookAd = !0;
                    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["商店金币"], function (t) {
                        e.onAdClose(t);
                    });
                }
            } else {
                cc.popupManager.popup(
                    "mainUI",
                    "shopbuyUI",
                    "UIShopBuy",
                    {
                        ad: !1,
                        scale: !0
                    },
                    this.rewardData,
                    [this.shopJson.priceItem[0], this.shopJson.priceNum[0]],
                    function () {
                        cc.pvz.PlayerData.updateShopTimes(cc.pvz.GameConfig.ShopTimesType["金币免费"]);
                        e.initShopCoinItem(e.shopId, e.shopJson);
                    },
                    !1
                );
            }
        }
    },
    onAdClose: function (e) {
        var t = this;
        cc.UIShop.isLookAd = !1;
        if (e) {
            cc.pvz.PlayerData.updateShopTimes(cc.pvz.GameConfig.ShopTimesType["金币免费"]);
            cc.popupManager.popup(
                "mainUI",
                "getrewardUI",
                "UIReward",
                {
                    ad: !1,
                    scale: !1
                },
                [this.rewardData],
                cc.pvz.GameConfig.UIFromType["金币商店"],
                function () {
                    t.initShopCoinItem(t.shopId, t.shopJson);
                }
            );
        }
    }
});
