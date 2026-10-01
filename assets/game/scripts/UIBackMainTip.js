cc.Class({
    extends: cc.Component,
    properties: {},
    initBy: function () {},
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
    },
    onClickBackToMain: function () {
        cc.popupManager.removeAllPopups();
        cc.pvz.runtimeData.removeData();
        cc.director.loadScene("mainUI");
    }
});
