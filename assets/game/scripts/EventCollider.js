cc.Class({
    extends: cc.Component,
    properties: {
        spine: sp.Skeleton,
        event: "fire",
        collider: cc.Collider
    },
    onLoad: function () {
        var t = this;
        this.collider.enabled = !1;
        this.spine.setEventListener(function (e, i) {
            if (i.data.name == t.event) {
                cc.pvz.utils.manuallyCheckCollider(t.collider);
            }
        });
    }
});
