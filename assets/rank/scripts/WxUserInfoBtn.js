cc.Class({
    extends: cc.Component,
    properties: {
        onTap: cc.Component.EventHandler
    },
    start: function () {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.createBtn();
        }
    },
    createBtn: function () {
        var e = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (this.wxBtn) {
                this.setVisible(!0);
            } else {
                var t;
                if (wx.getWindowInfo) {
                    t = wx.getWindowInfo();
                } else {
                    t = wx.getSystemInfoSync();
                }
                var n = cc.view.getViewportRect();
                var c = this.node.getBoundingBoxToWorld();
                var o = cc.view.getScaleX();
                c.x += n.x / o;
                c.y += n.y / o;
                var i = cc.view.getDevicePixelRatio();
                var a = o / i;
                var r = cc.view.getScaleY() / i;
                var s = {
                    type: "text",
                    text: "",
                    style: {
                        left: c.x * a,
                        top: t.windowHeight - (c.y + c.height) * r,
                        width: c.width * a,
                        height: c.height * r,
                        backgroundColor: "#80ff0000",
                        withCredentials: !1
                    }
                };
                var p = wx.createUserInfoButton(s);
                if (this.onTap) {
                    p.onTap(function (t) {
                        e.onTap.emit([t]);
                    });
                }
                this.wxBtn = p;
            }
        } else {
            console.log("create wechat userinfo btn");
        }
    },
    onDestroy: function () {
        if (this.wxBtn) {
            this.wxBtn.destroy();
            this.wxBtn = null;
        }
    },
    setVisible: function (e) {
        if (e) {
            if (this.wxBtn) {
                this.wxBtn.show();
            } else {
                this.createBtn();
            }
        } else {
            if (this.wxBtn) {
                this.wxBtn.hide();
            }
        }
    }
});
