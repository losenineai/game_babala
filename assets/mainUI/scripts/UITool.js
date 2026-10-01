var $toolCard = require("./ToolCard");
cc.Class({
    extends: cc.Component,
    properties: {
        topTools: cc.Node,
        scrollPanel: cc.ScrollView,
        replaceRoot: cc.Node,
        baseToolCard: cc.Node,
        openPanel: cc.Node,
        openTip: cc.Node,
        line: cc.Node,
        baseLockCard: cc.Node,
        lockPanel: cc.Node,
        replaceItem: $toolCard,
        lockList: [cc.Node],
        lockTops: [cc.Sprite]
    },
    onLoad: function () {
        cc.UITool = this;
        this.scrollPanel.node.active = !0;
        this.replaceRoot.active = !1;
    },
    initBy: function () {
        var e = this;
        cc.pvz.utils.fadeInBtn(this.node);
        this.node.active = !0;
        this.isChangeArray = !1;
        this.refreshLockArrayShow();
        this.initToolItemData();
        if (1 == cc.tempGuideIndex) {
            setTimeout(function () {
                var t = e.topTools.children[0];
                cc.guideManager.showGuide(
                    0,
                    [
                        {
                            tip: "选择练习生",
                            focus: t,
                            btn: "item",
                            y: -200
                        }
                    ],
                    function (e) {
                        if (e) {
                            cc.tempGuideIndex = 2;
                        }
                    }
                );
            });
        }
    },
    refreshLockArrayShow: function () {
        this.stageLevel = cc.pvz.PlayerData.getStageLevel();
        this.lockList[0].active = this.stageLevel <= cc.pvz.GameConfig.ArrayPlaceOpLv[0];
        this.lockList[1].active = this.stageLevel <= cc.pvz.GameConfig.ArrayPlaceOpLv[1];
        this.usePosCount = 6;
        if (this.stageLevel > cc.pvz.GameConfig.ArrayPlaceOpLv[1]) {
            this.usePosCount = 8;
            cc.pvz.utils.setSpriteFrame(this.lockTops[1], "uiImage", "plant/zwdi");
            cc.pvz.utils.setSpriteFrame(this.lockTops[0], "uiImage", "plant/zwdi");
        } else {
            if (this.stageLevel > cc.pvz.GameConfig.ArrayPlaceOpLv[0]) {
                this.usePosCount = 7;
                cc.pvz.utils.setSpriteFrame(this.lockTops[0], "uiImage", "plant/zwdi");
            }
        }
    },
    initToolItemData: function () {
        var e = this;
        this.toPlaceId = -1;
        this.OpenToolList = [];
        this.LockToolList = [];
        this.baseToolCard.active = !1;
        this.baseLockCard.active = !1;
        var t = new Array(8).fill(-1);
        for (var i = 0; i < cc.pvz.GameConfig.MaxToolCount; i++) {
            var o = i + 1;
            if (cc.pvz.GameConfig.ToolLockLevel[i] < this.stageLevel) {
                var a = cc.player.toolData[o].pos;
                if (-1 != a) {
                    t[a] = o;
                } else {
                    this.OpenToolList.push(o);
                }
            } else {
                this.LockToolList.push(o);
            }
        }
        this.baseToolCard.position = cc.Vec2.ZERO;
        this.topTools.children.forEach(function (i, o) {
            var a = cc.find("item", i);
            if (-1 == t[o]) {
                if (a) {
                    a.destroy();
                }
            } else {
                if (!a) {
                    a = cc.instantiate(e.baseToolCard);
                    var c = e.topTools.children[o];
                    cc.find("black", c).active = !1;
                    a.parent = c;
                    a.active = !0;
                }
                a.getComponent("ToolCard").initToolCardItem(e, t[o]);
            }
        });
        this.initOpenToolItem();
        this.initLockToolItem();
    },
    initOpenToolItem: function () {
        var e = this.OpenToolList.length;
        var t = this.openPanel.childrenCount;
        var i = e - t;
        this.openTip.active = e > 0;
        this.openPanel.active = e > 0;
        if (!(e <= 0)) {
            if (i > 0) {
                for (var o = 0; o < t; o++) {
                    var a = this.openPanel.children[o];
                    a.active = !0;
                    a.getComponent("ToolCard").initToolCardItem(this, this.OpenToolList[o]);
                }
                for (var c = t; c < e; c++) {
                    var s = cc.instantiate(this.baseToolCard);
                    s.parent = this.openPanel;
                    s.active = !0;
                    s.getComponent("ToolCard").initToolCardItem(this, this.OpenToolList[c]);
                }
            } else {
                for (var n = 0; n < e; n++) {
                    var r = this.openPanel.children[n];
                    r.active = !0;
                    r.getComponent("ToolCard").initToolCardItem(this, this.OpenToolList[n]);
                }
                for (var h = e; h < t; h++) {
                    this.openPanel.children[h].active = !1;
                }
            }
        }
    },
    initLockToolItem: function () {
        this.line.active = this.LockToolList.length > 0;
        var e = this.LockToolList.length;
        var t = this.lockPanel.childrenCount;
        if (e - t > 0) {
            for (var i = 0; i < t; i++) {
                var o = this.lockPanel.children[i];
                o.active = !0;
                o.getComponent("ToolLockCard").initToolLockCard(this, this.LockToolList[i]);
            }
            for (var a = t; a < e; a++) {
                var c = cc.instantiate(this.baseLockCard);
                c.parent = this.lockPanel;
                c.active = !0;
                c.getComponent("ToolLockCard").initToolLockCard(this, this.LockToolList[a]);
            }
        } else {
            for (var s = 0; s < e; s++) {
                var n = this.lockPanel.children[s];
                n.active = !0;
                n.getComponent("ToolLockCard").initToolLockCard(this, this.LockToolList[s]);
            }
            for (var r = e; r < t; r++) {
                this.lockPanel.children[r].active = !1;
            }
        }
    },
    onCloseUI: function () {
        if (-1 != this.toPlaceId) {
            this.onClickCancelUp();
        }
        this.node.active = !1;
    },
    onClickCard: function (e) {
        var t = this;
        if (-1 == this.toPlaceId) {
            cc.popupManager.popup(
                "mainUI",
                "plantInfo",
                "UIToolInfo",
                {
                    ad: !1,
                    scale: !0
                },
                this,
                e.toolId,
                !1,
                function () {
                    e.onLvUpRefreshCard();
                }
            );
        } else {
            var i = cc.player.toolData[e.toolId].pos;
            if (-1 != i) {
                var o = this.replaceItem.node;
                var a = e.node;
                var c = o.convertToWorldSpaceAR(cc.Vec2.ZERO);
                var s = this.node.convertToNodeSpaceAR(c);
                var n = a.convertToWorldSpaceAR(cc.Vec2.ZERO);
                var r = this.node.convertToNodeSpaceAR(n);
                var h = cc.instantiate(o);
                h.position = s;
                h.parent = this.node;
                h.runAction(
                    cc.sequence(
                        cc.moveTo(0.24, r),
                        cc.destroySelf(),
                        cc.callFunc(function () {
                            t.putOnByPos(i);
                        })
                    )
                );
                this.replaceRoot.active = !1;
            }
        }
    },
    onClickUp: function (e) {
        this.toPlaceId = e.toolId;
        var t = new Set(
            new Array(this.usePosCount).fill(0).map(function (e, t) {
                return t;
            })
        );
        for (var i = 0; i < cc.pvz.GameConfig.MaxToolCount; i++) {
            var o = cc.player.toolData[i + 1].pos;
            if (-1 != o) {
                t.delete(o);
            }
        }
        if (t.size > 0) {
            var a = t.values().next().value;
            this.putOnByPos(a);
            this.openTip.active = this.openPanel.childrenCount > 0;
            this.openPanel.active = this.openPanel.childrenCount > 0;
        } else {
            this.scrollPanel.node.active = !1;
            this.replaceRoot.active = !0;
            this.replaceItem.initToolCardItem(this, e.toolId);
            for (var c = 0; c < this.topTools.childrenCount; c++) {
                var s = this.topTools.children[c];
                if (6 == c && this.stageLevel <= cc.pvz.GameConfig.ArrayPlaceOpLv[0]) {
                    break;
                }
                if (7 == c && this.stageLevel <= cc.pvz.GameConfig.ArrayPlaceOpLv[1]) {
                    break;
                }
                s.getComponent(cc.Animation).play("plantputon");
            }
        }
    },
    onClickCancelUp: function () {
        this.toPlaceId = -1;
        this.scrollPanel.node.active = !0;
        this.replaceRoot.active = !1;
        this.topTools.children.forEach(function (e) {
            return e.getComponent(cc.Animation).stop();
        });
    },
    putDownToolById: function (e) {
        var t = this.topTools.children.find(function (t) {
            var i = cc.find("item", t);
            return i && i.getComponent("ToolCard").toolId == e;
        });
        cc.find("item", t).parent = this.openPanel;
        cc.find("black", t).active = !0;
    },
    putOnByPos: function (e, t) {
        var i = this;
        if (void 0 === t) {
            t = !1;
        }
        if (-1 != this.toPlaceId && (console.log(" change array " + e), !(e >= this.usePosCount))) {
            for (var o = 0; o < cc.pvz.GameConfig.MaxToolCount; o++) {
                if (cc.player.toolData[o + 1].pos == e) {
                    cc.player.toolData[o + 1].pos = -1;
                    this.putDownToolById(o + 1);
                }
            }
            cc.player.toolData[this.toPlaceId].pos = e;
            cc.pvz.PlayerData.onDataChanged();
            var a = this.topTools.children[e];
            if (!t) {
                var c = this.openPanel.children.find(function (e) {
                    return e.getComponent("ToolCard").toolId == i.toPlaceId;
                });
                c.position = cc.Vec2.ZERO;
                c.parent = a;
            }
            cc.find("black", a).active = !1;
            this.onClickCancelUp();
        }
    },
    onClickDown: function (e) {
        cc.player.toolData[e].pos = -1;
        cc.pvz.PlayerData.onDataChanged();
        this.putDownToolById(e);
        this.openTip.active = this.openPanel.childrenCount > 0;
        this.openPanel.active = this.openPanel.childrenCount > 0;
    },
    onClickPlace: function (e, t) {
        var i = parseInt(t);
        this.putOnByPos(i);
    },
    onCardDragEnded: function (e, t) {
        var i = this;
        var o = e.node.getBoundingBoxToWorld();
        var a = this.topTools.getBoundingBoxToWorld();
        if (cc.Intersection.rectRect(o, a)) {
            this.topTools.children.forEach(function (e) {
                if (e.getBoundingBoxToWorld().contains(t)) {
                    var o = cc.find("item", e);
                    if (o) {
                        var a = o.getComponent("ToolCard");
                        var c = cc.player.toolData[a.toolId].pos;
                        return void i.putOnByPos(c);
                    }
                }
            });
        }
    }
});
