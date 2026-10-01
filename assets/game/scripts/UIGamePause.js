cc.Class({
    extends: cc.Component,
    properties: {
        buffJsonFile: cc.JsonAsset,
        buffItemNode: cc.Node,
        buffPanel: cc.Node,
        buffTipPanel: cc.Node,
        buffDescLabel: cc.RichText
    },
    initBy: function () {
        this.buffJson = this.buffJsonFile.json;
        this.buffTipPanel.active = !1;
        this.buffList = cc.pvz.runtimeData.buffs;
        this.tipBuffId = -1;
        if (0 == this.buffList.length) {
            this.buffItemNode.active = !1;
        } else {
            this.initBuffShow();
        }
    },
    getBuffJson: function (t) {
        return this.buffJson.find(function (e) {
            return e.id == t;
        });
    },
    initBuffShow: function () {
        var t = this;
        this.buffItemNode.active = !0;
        this.buffItemNode
            .getComponent("BuffItem")
            .initBuffItem(0, this.getBuffJson(this.buffList[0]), function (e, i, n) {
                t.onShowTipPanel(e, i, n);
            });
        for (var e = 1; e < this.buffList.length; e++) {
            var i = cc.instantiate(this.buffItemNode);
            i.parent = this.buffPanel;
            i.getComponent("BuffItem").initBuffItem(e, this.getBuffJson(this.buffList[e]), function (e, i, n) {
                t.onShowTipPanel(e, i, n);
            });
        }
        this.buffPanel.getComponent(cc.Layout).updateLayout();
    },
    onShowTipPanel: function (t, e, i) {
        if (this.tipBuffId != t) {
            this.tipBuffId = t;
            this.buffTipPanel.active = !0;
            this.buffTipPanel.position = cc.v2(e.x, e.y + 130 + this.buffPanel.parent.position.y);
            this.buffDescLabel.string = i;
        } else {
            this.buffTipPanel.active = !this.buffTipPanel.active;
        }
    },
    onClickHideTip: function () {
        this.buffTipPanel.active = !1;
    },
    onClickSet: function () {
        this.buffTipPanel.active = !1;
        cc.popupManager.popup(
            "mainUI",
            "set",
            "UISet",
            {
                ad: !1,
                scale: !1
            },
            1
        );
    },
    onClickBackToMain: function () {
        this.buffTipPanel.active = !1;
        cc.popupManager.popup("game", "tipUI", "UIBackMainTip", {
            ad: !1,
            scale: !1
        });
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
    }
});
