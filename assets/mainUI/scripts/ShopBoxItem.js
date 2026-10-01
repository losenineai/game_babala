cc.Class({
    extends: cc.Component,
    properties: {
        boxCdTimes: cc.Label,
        boxCdPanel: cc.Node,
        boxAdBtnPanel: cc.Node,
        boxBuyBtn: cc.Node,
        tipLabel: cc.RichText
    },
    initShopBoxItem: function (e, t, i) {
        if (void 0 === i) {
            i = null;
        }
        this.boxId = e;
        this.shopBoxJson = t;
        this.callBack = i;
        this.price = this.shopBoxJson["consume" + this.boxId];
        this.shopBoxData = cc.pvz.PlayerData.getShopBoxData();
        var o = this.shopBoxData.date[this.boxId - 1];
        var a = Math.floor((Date.now() - o) / 1e3);
        this.ShopBoxCD = cc.pvz.GameConfig.ShopBoxCD[this.boxId - 1];
        if (a >= this.ShopBoxCD) {
            this.boxCdPanel.active = !1;
            this.isCanAdBuy = !0;
            this.onCheckBoxAdBtnGray(!1);
            this.unscheduleAllCallbacks();
        } else {
            this.boxCdPanel.active = !0;
            this.isCanAdBuy = !1;
            this.onCheckBoxAdBtnGray(!0);
            this.lastTime = Math.floor(this.ShopBoxCD - a);
            this.boxCdTimes.string = cc.pvz.utils.formatSeconds3(this.lastTime);
            this.schedule(this.refreshCDTime, 1);
        }
        var c = this.shopBoxJson["box" + this.boxId];
        var s = c[c.length - 2];
        this.tipLabel.string = cc.pvz.GameConfig.BoxTipNames[s - 5];
        var n = Math.floor(c.length / 2);
        var r = 0;
        this.rewardData = [];
        for (var h = 0; h < n; h++) {
            var p = cc.pvz.utils.getRewardItem(c[r], c[r + 1]);
            this.rewardData.push(p);
            r += 2;
        }
    },
    refreshCDTime: function () {
        this.lastTime--;
        this.boxCdTimes.string = cc.pvz.utils.formatSeconds3(this.lastTime);
        if (this.lastTime <= 0) {
            this.boxCdPanel.active = !1;
            this.isCanAdBuy = !0;
            this.onCheckBoxAdBtnGray(!1);
            this.unschedule(this.refreshCDTime, this);
        }
    },
    showBoxCdTime: function () {
        this.boxCdPanel.active = !0;
        this.isCanAdBuy = !1;
        this.onCheckBoxAdBtnGray(!0);
        this.lastTime = this.ShopBoxCD;
        this.boxCdTimes.string = cc.pvz.utils.formatSeconds3(this.lastTime);
        this.schedule(this.refreshCDTime, 1);
    },
    onCheckBoxAdBtnGray: function (e) {
        if (1 == this.boxId) {
            this.boxAdBtnPanel.active = !e;
            this.boxBuyBtn && (this.boxBuyBtn.active = e);
        } else {
            for (var t = 0; t < this.boxAdBtnPanel.childrenCount; t++) {
                this.boxAdBtnPanel.children[t]
                    .getComponent(cc.Sprite)
                    .setMaterial(0, cc.JsonControl.materialList[e ? 1 : 0]);
            }
        }
    },
    onClickBoxInfo: function () {
        var e = this;
        if (cc.UIShop.isLookAd) {
            //
        } else {
            cc.UIShop.onStopShopScroll();
            cc.popupManager.popup(
                "mainUI",
                "shopboxBuy",
                "UIShopBoxBuy",
                {
                    ad: !1,
                    scale: !0
                },
                this.boxId,
                this.shopBoxJson,
                this.isCanAdBuy,
                function () {
                    if (e.callBack) {
                        e.callBack();
                    }
                    e.showBoxCdTime();
                }
            );
        }
    },
    onClickAdBox: function () {
        var e = this;
        if (cc.UIShop.isLookAd) {
            //
        } else {
            if (this.isCanAdBuy) {
                cc.UIShop.onStopShopScroll();
                if (1 == this.boxId) {
                    this.onAdClose(!0);
                } else {
                    (cc.UIShop.isLookAd = !0),
                        cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["商店宝箱"], function (t) {
                            e.onAdClose(t);
                        });
                }
            }
        }
    },
    onAdClose: function (e) {
        cc.UIShop.isLookAd = !1;
        if (e) {
            cc.pvz.PlayerData.updateShopBoxDate(this.boxId, Date.now());
            if (this.isCanAdBuy && 2 == this.boxId) {
                cc.pvz.PlayerData.updateShopBoxExp(this.price);
            }
            this.showBoxCdTime();
            cc.popupManager.popup(
                "mainUI",
                "ShopBoxEft",
                "UIShopBoxReward",
                {
                    ad: !1,
                    scale: !0
                },
                this.boxId,
                this.rewardData,
                this.callBack
            );
        }
    },
    onClickBuyBox: function () {
        if (!cc.UIShop.isLookAd) {
            cc.UIShop.onStopShopScroll();
            if (cc.pvz.PlayerData.isItemEnough(cc.pvz.GameConfig.ItemType["钻石"], this.price)) {
                cc.pvz.PlayerData.updateShopBoxExp(this.price);
                cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["钻石"], -this.price);
                cc.popupManager.popup(
                    "mainUI",
                    "ShopBoxEft",
                    "UIShopBoxReward",
                    {
                        ad: !1,
                        scale: !0
                    },
                    this.boxId,
                    this.rewardData,
                    this.callBack
                );
            } else if (cc.pvz.PlayerData.isHaveAdBuyBankTimes(1)) {
                var e = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["钻石"], 100);
                cc.popupManager.popup(
                    "mainUI",
                    "adbuyUI",
                    "UIAdBuy",
                    {
                        ad: !1,
                        scale: !0
                    },
                    e
                );
            } else {
                cc.popupManager.showToast("钻石不足！");
            }
        }
    }
});
