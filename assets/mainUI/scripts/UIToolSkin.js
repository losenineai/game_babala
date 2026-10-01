cc.Class({
    extends: cc.Component,
    properties: {
        skinTipLabl: cc.Label,
        nameLabel: cc.Label,
        spine: sp.Skeleton,
        leftBtn: cc.Node,
        rightBtn: cc.Node
    },
    initBy: function (e) {
        var t = this;
        this.toolId = e;
        this.toolJson = cc.JsonControl.getToolJson(this.toolId);
        this.nameLabel.string = this.toolJson.name;
        this.maxLv = 5;
        var i = cc.pvz.PlayerData.getToolData(this.toolId);
        this.modelIndex = cc.pvz.utils.getLevelInterval(i.lv);
        cc.pvz.utils.useBundleAsset("actors", "kapi/hero" + this.toolId, sp.SkeletonData, function (e) {
            t.spine.skeletonData = e;
            t.showCurPage();
        });
    },
    showCurPage: function () {
        this.leftBtn.active = this.modelIndex > 1;
        this.rightBtn.active = this.modelIndex < this.maxLv;
        this.skinTipLabl.string = cc.pvz.GameConfig.ToolSkinTip.replace("$", this.modelIndex);
        this.spine.setAnimation(0, "stand" + this.modelIndex, !0);
    },
    onClickPage: function (e, t) {
        if (parseInt(t) < 0) {
            this.modelIndex--;
        } else {
            this.modelIndex++;
        }
        this.showCurPage();
    },
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
    }
});
