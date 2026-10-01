cc.Class({
    extends: cc.Component,
    properties: {
        uidLabel: cc.Label,
        root1: cc.Node,
        root2: cc.Node,
        rewardNode: cc.Node,
        wxNode: cc.Node
    },
    initBy: function (e) {
        var t = this;
        this.onCloseCB = e;
        this.preAuth = cc.player.auth;
        this.uidLabel.string = cc.pvz.cloud.uid;
        this.root1.active = !1;
        this.root2.active = !1;
        this.rewardNode.active = 1 != cc.player.auth;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.getSetting({
                success: function (e) {
                    if (!0 === e.authSetting["scope.userInfo"]) {
                        t.root2.active = !0;
                    } else {
                        t.root1.active = !0;
                    }
                }
            });
        } else {
            this.root1.active = this.rewardNode.active;
            this.root2.active = !this.rewardNode.active;
        }
    },
    onClickClose: function () {
        this.wxNode.destroy();
        cc.popupManager.removePopup(this);
        if (this.onCloseCB) {
            this.onCloseCB(1 != this.preAuth && 1 == cc.player.auth);
        }
    },
    onAuthorizeSucc: function () {
        this.root1.active = !1;
        this.root2.active = !0;
        this.rewardNode.active = !1;
        if (1 != cc.player.auth) {
            cc.player.auth = 1;
            var e = cc.pvz.GameConfig.ItemType["钻石"];
            cc.pvz.PlayerData.changeItemNum(e, 100);
            cc.popupManager.showEffectFly(e, cc.MainControl.getItemEffectPos(e), cc.math.randomRangeInt(1, 4));
            cc.MainControl.updateItemInfo();
        }
    },
    onWxAuthorize: function (e) {
        var t = this;
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log(e);
        if (e.userInfo && e.userInfo.avatarUrl && e.userInfo.nickName) {
            cc.pvz.cloud.setAvatar(e.userInfo.nickName, e.userInfo.avatarUrl, function (e) {
                if (e) {
                    t.onAuthorizeSucc();
                } else {
                    cc.popupManager.showToast("授权失败,稍后再试");
                }
            });
        }
    }
});
