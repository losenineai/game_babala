cc.Class({
    extends: cc.Component,
    properties: {
        waveLabel: cc.Label,
        bgSpine: sp.Skeleton,
        tiSpine: sp.Skeleton,
        onAniEndedNodes: [cc.Node],
        coinNode: cc.Node
    },
    initBy: function (e) {
        var i = this;
        this.isWin = e;
        if (e) {
            this.waveLabel.string = cc.pvz.runtimeData.wave + 1;
        } else {
            this.waveLabel.string = cc.pvz.runtimeData.wave - 1;
        }
        this.onAniEndedNodes.forEach(function (e) {
            return (e.active = !1);
        });
        this.coinNode.active = !1;
        this.bgSpine.setAnimation(0, "", !1);
        if (e) {
            cc.pvz.utils.spineFromTo(this.bgSpine, "shengli1_2", "shengli2_2");
            cc.pvz.utils.spineFromTo(this.tiSpine, "shengli1_1", "shengli2_1", !0, function () {
                i.coinNode.active = !0;
                i.onAniEndedNodes.forEach(function (e) {
                    return (e.active = !0);
                });
            });
        } else {
            cc.pvz.utils.spineFromTo(this.bgSpine, "shibai1_2", "shibai2_2");
            cc.pvz.utils.spineFromTo(this.tiSpine, "shibai1_1", "shibai2_1", !0, function () {
                i.onAniEndedNodes.forEach(function (e) {
                    return (e.active = !0);
                });
            });
        }
    },
    onClickClose: function () {
        if (this.isWin) {
            cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["金币"], 200);
            cc.butler.playEffectAsync("game", "sound/getCoin");
        }
        cc.popupManager.removeAllPopups();
        cc.director.loadScene("mainUI");
    }
});
