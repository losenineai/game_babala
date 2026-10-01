var $prefabInfo = require("../../scripts/PrefabInfo");
cc.Class({
    extends: cc.Component,
    properties: {
        dragingRoot: cc.Node,
        blockRootNode: cc.Node,
        blockItemsRootNode: cc.Node,
        buffEffect: $prefabInfo,
        barPrefab: $prefabInfo,
        linePrefab: $prefabInfo
    },
    onLoad: function () {
        this.blockRoot = this.blockRootNode.getComponent("BlockRoot");
        this.blockItemsRootNode.zIndex = cc.macro.MAX_ZINDEX - 1;
    },
    layoutChildren: function () {
        var t = this.node.getComponent(cc.Layout);
        t.spacingX = -1;
        if (this.node.childrenCount > 1) {
            var e = this.node.children.reduce(function (t, e) {
                return t + e.width;
            }, 0);
            if (e > 720) {
                var i = Math.max(0.8, 720 / e);
                this.node.children.forEach(function (t) {
                    return (t.scale = i);
                });
                t.spacingX = 0;
            } else {
                t.spacingX = Math.min(30, (720 - e) / (this.node.childrenCount - 1));
            }
        } else {
            t.spacingX = 15;
        }
        t.updateLayout();
    },
    setCanDrag: function (t) {
        this.node.children.forEach(function (e) {
            var i = e.getComponent("Item");
            if (i && 0 != i.id) {
                i.setCanDrag(t);
            }
        });
        this.blockItemsRootNode.children.forEach(function (e) {
            var i = e.getComponent("Item");
            if (i && 0 != i.id) {
                i.setCanDrag(t);
            }
        });
    },
    pickupFromBoard: function (t, e) {
        var i = this.dragingRoot;
        var n = i.convertToNodeSpaceAR(e);
        t.node.position = n;
        t.node.angle = 0;
        t.node.parent = i;
        cc.Tween.stopAllByTarget(t.node);
        t.initSameIDLvLine();
    },
    pickup: function (t, e) {
        var i = this.dragingRoot;
        var n = i.convertToNodeSpaceAR(e);
        t.node.position = n;
        t.node.angle = 0;
        t.node.parent = i;
        t.node.scale = 1;
        cc.Tween.stopAllByTarget(t.node);
        var o = 0 == t.id;
        this.blockRoot.setExtendMode(o);
        if (o) {
            this.setCanDrag(!1);
        }
    },
    putdown: function (t, e) {
        var i = this.node.convertToNodeSpaceAR(e);
        t.setBgSpParent(!0);
        if (t.canUse && 0 != t.id && t.lv < 3 && i.y < 100) {
            for (var n = 0; n < this.node.childrenCount; n++) {
                var o = this.node.children[n];
                if (i.x > o.x - o.width / 2 && i.x < o.x + o.width / 2) {
                    var s = o.getComponent("Item");
                    if (s.canUse && s.id == t.id && s.lv == t.lv) {
                        t.node.parent = null;
                        this.layoutChildren();
                        return void s.lvup();
                    }
                }
            }
        }
        t.node.parent = this.node;
        t.node.position = i;
        t.setSelfListenEvent(!0);
        var c = this.node.children.findIndex(function (e) {
            return e.x > t.node.x;
        });
        if (-1 == c) {
            c = this.node.childrenCount;
        } else {
            c = c;
        }
        for (var a = 0; a < c; a++) {
            this.node.children[a].zIndex = -1;
        }
        for (var r = c; r < this.node.childrenCount; r++) {
            this.node.children[r].zIndex = 1;
        }
        t.node.zIndex = 0;
        this.node.sortAllChildren();
        this.layoutChildren();
        cc.tween(t.node)
            .to(0.16, {
                y: 0
            })
            .start();
    }
});
