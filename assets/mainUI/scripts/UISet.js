cc.Class({
    extends: cc.Component,
    properties: {
        musicBtn: cc.Node,
        soundBtn: cc.Node,
        uidLabel: cc.Label,
        saveNode: cc.Node,
        versionLabel: cc.Label
    },
    initBy: function (e) {
        this.musicBtn.children[0].active = !cc.player.isMMute;
        this.musicBtn.children[1].active = cc.player.isMMute;
        this.soundBtn.children[0].active = !cc.player.isSMute;
        this.soundBtn.children[1].active = cc.player.isSMute;
        this.uidLabel.string = cc.pvz.cloud.uid;
        this.saveNode.active = 0 == e && 1 == cc.player.guide1;
        this.saveNode.parent.getComponent(cc.Layout).updateLayout();
        if (this.versionLabel) {
            this.versionLabel.string = "v" + cc.pvz.GameConst.GAME_VERSION;
        }
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
    onClickSave: function () {
        if (cc.player.guide1 < 1) {
            cc.popupManager.showToast("完成教学后开启");
        } else {
            if (Date.now() - cc.storageTime2 < 6e4) {
                cc.popupManager.showToast("请于1分钟后再上传");
            } else {
                cc.pvz.PlayerData.saveDataToLocalOnline(function (e) {
                    cc.storageTime2 = Date.now();
                    cc.popupManager.showToast(e ? "存档成功" : "存档失败");
                });
            }
        }
    },
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
    }
});
