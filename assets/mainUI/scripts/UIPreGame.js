cc.Class({
    extends: cc.Component,
    properties: {
        lvLabel: cc.Label
    },
    initBy: function (e) {
        this.closeCb = e;
    },
    onClickStart: function () {
        cc.popupManager.removePopup(this);
        cc.pvz.runtimeData.initByPreData();
        cc.director.loadScene("game1");
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
        cc.pvz.runtimeData.removeData();
        if (this.closeCb) {
            this.closeCb();
        }
    }
});
