cc.Class({
    extends: cc.Component,
    properties: {
        timeLabel: cc.Label
    },
    initBy: function (e) {
        this.ui = e;
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
    },
    onClickAd: function () {
        var e = this;
        cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["无尽火力"], function (t) {
            if (t) {
                e.ui.enterGame2();
                cc.popupManager.removePopup(e);
            }
        });
    },
    update: function () {
        var e = (cc.player.game2t || -1) + 18e5 - Date.now();
        this.timeLabel.string = cc.pvz.utils.formatSeconds2(Math.floor(e / 1e3));
    }
});
