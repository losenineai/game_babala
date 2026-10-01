cc.Class({
    extends: cc.Component,
    properties: {
        blockRoot: cc.Node
    },
    initBy: function (t) {
        this.item = t;
        var e = cc.instantiate(t.node);
        e.position = cc.Vec2.ZERO;
        e.parent = this.blockRoot;
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
    },
    onClickAd: function () {
        var t = this;
        cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["广告格子"], function (e) {
            if (e) {
                t.item.unlockAd();
                cc.popupManager.removePopup(t);
            }
        });
    }
});
