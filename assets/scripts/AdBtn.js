cc.Class({
    extends: cc.Component,
    properties: {
        icon: cc.Sprite
    },
    start: function () {
        cc.butler.node.on("ad", this.onAdTimes, this);
        this.updateIcon();
    },
    onAdTimes: function () {
        this.updateIcon();
    },
    updateIcon: function () {
        var e = 10 == cc.player.adTimes;
        cc.pvz.utils.setSpriteFrame(this.icon, "uiImage", e ? "public/ad2" : "public/ad");
    }
});
