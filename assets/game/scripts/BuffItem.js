cc.Class({
    extends: cc.Component,
    properties: {
        qualitySp: cc.Sprite,
        iconSp: cc.Sprite
    },
    initBuffItem: function (t, e, i) {
        this.index = t;
        this.buffJson = e;
        this.callBack = i;
        cc.pvz.utils.setSpriteFrame(this.qualitySp, "uiImage", "item/pz_" + this.buffJson.quality);
        cc.pvz.utils.setSpriteFrame(this.iconSp, "uiImage", "skill/skill" + this.buffJson.icon);
    },
    onClickBuff: function () {
        var t = this.node.parent.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2()));
        if (this.callBack) {
            this.callBack(this.index, t, this.buffJson.desc);
        }
    }
});
