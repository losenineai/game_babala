cc.Class({
    extends: cc.Component,
    properties: {
        addCount: 30,
        countTipNode: cc.Node,
        countLabel: cc.Label
    },
    initBy: function (t) {
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["阳光"]);
        this.countTipNode.active = 2 == cc.pvz.runtimeData.mode;
        if (this.countTipNode.active) {
            this.countLabel.string = cc.pvz.runtimeData.buyCoinCount;
        }
        this.cb = t;
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
    },
    onClickAd: function () {
        var t = this;
        cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["阳光"], function (e) {
            if (e) {
                if (2 == cc.pvz.runtimeData.mode) {
                    cc.pvz.runtimeData.buyCoinCount--;
                }
                cc.pvz.runtimeData.addMoney(t.addCount);
                if (t.cb) {
                    t.cb();
                }
                cc.popupManager.removePopup(t);
            }
        });
    }
});
