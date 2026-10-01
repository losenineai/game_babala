cc.Class({
    extends: cc.Component,
    properties: {},
    initBy: function (t) {
        this.cb = t;
    },
    onClickClose: function () {
        this.cb(!1);
        cc.popupManager.removePopup(this);
    },
    onClickStart: function () {
        this.cb(!0);
        cc.popupManager.removePopup(this);
    }
});
