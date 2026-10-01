cc.Class({
    extends: cc.Component,
    initBy: function (t) {
        this.scene = t;
        this.isLookAd = !1;
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["双倍速度"]);
    },
    onClickShare: function () {
        var t = this;
        if (this.isLookAd) {
            //
        } else {
            this.isLookAd = !0;
            cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["双倍速度"], function (e) {
                t.onAdClose(e);
            });
        }
    },
    onAdClose: function (t) {
        this.isLookAd = !1;
        if (t) {
            cc.popupManager.removePopup(this);
            cc.pvz.runtimeData.openSpeed = !0;
            if (1 == cc.pvz.runtimeData.speed) {
                cc.pvz.runtimeData.speed = 2;
            } else {
                cc.pvz.runtimeData.speed = 1;
            }
            this.scene.updateSpeed();
        }
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
    }
});
