var $prefabInfo = require("./PrefabInfo");
cc.Class({
    extends: cc.Component,
    properties: {
        default_sprite_splash: cc.SpriteFrame,
        onPopup1st: cc.Component.EventHandler,
        onAllClosed: cc.Component.EventHandler,
        taskToastPrfefab: $prefabInfo,
        toastPrefab: $prefabInfo,
        effectPrefab: $prefabInfo,
        effectBattlePrefab: $prefabInfo,
        adToastNode: cc.Node
    },
    onLoad: function () {
        cc.popupManager = this;
        if (this.adToastNode) {
            this.adToastNode.active = !1;
            this.adToastNode.zIndex = cc.macro.MAX_ZINDEX - 2;
        }
        this.popups = [];
        this.showModals = [];
        this.isAutoPop = !1;
    },
    nonePopupUI: function () {
        return !this.modal || !this.modal.active;
    },
    createModal: function () {
        if (!this.modal) {
            var e = new cc.Node();
            e.width = 4 * this.node.width;
            e.height = 4 * this.node.height;
            e.color = cc.Color.BLACK;
            e.opacity = 230;
            e.addComponent(cc.BlockInputEvents);
            var t = e.addComponent(cc.Sprite);
            t.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            t.spriteFrame = this.default_sprite_splash;
            this.modal = e;
            this.modal.parent = this.node;
        }
    },
    onAllPopupClosed: function () {
        if (this.modal) {
            this.modal.active = !1;
        }
        if (this.onAllClosed) {
            this.onAllClosed.emit();
        }
    },
    removeAllPopups: function () {
        this.popups.forEach(function (e) {
            e.node.destroy();
        });
        this.popups = [];
        this.showModals = [];
        cc.pvz.AdUtils.hideAdBanner();
        this.onAllPopupClosed();
    },
    popup: function (e, t, o, a) {
        var n = this;
        var i = a.ad;
        var c = void 0 === i || i;
        var s = a.scale;
        var r = void 0 === s || s;
        var l = a.adLeft;
        var u = void 0 !== l && l;
        var p = a.showModal;
        var d = void 0 === p || p;
        var h = a.opacity;
        var f;
        if (void 0 === h) {
            f = 225;
        } else {
            f = h;
        }
        var g = a.usingTop;
        var v = void 0 !== g && g;
        var y = arguments.length;
        var m = new Array(y > 4 ? y - 4 : 0);
        for (var C = 4; C < y; C++) {
            m[C - 4] = arguments[C];
        }
        if (this.popups.length > 0 && this.popups[this.popups.length - 1].onPopupUI) {
            this.popups[this.popups.length - 1].onPopupUI();
        }
        if (this.nonePopupUI()) {
            this.createModal();
            this.modal.active = !0;
            if (this.onPopup1st) {
                this.onPopup1st.emit();
            }
        }
        if (
            d ||
            this.showModals.some(function (e) {
                return e;
            })
        ) {
            var w;
            if (d) {
                w = this.popups.length;
            } else {
                w = this.showModals.findIndex(function (e) {
                    return e;
                });
            }
            this.createModal();
            this.modal.opacity = f;
            this.modal.zIndex = 2 * w + 1;
        } else {
            if (this.modal) {
                this.modal.opacity = 0;
            }
        }
        this.showModals.push(d);
        if (c) {
            this.popups.every(function (e) {
                return !e.__showAd;
            });
        }
        if (v) {
            cc.main2.setUsingTopInfo();
        }
        cc.pvz.utils.useBundleAsset(e, t, cc.Prefab, function (e) {
            var t = cc.instantiate(e);
            var a = t.getComponent(o);
            t.parent = n.node;
            t.zIndex = 2 * n.popups.length + 2;
            if (r) {
                t.scale = 0.5;
                t.runAction(
                    cc.sequence(
                        cc.scaleTo(0.5, 1).easing(cc.easeElasticOut(3)),
                        cc.callFunc(function () {
                            if (a.showFinish) {
                                a.showFinish.apply(a);
                            }
                        }, n)
                    )
                );
            } else {
                t.runAction(
                    cc.sequence(
                        cc.delayTime(0.032),
                        cc.callFunc(function () {
                            if (a.showFinish) {
                                a.showFinish.apply(a);
                            }
                        }, n)
                    )
                );
            }
            a.__showAd = c;
            a.__showAdAlignLeft = u;
            n.popups.push(a);
            if (a.initBy) {
                a.initBy.apply(a, m);
            }
            if (cc.director.isPaused()) {
                t.parent.sortAllChildren();
            }
        });
    },
    removePopup: function (e) {
        var t = this.popups.findIndex(function (t) {
            return t == e;
        });
        if (-1 != t) {
            if (-1 != t) {
                this.popups.splice(t, 1);
                this.showModals.splice(t, 1);
                if (t > 0 && this.popups[t - 1].onPopupClosed) {
                    this.popups[t - 1].onPopupClosed();
                }
                var o = -1;
                for (var a = this.showModals.length; --a >= 0; ) {
                    if (this.showModals[a]) {
                        o = a;
                        break;
                    }
                }
                if (-1 !== o) {
                    this.createModal();
                    this.modal.opacity = 210;
                    this.modal.zIndex = 2 * o + 1;
                } else {
                    if (this.modal) {
                        this.modal.active = !1;
                    }
                }
            }
            if (e.__showAd) {
                for (var n = this.popups.length - 1; n >= 0 && !this.popups[n].__showAd; n--) {}
            }
            e.node.destroy();
            if (this.nonePopupUI()) {
                this.onAllPopupClosed();
            }
            if (cc.director.isPaused()) {
                this.node.sortAllChildren();
            }
        }
    },
    showTaskToast: function (e) {
        var t = this.taskToastPrfefab.addNode();
        t.opacity = 255;
        t.zIndex = cc.macro.MAX_ZINDEX - 3;
        t.runAction(cc.sequence(cc.delayTime(1.2), cc.fadeOut(0.4), cc.removeSelf()));
        cc.find("tip", t).getComponent(cc.Label).string = e;
    },
    showToast: function (e) {
        var t = this.toastPrefab.addNode();
        t.y = 0;
        t.opacity = 255;
        t.zIndex = cc.macro.MAX_ZINDEX - 3;
        t.runAction(cc.sequence(cc.moveBy(0.3, 0, 80), cc.delayTime(0.8), cc.fadeOut(0.3), cc.removeSelf()));
        cc.find("tip", t).getComponent(cc.Label).string = e;
    },
    showEffectFly: function (e, t, o) {
        if (void 0 === o) {
            o = 1;
        }
        this.effectPrefab.addEffectNode(e, t, o).zIndex = cc.macro.MAX_ZINDEX;
    },
    showBattleEffect: function (e, t) {
        var o = this.effectBattlePrefab.addBattleEffectNode(e, t);
        o.y = -200;
        o.x = 0;
        o.zIndex = cc.macro.MAX_ZINDEX - 3;
        o.runAction(cc.sequence(cc.delayTime(2.5), cc.removeSelf()));
    },
    showAdToast: function (e) {
        this.adToastNode.active = 2 != e;
        if (this.adToastNode.active) {
            cc.find("blockTouch", this.adToastNode).active = 0 == e;
            cc.find("tip", this.adToastNode).getComponent(cc.Label).string = [
                "拉取广告中...",
                "看完广告才有奖励",
                null,
                "广告加载失败"
            ][e];
            this.adToastNode.y = 0;
            this.adToastNode.opacity = 255;
            this.adToastNode.stopAllActions();
            if (0 != e) {
                this.adToastNode.runAction(cc.sequence(cc.moveBy(0.3, 0, 80), cc.delayTime(0.8), cc.fadeOut(0.3)));
            }
        }
    }
});
