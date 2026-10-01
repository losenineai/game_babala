cc.Class({
    extends: cc.Component,
    properties: {
        i: 0,
        dashNode: cc.Node
    },
    onLoad: function () {
        this.bgSp = cc.find("bg", this.node).getComponent(cc.Sprite);
        this.dashNode = cc.find("pos", this.node);
    },
    setRoot: function (t) {
        this.blockRoot = t;
    },
    setPreview: function (t) {
        this.bgSp.node.active = -1 != t || this.item;
        if (this.bgSp.node.active) {
            this.bgSp.spriteFrame = this.blockRoot.blockSpfs[t + 1];
        }
    },
    put: function (t) {
        this.setPreview(-1);
        this.bgSp.node.active = !1;
        if (this.item) {
            cc.warn("2");
        }
        this.item = t;
    },
    pick: function () {
        this.bgSp.node.active = !0;
        this.item = null;
    }
});
