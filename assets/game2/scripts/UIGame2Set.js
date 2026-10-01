cc.Class({
    extends: cc.Component,
    properties: {
        musicBtn: cc.Node,
        soundBtn: cc.Node
    },
    initBy: function (e) {
        this.ui = e;
        this.musicBtn.children[0].active = !cc.player.isMMute;
        this.musicBtn.children[1].active = cc.player.isMMute;
        this.soundBtn.children[0].active = !cc.player.isSMute;
        this.soundBtn.children[1].active = cc.player.isSMute;
        cc.pvz.TAUtils.trackSystemUI(4);
    },
    onSwitchMusic: function () {
        cc.butler.setMusicSwitch(!cc.player.isMMute);
        this.musicBtn.children[0].active = !cc.player.isMMute;
        this.musicBtn.children[1].active = cc.player.isMMute;
    },
    onSwitchSound: function () {
        cc.butler.setSoundSwitch(!cc.player.isSMute);
        this.soundBtn.children[0].active = !cc.player.isSMute;
        this.soundBtn.children[1].active = cc.player.isSMute;
    },
    onClickQuit: function () {
        cc.director.loadScene("mainUI");
    },
    onCloseUI: function () {
        this.ui.hidePauseMenu();
        cc.popupManager.removePopup(this);
    }
});
