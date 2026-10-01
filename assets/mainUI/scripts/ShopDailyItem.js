cc.Class({
    extends: cc.Component,
    properties: {
        nameLabel: cc.Label,
        spine: sp.Skeleton,
        qualitySprite: cc.Sprite,
        countLabel: cc.Label,
        priceSprite: cc.Sprite,
        priceLabel: cc.Label,
        finishNode: cc.Node,
        buyPanel: cc.Node,
        discountPanel: cc.Node,
        discountSprite: cc.Sprite,
        freeNode: cc.Node,
        adPanel: cc.Node,
        adTimesLabel: cc.Label,
        cdTimeLabel: cc.Label
    },
    initShopDailyItem: function (e, t) {
        var i = this;
        this.isLookAd = !1;
        this.shopId = e;
        this.shopData = cc.pvz.PlayerData.getShopData(this.shopId);
        this.shopJson = t;
        this.itemId = this.shopData.itemId;
        this.isFinish = this.shopData.buyTimes <= 0;
        this.finishNode.active = this.isFinish;
        if (1 != this.shopId) {
            this.toolId = this.shopData.toolId;
            if (this.itemId === cc.pvz.GameConfig.ItemType["固定碎片"]) {
                var o = cc.JsonControl.getToolJson(this.toolId);
                cc.JsonControl.getQualityBgIcon(this.qualitySprite, o.quality);
                var a = cc.pvz.PlayerData.getToolData(this.toolId);
                var c = cc.pvz.utils.getLevelInterval(a.lv);
                this.spine.node.scale = o.scale;
                cc.pvz.utils.useBundleAsset("actors", "kapi/hero" + this.toolId, sp.SkeletonData, function (e) {
                    i.spine.skeletonData = e;
                    i.spine.setAnimation(0, "stand" + c, !0);
                });
                this.nameLabel.string = o.name;
            }
            this.countLabel.string = "x" + this.shopData.count;
            this.discountPanel.active = this.shopData.discount < 10;
            if (this.shopData.discount < 10) {
                cc.pvz.utils.setSpriteFrame(this.discountSprite, "uiImage", "shop/zhekou" + this.shopData.discount);
            }
            this.buyPanel.active = !this.isFinish;
            this.priceLabel.string = this.shopData.price;
            var s = cc.JsonControl.getItemJson(this.shopData.priceType);
            cc.JsonControl.getItemIcon(this.priceSprite, s.Icon);
            this.rewardData = cc.pvz.utils.getRewardToolItem(this.toolId, this.shopData.count);
        } else {
            this.isFree = 1 == cc.pvz.PlayerData.getShopTimes(cc.pvz.GameConfig.ShopTimesType["钻石免费"]);
            var n = (this.isFree, 100);
            this.countLabel.string = "x" + n;
            this.freeNode.active = this.isFree && !this.isFinish;
            this.adPanel.active = !this.isFree && !this.isFinish;
            this.cdTimeLabel.node.active = !1;
            this.adTimesLabel.string = "(" + this.shopData.buyTimes + ")";
            this.rewardData = cc.pvz.utils.getRewardItem(this.itemId, n);
        }
    },
    onClickInfoBuy: function () {
        var e = this;
        if (cc.UIShop.isLookAd) {
            //
        } else {
            if (this.isFinish) {
                cc.popupManager.showToast("已售罄！");
            } else {
                cc.UIShop.onStopShopScroll(),
                    cc.popupManager.popup(
                        "mainUI",
                        "shopbuyUI",
                        "UIShopBuy",
                        {
                            ad: !1,
                            scale: !0
                        },
                        this.rewardData,
                        [this.shopData.priceType, this.shopData.price],
                        function () {
                            cc.pvz.PlayerData.updateShopDataBuy(e.shopId, 1);
                            e.initShopDailyItem(e.shopId, e.shopJson);
                        },
                        !0
                    );
            }
        }
    },
    onClickBuy: function () {
        var e = this;
        if (!cc.UIShop.isLookAd) {
            if (this.isFinish) {
                cc.popupManager.showToast("已售罄！");
            } else if ((cc.UIShop.onStopShopScroll(), 1 == this.shopId)) {
                if (this.isFree) {
                    cc.pvz.PlayerData.updateShopTimes(cc.pvz.GameConfig.ShopTimesType["钻石免费"]);
                    cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["每日商店购买n次物品"], 1);
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
                        function () {
                            e.initShopDailyItem(e.shopId, e.shopJson);
                            cc.UIShop.updateRedTip();
                        }
                    );
                } else {
                    cc.UIShop.isLookAd = !0;
                    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["商店钻石"], function (t) {
                        e.onAdClose(t);
                    });
                }
            } else if (cc.pvz.PlayerData.isItemEnough(this.shopData.priceType, this.shopData.price)) {
                cc.pvz.PlayerData.updateShopDataBuy(this.shopId, 1);
                cc.pvz.PlayerData.changeItemNum(this.shopData.priceType, -this.shopData.price);
                cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["每日商店购买n次物品"], 1);
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
                    function () {
                        e.initShopDailyItem(e.shopId, e.shopJson);
                    }
                );
            } else {
                var t = 2 == this.shopData.priceType;
                if (cc.pvz.PlayerData.isHaveAdBuyBankTimes(t ? 0 : 1)) {
                    var i = cc.pvz.utils.getRewardItem(this.shopData.priceType, t ? 2500 : 100);
                    cc.popupManager.popup(
                        "mainUI",
                        "adbuyUI",
                        "UIAdBuy",
                        {
                            ad: !1,
                            scale: !0
                        },
                        i
                    );
                } else {
                    var o;
                    if (2 == this.shopData.priceType) {
                        o = "金币";
                    } else {
                        o = "钻石";
                    }
                    cc.popupManager.showToast(o + "不足！");
                }
            }
        }
    },
    onAdClose: function (e) {
        var t = this;
        cc.UIShop.isLookAd = !1;
        if (e) {
            cc.pvz.PlayerData.updateShopDataBuy(this.shopId, 1);
            cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["每日商店购买n次物品"], 1);
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
                function () {
                    t.initShopDailyItem(t.shopId, t.shopJson);
                }
            );
        }
    }
});
