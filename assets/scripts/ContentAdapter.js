cc.Class({
    extends: cc.Component,
    onLoad: function () {
        var e = Math.min(
            cc.view.getCanvasSize().width / this.node.width,
            cc.view.getCanvasSize().height / this.node.height
        );
        var t = this.node.width * e;
        var o = this.node.height * e;
        this.node.width = this.node.width * (cc.view.getCanvasSize().width / t);
        this.node.height = this.node.height * (cc.view.getCanvasSize().height / o);
    }
});
