cc.Class({
    extends: cc.Component,
    properties: {
        url: ""
    },
    onLoad: function () {
        var e = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            setTimeout(function () {
                e.createBtn();
            });
        }
    },
    createBtn: function () {
        if (cc.popupManager.nonePopupUI()) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                if (this.clubBtn) {
                    this.setVisible(!0);
                } else {
                    var e;
                    if (wx.getWindowInfo) {
                        e = wx.getWindowInfo();
                    } else {
                        e = wx.getSystemInfoSync();
                    }
                    var t = cc.view.getViewportRect();
                    var i = this.node.getBoundingBoxToWorld();
                    var o = cc.view.getScaleX();
                    i.x += t.x / o;
                    i.y += t.y / o;
                    var a = cc.view.getDevicePixelRatio();
                    var c = o / a;
                    var s = cc.view.getScaleY() / a;
                    var n = {
                        type: "image",
                        image: this.url,
                        style: {
                            left: i.x * c,
                            top: e.windowHeight - (i.y + i.height) * s,
                            width: i.width * c,
                            height: i.height * s
                        }
                    };
                    this.clubBtn = wx.createGameClubButton(n);
                    this.clubBtn.show();
                }
            } else {
                console.log("createBtn");
            }
        }
    },
    setVisible: function (e) {
        if (e) {
            if (this.clubBtn) {
                this.clubBtn.show();
            } else {
                this.createBtn();
            }
        } else {
            if (this.clubBtn) {
                this.clubBtn.hide();
            }
        }
    }
});
