cc.Class({
    extends: cc.Component,
    properties: {
        spine: sp.Skeleton,
        typeSprite: cc.Sprite,
        lockTip: cc.Label
    },
    initToolLockCard: function (e, t) {
        var i = this;
        this.ui = e;
        this.toolId = t;
        var o = cc.JsonControl.getToolJson(this.toolId);
        this.spine.node.scale = o.scale;
        cc.pvz.utils.useBundleAsset("actors", "kapi/hero" + this.toolId, sp.SkeletonData, function (e) {
            i.spine.skeletonData = e;
            i.spine.setAnimation(0, "stand1", !0);
        });
        cc.JsonControl.getToolTypeIcon(this.typeSprite, o.lattice);
        this.lockTip.string = cc.pvz.GameConfig.ToolLockTip.replace(
            "$",
            cc.pvz.GameConfig.ToolLockLevel[this.toolId - 1]
        );
    },
    onClickCard: function () {
        cc.popupManager.popup(
            "mainUI",
            "plantInfo",
            "UIToolInfo",
            {
                ad: !1,
                scale: !0
            },
            this.ui,
            this.toolId,
            !0
        );
    }
});
