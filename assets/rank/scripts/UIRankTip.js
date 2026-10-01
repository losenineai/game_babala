cc.Class({
    extends: cc.Component,
    properties: {},
    onClickClose: function () {
        cc.popupManager.removePopup(this);
    }
});
