cc.Class({
    extends: cc.Component,
    properties: {
        bgSpine: sp.Skeleton,
        tiSpine: sp.Skeleton,
        waveLabel: cc.Label,
        batterWaveTip: cc.Node,
        coinCountLabel: cc.Label,
        bgNode: cc.Node,
        infoPanel: cc.Node
    },
    initBy: function (e) {
        var t = this;
        this.scene = e;
        this.bgNode.active = !1;
        this.infoPanel.active = !1;
        this.bgSpine.setAnimation(0, "", !1);
        cc.pvz.utils.spineFromTo(this.bgSpine, "jieshu1_2", "jieshu2_2");
        cc.pvz.utils.spineFromTo(this.tiSpine, "jieshu1_1", "jieshu2_1", !0, function () {
            t.bgNode.active = !0;
            t.infoPanel.active = !0;
        });
        var n = cc.pvz.runtimeData.wave;
        this.waveLabel.string = "" + n;
        this.coinCountLabel.string = "x" + 50 * n;
        if (cc.pvz.runtimeData.wave > 0 && cc.pvz.runtimeData.wave > cc.tmpScore) {
            cc.tmpScore = cc.pvz.runtimeData.wave;
            cc.tmpNewRecord = !0;
            this.batterWaveTip.active = !0;
            var c = -1;
            var o = [];
            var i = [];
            cc.pvz.runtimeData.items.forEach(function (e) {
                if (99 != e.id) {
                    if (e.lv > c) {
                        c = e.lv;
                        o.length = 0;
                    }
                    o.push(e.id);
                    i.push(e.id);
                    i.push(e.lv);
                }
            });
            var a = "" + o[cc.math.randomRangeInt(0, o.length)];
            cc.pvz.cloud.uploadScore(n, a, i, function () {});
        } else {
            this.batterWaveTip.active = !1;
        }
        cc.butler.resumeDirector(1);
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["关卡结算"]);
    },
    addCoinAndClose: function (e) {
        var t;
        if (e) {
            t = 100 * cc.pvz.runtimeData.wave;
        } else {
            t = 50 * cc.pvz.runtimeData.wave;
        }
        cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["金币"], t);
        if (e) {
            cc.popupManager.removePopup(this);
            var n = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["金币"], t);
            cc.popupManager.popup(
                "mainUI",
                "getrewardUI",
                "UIReward",
                {
                    ad: !1,
                    scale: !1
                },
                [n],
                cc.pvz.GameConfig.UIFromType["双倍结算"],
                function () {
                    cc.popupManager.removeAllPopups();
                    cc.pvz.runtimeData.removeData();
                    cc.director.loadScene("mainUI");
                }
            );
        } else {
            cc.butler.playEffectAsync("game", "sound/getCoin");
            cc.popupManager.removeAllPopups();
            cc.pvz.runtimeData.removeData();
            cc.director.loadScene("mainUI");
        }
    },
    onClickClose: function () {
        this.addCoinAndClose(!1);
    },
    onClickAd: function () {
        var e = this;
        if (this.isLookAd) {
            //
        } else {
            this.isLookAd = !0;
            cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["关卡结算"], function (t) {
                e.isLookAd = !1;
                if (t) {
                    e.addCoinAndClose(!0);
                }
            });
        }
    }
});
