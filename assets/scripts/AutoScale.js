cc.Class({
    extends: cc.Component,
    onLoad: function () {
        this.initBy(this.usingInitSize ? this.w : this.node.width, this.usingInitSize ? this.h : this.node.height);
    },
    setNodeSize: function (e, t) {
        this.usingInitSize = !0;
        this.w = e;
        this.h = t;
    },
    initBy: function (e, t) {
        var o = Math.min(cc.view.getCanvasSize().width / e, cc.view.getCanvasSize().height / t);
        var a = e * o;
        var n = t * o;
        this.node.scale = Math.max(cc.view.getCanvasSize().width / a, cc.view.getCanvasSize().height / n);
    }
});
