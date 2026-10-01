cc.Class({
    extends: cc.Component,
    properties: {
        btnSprite: cc.Sprite,
        gettedNode: cc.Node
    },
    initBy: function () {
        cc.pvz.PlayerData.checkAndResetShare();
        var e = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["金币"], 2e3);
        var t = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["钻石"], 25);
        var i = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["随机蓝色碎片"], 6);
        this.rewardList = [e, t, i];
        this.gettedNode.active = cc.player.isShare;
    },
    onClickShare: function () {
        var e = this;
        if (cc.player.isShare) {
            cc.pvz.TAUtils.share(-1, function () {
                cc.popupManager.showToast("分享成功");
            });
        } else {
            cc.pvz.TAUtils.share(0, function (t) {
                if (t) {
                    if (cc.player.isShare) {
                        //
                    } else {
                        cc.pvz.PlayerData.finishShare();
                        cc.popupManager.popup(
                            "mainUI",
                            "getrewardUI",
                            "UIReward",
                            {
                                ad: !0,
                                scale: !1
                            },
                            e.rewardList,
                            cc.pvz.GameConfig.UIFromType["分享奖励"],
                            function () {
                                cc.MainControl.updateItemInfo();
                                cc.RedControl.refreshAllRedTip();
                                cc.popupManager.removePopup(e);
                            }
                        );
                    }
                }
            });
        }
    },
    onCloseUI: function () {
        cc.MainControl.updateItemInfo();
        cc.RedControl.refreshAllRedTip();
        cc.popupManager.removePopup(this);
    }
});
