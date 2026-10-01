cc.Class({
    extends: cc.Component,
    properties: {
        prefab: cc.Node,
        prefabAsset: cc.Prefab,
        clazz: "",
        count: 0,
        root: cc.Node
    },
    onLoad: function () {
        this.init();
        if (cc.hasHackNode) {
            //
        } else {
            cc.hasHackNode = !0;
            cc._BaseNode.prototype._onSetParent = function (e) {
                if (null == e && this.__pool) {
                    this.__poolCounter++;
                    this.__isInPool = !0;
                    this.__pool.put(this);
                }
            };
        }
    },
    onDestroy: function () {
        if (this.hasInit) {
            var e = 0;
            for (var t = this.pool.size(); e < t; e++) {
                this.pool.get().destroy();
            }
        }
    },
    lazyInit: function () {
        if (this.hasInit) {
            //
        } else {
            this.hasInit = !0;
            if (this.prefab) {
                this.prefab.__isInPool = !1;
                this.prefab.active = !1;
                this.prefab.position = cc.Vec2.ZERO;
            }
            if (this.clazz.length > 0) {
                this.pool = new cc.NodePool(this.clazz);
            } else {
                this.pool = new cc.NodePool();
            }
        }
    },
    init: function () {
        if (this.count >= 0) {
            this.lazyInit();
            var e = this.prefab || this.prefabAsset;
            for (var t = 0; t < this.count; t++) {
                var o = cc.instantiate(e);
                o.__poolCounter = 0;
                o.__isInPool = !0;
                o.__pool = this.pool;
                this.pool.put(o);
            }
        }
    },
    newNode: function () {
        this.lazyInit();
        var e = null;
        if (this.pool && this.pool.size() > 0) {
            e = this.pool.get();
        } else {
            (e = cc.instantiate(this.prefab || this.prefabAsset)).__poolCounter = 0;
        }
        e.__isInPool = !1;
        e.__pool = this.pool;
        return e;
    },
    addNodeByWorldPos: function (e) {
        return this.addNode(this.root.convertToNodeSpaceAR(e));
    },
    addNode: function (e) {
        return this.addNodeTo(this.root, e);
    },
    addNodeTo: function (e, t) {
        var o = this.newNode();
        if (t) {
            o.position = t;
        }
        o.parent = e;
        o.active = !0;
        o._calculWorldMatrix();
        return o;
    },
    addEffectNode: function (e, t, o) {
        if (void 0 === o) {
            o = 1;
        }
        var a = this.newNode();
        a.parent = this.root;
        a.active = !0;
        a.getComponent("EffectFly").initEffect(e, t, o);
        a._calculWorldMatrix();
        return a;
    },
    addBattleEffectNode: function (e, t) {
        var o = this.newNode();
        o.parent = this.root;
        o.active = !0;
        o.getComponent("EffectBattleNum").initEffect(e, t);
        o._calculWorldMatrix();
        return o;
    }
});
