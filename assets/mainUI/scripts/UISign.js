cc.Class({
    extends: cc.Component,
    properties: {
        signJsonFile: cc.JsonAsset,
        baseSignItem: cc.Node,
        sevenSignItem: cc.Node,
        signPanel: cc.Node,
        signBtnPanel: cc.Node,
        finishBtn: cc.Node
    },
    initBy: function () {
        cc.UISign = this;
        this.signJson = this.signJsonFile.json;
        this.isLookAd = !1;
        cc.pvz.PlayerData.checkAndResetSign();
        this.SignData = cc.pvz.PlayerData.getSignData();
        this.refreshSignBtn();
        this.initUIInfo();
    },
    initUIInfo: function () {
        var e = this;
        this.signItemList = [this.baseSignItem.getComponent("SignItem")];
        for (var t = 0; t < 5; t++) {
            var i = cc.instantiate(this.baseSignItem);
            i.parent = this.signPanel.children[t + 1];
            this.signItemList.push(i.getComponent("SignItem"));
        }
        this.signItemList.push(this.sevenSignItem.getComponent("SignItem"));
        var o = this.SignData.signDay;
        var a = o % 7;
        if (0 == a) {
            this.useSignDay = 7;
        } else {
            this.useSignDay = a;
        }
        var c = function () {
            var t = s + 1;
            var i;
            if (o <= 7) {
                i = t;
            } else {
                i = 100 + t;
            }
            var a = e.signJson.find(function (e) {
                return e.ID == i;
            });
            e.signItemList[s].initSignItem(t, a, e.useSignDay);
        };
        for (var s = 0; s < 7; s++) {
            c();
        }
    },
    refreshSignBtn: function () {
        this.isRewardSign = this.SignData.isReward;
        this.signBtnPanel.active = !this.isRewardSign;
        this.finishBtn.active = this.isRewardSign;
    },
    onSignLogic: function (e) {
        if (void 0 === e) {
            e = !1;
        }
        cc.pvz.PlayerData.finishSignReward();
        this.signItemList[this.useSignDay - 1].onGetSignReward(e);
        this.refreshSignBtn();
    },
    onClickSign: function () {
        if (this.isLookAd) {
            //
        } else {
            if (this.isRewardSign) {
                cc.UIRoot.showToast("今日已签到");
            } else {
                this.onSignLogic(!1);
            }
        }
    },
    onClickSignAd: function () {
        var e = this;
        if (this.isLookAd) {
            //
        } else {
            if (this.isRewardSign) {
                cc.UIRoot.showToast("今日已签到");
            } else {
                (this.isLookAd = !0),
                    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["双倍签到"], function (t) {
                        e.onAdClose(t);
                    });
            }
        }
    },
    onAdClose: function (e) {
        this.isLookAd = !1;
        if (e) {
            this.onSignLogic(!0);
        }
    },
    onClickEndSign: function () {
        cc.popupManager.showToast("今日已签到");
    },
    onCloseUI: function () {
        if (this.isLookAd) {
            //
        } else {
            cc.popupManager.removePopup(this);
        }
    }
});
