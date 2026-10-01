cc.Class({
    extends: cc.Component,
    properties: {},
    initBy: function (t) {
        this.cb = t;
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["死亡复活"]);
    },
    onClickClose: function () {
        this.cb(!1);
        cc.popupManager.removePopup(this);
    },
    onClickAd: function () {
        var t = this;
        cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["死亡复活"], function (e) {
            if (e) {
                t.cb(!0);
                cc.popupManager.removePopup(t);
            }
        });
    }
});
