cc.Class({
    extends: cc.Component,
    properties: {
        spine: sp.Skeleton,
        focusNode: cc.Node,
        fingerSpine: sp.Skeleton,
        guideNode: cc.Node,
        guideLabel: cc.Label
    },
    onLoad: function () {
        var e = this;
        cc.guideManager = this;
        if (this.guideNode) {
            this.guideNode.active = !1;
        }
        this.hackButton();
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function (t) {
            e.node.parent = t;
        });
    },
    isGuiding: function () {
        return this.guideNode.active;
    },
    showGuide: function (e, t, o) {
        var a = this;
        var n = -1;
        !(function e() {
            if (++n >= t.length) {
                a.hideGuideDialog();
                a.guideConfig = null;
                o && o(!0);
            } else {
                var i = t[n];
                a.showGuideDialog(i, e);
                if (o) {
                    o(!1, n);
                }
            }
        })();
    },
    showGuideDialog: function (e, t) {
        var o = this;
        this.guideConfig = {
            btn: e.btn,
            r: e.r,
            cb: t
        };
        this.guideNode.zIndex = cc.macro.MAX_ZINDEX;
        this.guideNode.active = !0;
        if (e.y) {
            this.spine.node.y = e.y;
        } else {
            if (e.t) {
                this.spine.node.y = 200;
            } else {
                this.spine.node.y = 0;
            }
        }
        this.spine.setAnimation(0, e.r ? "jiaoxue1_R" : "jiaoxue1", !1);
        this.spine.setCompleteListener(function () {
            o.spine.setAnimation(0, e.r ? "jiaoxue2_R" : "jiaoxue2", !0);
            o.spine.setCompleteListener(null);
        });
        this.guideLabel.string = e.tip;
        this.guideLabel.node.stopAllActions();
        this.guideLabel.node.opacity = 0;
        this.guideLabel.node.runAction(cc.fadeIn(0.5));
        var a;
        if (e.focus) {
            a = e.focus.getBoundingBoxToWorld();
        } else {
            a = cc.rect();
        }
        var n = this.guideNode.parent.convertToNodeSpaceAR(a.center);
        this.focusNode.active = !0;
        this.focusNode.x = n.x;
        this.focusNode.y = n.y;
        this.focusNode.width = this.focusNode.height = 0;
        this.focusNode.opacity = 255;
        cc.tween(this.focusNode)
            .to(0.5, {
                width: a.width,
                height: a.height
            })
            .start();
        this.fingerSpine.node.active = !e.hideFinger;
        if (this.fingerSpine.node.active) {
            this.fingerSpine.setAnimation(0, e.fingerAni || "dianji", !0);
        }
    },
    hideGuideDialog: function () {
        var e = this;
        this.spine.setAnimation(0, this.guideConfig.r ? "jiaoxue3_R" : "jiaoxue3", !1);
        this.spine.setCompleteListener(function () {
            e.guideNode.active = !1;
            e.spine.setCompleteListener(null);
        });
        this.guideLabel.node.runAction(cc.fadeOut(0.2));
        this.focusNode.width = 0;
        this.focusNode.height = 0;
        this.focusNode.active = !1;
        this.fingerSpine.node.active = !1;
    },
    guideLogAndCheckBtnClick: function (e) {
        if (this.guideConfig && this.guideConfig.btn == e) {
            this.onStepFinished();
        }
    },
    onStepFinished: function () {
        if (this.guideConfig && this.guideConfig.cb) {
            this.guideConfig.cb();
        }
    },
    onClickGuide: function () {
        console.log("onClickGuide");
        if (this.guideConfig) {
            if (this.guideConfig.btn) {
                //
            } else {
                this.onStepFinished();
            }
        }
    },
    hackButton: function () {
        if (!cc.hasHackButton) {
            cc.hasHackButton = !0;
            var e = cc.Button.prototype._onTouchEnded;
            cc.Button.prototype._onTouchEnded = function (t) {
                if (this.interactable && this.enabledInHierarchy && this._pressed) {
                    cc.guideManager.guideLogAndCheckBtnClick(this.node.name);
                }
                e.call(this, t);
            };
        }
    }
});
