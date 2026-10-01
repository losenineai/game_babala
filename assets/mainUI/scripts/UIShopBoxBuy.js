cc.Class({
    extends: cc.Component,
    properties: {
        boxAdBtnPanel: cc.Node,
        buyBtn: cc.Node,
        freeBtn: cc.Node,
        nameLabel: cc.Label,
        priceLabel: cc.Label,
        boxSprite: cc.Sprite,
        baseItemNode: cc.Node,
        rewardParent: cc.Node
    },
    initBy: function (e, t, i, o) {
        if (void 0 === i) {
            i = !1;
        }
        if (void 0 === o) {
            o = null;
        }
        this.boxId = e;
        this.shopBoxJson = t;
        this.isCanAdBuy = i;
        this.callBack = o;
        this.price = this.shopBoxJson["consume" + this.boxId];
        this.priceLabel.string = this.price;
        if (1 == this.boxId) {
            this.nameLabel.string = "银色宝箱";
        } else {
            this.nameLabel.string = "黄金宝箱";
        }
        var a;
        if (1 == this.boxId) {
            a = "12";
        } else {
            a = "11";
        }
        cc.pvz.utils.setSpriteFrame(this.boxSprite, "uiImage", "shop/shop" + a);
        this.onCheckBoxAdBtnGray(!this.isCanAdBuy);
        this.onBoxRewardShow();
        if (this.isCanAdBuy && 2 == this.boxId) {
            cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["商店宝箱"]);
        }
    },
    onBoxRewardShow: function () {
        var e = this.shopBoxJson["box" + this.boxId];
        var t = Math.floor(e.length / 2);
        var i = 0;
        this.rewardData = [];
        for (var o = 0; o < t; o++) {
            var a = cc.pvz.utils.getRewardItem(e[i], e[i + 1]);
            this.rewardData.push(a);
            i += 2;
        }
        this.baseItemNode.getComponent("RewardItem").initBoxRewardItem(this.rewardData[0]);
        for (var c = 1; c < t; c++) {
            var s = cc.instantiate(this.baseItemNode);
            s.parent = this.rewardParent;
            s.getComponent("RewardItem").initBoxRewardItem(this.rewardData[c]);
        }
    },
    onCheckBoxAdBtnGray: function (e) {
        if (1 == this.boxId) {
            this.boxAdBtnPanel.active = !1;
            this.freeBtn.active = !e;
            this.buyBtn.active = e;
        } else {
            for (var t = 0; t < this.boxAdBtnPanel.childrenCount; t++) {
                this.boxAdBtnPanel.children[t]
                    .getComponent(cc.Sprite)
                    .setMaterial(0, cc.JsonControl.materialList[e ? 1 : 0]);
            }
            this.freeBtn.active = !1;
        }
    },
    onClickAdBox: function () {
        var e = this;
        if (cc.UIShop.isLookAd) {
            //
        } else {
            if (this.isCanAdBuy) {
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
            cc.popupManager.removePopup(this);
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
            if (cc.pvz.PlayerData.isItemEnough(cc.pvz.GameConfig.ItemType["钻石"], this.price)) {
                cc.pvz.PlayerData.updateShopBoxExp(this.price);
                cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["钻石"], -this.price);
                cc.popupManager.removePopup(this);
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
                    function () {
                        cc.UIShop.onChekBoxLvUp();
                    }
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
    },
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
    }
});
