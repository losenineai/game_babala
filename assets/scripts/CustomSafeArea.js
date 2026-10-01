var o = cc.Enum({
    WIN: 0,
    PARENT: 1,
    CANVAS: 2
});
cc.Class({
    extends: cc.SafeArea,
    properties: {
        fitTarget: {
            type: o,
            default: o.WIN
        },
        ensureLeft: !0,
        ensureRight: !0,
        ensureTop: !0,
        ensureBottom: !0,
        top: 0
    },
    updateArea: function () {
        var e = this.getComponent(cc.Widget);
        if (e) {
            e.updateAlignment();
            this.node.position;
            this.node.getAnchorPoint();
            var t = 0;
            var a = 0;
            switch (this.fitTarget) {
                case o.WIN:
                    t = cc.winSize.width;
                    a = cc.winSize.height;
                    break;
                case o.PARENT:
                    t = this.node.parent.width;
                    a = this.node.parent.height;
                    break;
                case o.CANVAS:
                    t = cc.view.getCanvasSize().width;
                    a = cc.view.getCanvasSize().height;
            }
            var n = cc.sys.getSafeAreaRect();
            if (this.ensureLeft) {
                e.isAlignLeft = !0;
                if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                    var i;
                    if (wx.getWindowInfo) {
                        i = wx.getWindowInfo();
                    } else {
                        i = wx.getSystemInfoSync();
                    }
                    if (i.safeArea) {
                        e.left = (1600 * i.safeArea.left) / i.screenWidth;
                    } else {
                        e.left = 0;
                    }
                } else {
                    e.left = 0;
                }
                console.log("ensureLeft:", e.left);
            }
            if (this.ensureRight) {
                e.isAlignRight = !0;
                e.right = t - n.x - n.width;
                console.log("ensureRight:", e.right);
            }
            if (this.ensureTop) {
                e.isAlignTop = !0;
                e.top = a - n.y - n.height + this.top;
                console.log("ensureTop:", e.top);
            }
            if (this.ensureBottom) {
                e.isAlignBottom = !0;
                e.bottom = n.y;
                console.log("ensureBottom:", e.bottom);
            }
            e.updateAlignment();
            cc._widgetManager.add(e);
        }
    }
});
