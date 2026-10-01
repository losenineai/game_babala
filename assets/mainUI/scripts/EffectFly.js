cc.Class({
    extends: cc.Component,
    properties: {
        coinSpine: sp.Skeleton,
        effectNodeList: [cc.Sprite]
    },
    initEffect: function (e, t, i) {
        var o = this;
        if (void 0 === i) {
            i = 1;
        }
        this.coinSpine.node.active = !0;
        if (this.IKBone) {
            //
        } else {
            this.IKBone = this.coinSpine.findBone("IK");
        }
        var a = this.node.parent.convertToNodeSpaceAR(t);
        this.IKBone.y = a.y;
        this.IKBone.x = a.x;
        var c = cc.JsonControl.getItemJson(e);
        cc.pvz.utils.setSpriteFrames(this.effectNodeList, "uiImage", "item/item" + c.Icon);
        this.coinSpine.setAnimation(0, 1 == i ? "huobi" : "huobi" + i, !1);
        this.coinSpine.setCompleteListener(function () {
            o.node.runAction(cc.removeSelf());
            o.coinSpine.setCompleteListener(null);
        });
    }
});
