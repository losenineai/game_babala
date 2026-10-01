cc.Class({
    extends: cc.Component,
    properties: {
        iLabel: cc.Label
    },
    onLoad: function () {
        var t = cc.find("bg", this.node);
        if (t) {
            this.bgSp = t.getComponent(cc.Sprite);
        } else {
            this.bgSp = null;
        }
    },
    setRoot: function (t) {
        this.blockRoot = t;
    },
    setPreview: function (t) {
        this.bgSp.spriteFrame = this.blockRoot.blockSpfs[t + 1];
        this.bgSp.node.active = -1 != t || !this.item;
    },
    put: function (t) {
        this.setPreview(-1);
        this.bgSp.node.active = !1;
        if (this.item) {
            cc.warn("1");
        }
        this.item = t;
    },
    pick: function () {
        this.bgSp.node.active = !0;
        this.bgSp.node.opacity = 125;
        this.item = null;
    },
    update: function () {
        if (this.iLabel) {
            this.iLabel.string = this.i;
        }
    }
});
