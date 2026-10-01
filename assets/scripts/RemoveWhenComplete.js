cc.Class({
    extends: cc.Component,
    properties: {
        spine: sp.Skeleton,
        fixedScale: !0
    },
    onLoad: function () {
        var e = this;
        this.spine.setCompleteListener(function () {
            e.node.parent = null;
        });
    }
});
