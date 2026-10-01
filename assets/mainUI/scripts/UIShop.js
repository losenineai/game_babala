var i = cc.Class({
    name: "ShopData",
    properties: {
        itemId: 1,
        count: 1,
        toolId: -1,
        buyTimes: 0,
        priceType: 2,
        price: 1,
        discount: 1
    }
});
cc.Class({
    extends: cc.Component,
    properties: {
        shopJsonFile: cc.JsonAsset,
        shopBoxJsonFile: cc.JsonAsset,
        shopDailyPanel: cc.Node,
        refreshTimesLabel: cc.Label,
        shopCoinList: [cc.Node],
        boxLvLabel: cc.Label,
        boxLvBar: cc.ProgressBar,
        boxLvProgress: cc.Label,
        boxItemList: [cc.Node],
        scrollPanel: cc.ScrollView,
        redTips: [cc.Node]
    },
    onClickRefresh: function () {
        var e = this;
        if (this.isLookAd) {
            //
        } else {
            if (this.refreshTimes <= 0) {
                cc.popupManager.showToast("刷新次数不足！");
            } else {
                this.onStopShopScroll(),
                    (this.isLookAd = !0),
                    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["商店刷新"], function (t) {
                        e.onAdClose(t);
                    });
            }
        }
    },
    onAdClose: function (e) {
        this.isLookAd = !1;
        if (e) {
            cc.pvz.PlayerData.updateShopTimes(cc.pvz.GameConfig.ShopTimesType["商店刷新"]);
            this.refreshTimes = cc.pvz.PlayerData.getShopTimes(cc.pvz.GameConfig.ShopTimesType["商店刷新"]);
            this.refreshTimesLabel.string = this.refreshTimes;
            this.initShopDailyData(!0);
        }
    },
    onClickShopBoxTip: function () {
        if (this.isLookAd) {
            //
        } else {
            this.onStopShopScroll();
            cc.popupManager.popup(
                "mainUI",
                "shopboxTip",
                "UIShopBoxTip",
                {
                    ad: !1,
                    scale: !0
                },
                this.shopBoxData.lv,
                this.shopBoxJson
            );
        }
    },
    onLoad: function () {
        cc.UIShop = this;
        this.isLookAd = !1;
        this.shopJson = this.shopJsonFile.json;
        this.shopBoxJson = this.shopBoxJsonFile.json;
    },
    start: function () {
        this.scrollPanel.node.scale = Math.min(1.4, this.node.width / 720);
        this.scrollPanel.node.height /= this.scrollPanel.node.scale;
    },
    updateRedTip: function () {
        this.redTips[0].active = 1 == cc.pvz.PlayerData.getShopTimes(cc.pvz.GameConfig.ShopTimesType["钻石免费"]);
        this.redTips[1].active = 7 == cc.pvz.PlayerData.getShopTimes(cc.pvz.GameConfig.ShopTimesType["金币免费"]);
    },
    initBy: function () {
        cc.pvz.utils.fadeInBtn(this.node);
        this.node.active = !0;
        this.stageLevel = cc.pvz.PlayerData.getStageLevel();
        cc.pvz.PlayerData.checkAndResetShop();
        this.refreshTimes = cc.pvz.PlayerData.getShopTimes(cc.pvz.GameConfig.ShopTimesType["商店刷新"]);
        this.refreshTimesLabel.string = this.refreshTimes;
        if (cc.pvz.PlayerData.isNewShopStatus()) {
            this.initShopDailyData(!1);
        } else {
            this.refreshShopUI();
        }
        this.updateRedTip();
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["商店刷新"]);
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["商店宝箱"]);
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["商店钻石"]);
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["商店金币"]);
    },
    onStopShopScroll: function () {
        this.scrollPanel.stopAutoScroll();
    },
    onShopToCoin: function () {
        this.scrollPanel.scrollToBottom(0.1);
    },
    onShopToDiamond: function () {
        this.scrollPanel.scrollToTop(0.1);
    },
    initShopDailyData: function (e) {
        if (void 0 === e) {
            e = !1;
        }
        for (var t = e ? 1 : 0; t < 6; t++) {
            var o = t + 1;
            var a = this.shopJson[t];
            var c;
            if (1 == o) {
                c = 0;
            } else {
                c = cc.pvz.utils.randomWeightIndex(a.wgt);
            }
            var s = a.item[c];
            if (this.stageLevel < 5 && 7 == s) {
                c = cc.pvz.utils.randomWeightIndex([a.wgt[0], a.wgt[1]]);
                s = a.item[c];
            }
            var n = a["num" + (c + 1)];
            var r = n[cc.pvz.utils.randomWeightIndex(n)];
            var h = 10;
            if (a.discountWgt.length > 0) {
                h = a.discount[cc.pvz.utils.randomWeightIndex(a.discountWgt)];
            }
            var p = a.priceNum[c] * r * (h / 10);
            var l = new i();
            l.count = r;
            l.buyTimes = a.buyNum[0];
            l.priceType = a.priceItem[0];
            l.discount = h;
            l.price = Math.ceil(p);
            if (s >= 5 && s <= 7) {
                l.itemId = cc.pvz.GameConfig.ItemType["固定碎片"];
                l.toolId = this.onGetRandomTool(s);
            } else {
                l.itemId = s;
                l.toolId = -1;
            }
            if (e) {
                cc.pvz.PlayerData.setShopData(o, l);
            } else {
                cc.pvz.PlayerData.addShopData(o, l);
            }
        }
        if (e) {
            this.refreshDailyUI();
        } else {
            cc.pvz.PlayerData.changeShopStatus();
            this.refreshShopUI();
        }
    },
    onGetRandomTool: function (e) {
        var t = cc.JsonControl.getItemJson(e);
        var i = cc.pvz.utils.getOpenToolList(t.Quality);
        return i[cc.math.randomRangeInt(0, i.length)];
    },
    refreshShopUI: function () {
        this.refreshDailyUI();
        this.initShopBoxUI();
        this.initCoinShopUI();
    },
    refreshDailyUI: function () {
        for (var e = 0; e < 6; e++) {
            var t = e + 1;
            this.shopDailyPanel.children[e].getComponent("ShopDailyItem").initShopDailyItem(t, this.shopJson[e]);
        }
    },
    initShopBoxUI: function () {
        var e = this;
        this.shopBoxData = cc.pvz.PlayerData.getShopBoxData();
        this.shopBoxLvJson = this.shopBoxJson[this.shopBoxData.lv - 1];
        this.boxLvLabel.string = "" + this.shopBoxData.lv;
        if (cc.player.shopBoxData.lv >= 10) {
            this.boxLvProgress.string = "已满级";
            this.boxLvBar.progress = 1;
        } else {
            this.boxLvProgress.string = this.shopBoxData.exp + "/" + this.shopBoxLvJson.exp;
            this.boxLvBar.progress = this.shopBoxData.exp / this.shopBoxLvJson.exp;
        }
        for (var t = 0; t < this.boxItemList.length; t++) {
            this.boxItemList[t].getComponent("ShopBoxItem").initShopBoxItem(t + 1, this.shopBoxLvJson, function () {
                e.onChekBoxLvUp();
            });
        }
    },
    onChekBoxLvUp: function () {
        if (!(cc.player.shopBoxData.lv >= 10)) {
            this.shopBoxData = cc.pvz.PlayerData.getShopBoxData();
            this.shopBoxLvJson = this.shopBoxJson[this.shopBoxData.lv - 1];
            var e = this.shopBoxData.exp - this.shopBoxLvJson.exp;
            if (e >= 0) {
                cc.pvz.PlayerData.updateShopBoxlV(1, e);
                this.initShopBoxUI();
                cc.popupManager.popup(
                    "mainUI",
                    "shopboxlveft",
                    "UIShopBoxLvUp",
                    {
                        ad: !1,
                        scale: !0
                    },
                    this.shopBoxData.lv,
                    this.shopBoxJson
                );
            }
            this.boxLvLabel.string = "" + this.shopBoxData.lv;
            if (cc.player.shopBoxData.lv >= 10) {
                this.boxLvProgress.string = "已满级";
                this.boxLvBar.progress = 1;
            } else {
                this.boxLvProgress.string = this.shopBoxData.exp + "/" + this.shopBoxLvJson.exp;
                this.boxLvBar.progress = this.shopBoxData.exp / this.shopBoxLvJson.exp;
            }
        }
    },
    initCoinShopUI: function () {
        for (var e = 0; e < 3; e++) {
            var t = e + 7;
            this.shopCoinList[e].getComponent("ShopCoinItem").initShopCoinItem(t, this.shopJson[t - 1]);
        }
    },
    onCloseUI: function () {
        this.node.active = !1;
    }
});
