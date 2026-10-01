cc.Class({
    extends: cc.Component,
    properties: {
        panel: cc.Node,
        actLevelList: [cc.Node]
    },
    onLoad: function () {
        cc.UIActLevel = this;
    },
    initBy: function () {
        cc.pvz.utils.fadeInBtn(this.node);
        this.node.active = !0;
        this.panel.scale = Math.min(1.4, this.node.width / 720);
        this.initActItemList();
    },
    initActItemList: function () {
        this.actLevelList[0].getComponent("ActLevelItem").initActLevelItem(0);
    },
    onCloseUI: function () {
        this.node.active = !1;
    },
    onClickOther: function () {
        cc.popupManager.showToast("即将开启...");
    }
});
