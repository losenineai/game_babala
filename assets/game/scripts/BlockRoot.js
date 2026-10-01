var $prefabInfo = require("../../scripts/PrefabInfo");
var $block = require("./Block");
cc.Class({
    extends: cc.Component,
    properties: {
        ui1: cc.Node,
        ui2: cc.Node,
        itemRootNode: cc.Node,
        blockPrefab: $prefabInfo,
        extendModeBg: cc.Node,
        boardsRoot: cc.Node,
        boardItemBgsRoot: cc.Node,
        boardItemsRoot: cc.Node,
        blockSpfs: [cc.SpriteFrame],
        stashEnable: !0,
        stashRoot: cc.Node,
        stashBlock: $block,
        stashRectNode: cc.Node
    },
    onLoad: function () {
        this.itemRoot = this.itemRootNode.getComponent("ItemRoot");
    },
    onEvents: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
    },
    offEvents: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
    },
    startLogic: function () {
        var t = this;
        this.datas = new Array(35).fill(-1);
        cc.pvz.runtimeData.blocks.forEach(function (e) {
            t.datas[e] = 0;
        });
        if (113 == cc.pvz.runtimeData.actBuff2) {
            [0, 1, 3, 4, 5, 9, 25, 29, 30, 31, 33, 34].forEach(function (e) {
                t.datas[e] = 1;
            });
        }
        this.blocks = new Array(35).fill(null);
        this.poses = [];
        this.extendModeBg.children
            .map(function (t) {
                return t;
            })
            .forEach(function (e, i) {
                if (1 == t.datas[i]) {
                    t.poses.push(null);
                    return void (e.parent = null);
                }
                var n = e.getComponent("Pos");
                n.setRoot(t);
                n.i = i;
                t.poses.push(n);
            });
        this.toPutArr = [];
        this.createBlocks();
        cc.pvz.runtimeData.items.forEach(function (e) {
            var i = e.bs.map(function (e) {
                return t.blocks[e];
            });
            var n = t.scene.newEquipItem(e.lv, e.id, i);
            n.node.parent = t.boardItemsRoot;
            n.setBgSpParent(!1);
        });
        this.setExtendMode(!1);
        this.onEvents();
    },
    backFromGame: function () {
        this.poses.forEach(function (t) {
            if (t) {
                t.setPreview(-1);
            }
        });
        this.blocks.forEach(function (t) {
            if (t) {
                t.setPreview(-1);
                if (t.item) {
                    t.item.hideUnderBuffEffect();
                }
            }
        });
        this.setExtendMode(!1);
    },
    onClickBegan: function (t) {
        if (4 != cc.pvz.runtimeData.guide) {
            this.dragBoard = !1;
            this.clickedItem = null;
            if (this.isExtendMode) {
                this.onBoardClickBegan(t);
            } else {
                var e = this.boardsRoot.convertToNodeSpaceAR(t.getLocation());
                var i = Math.floor(e.x / 106 + 0.5);
                var n = 5 * Math.floor(-e.y / 106 + 0.5) + i;
                if (-1 != this.datas[n] && this.blocks[n] && this.blocks[n].item) {
                    this.clickedItem = this.blocks[n].item;
                    this.clickedItem.pickupFromBoard(t.getLocation());
                }
            }
        } else {
            cc.guideManager.onStepFinished();
        }
    },
    onClickMoved: function (t) {
        if (this.dragBoard) {
            this.onBoardClickMoved(t.getDelta());
        } else {
            if (this.clickedItem) {
                this.clickedItem.onClickMoved(t);
            }
        }
    },
    onClickEnded: function (t) {
        if (this.dragBoard) {
            this.onBoardClickEnded();
        } else {
            if (this.clickedItem) {
                this.clickedItem.onClickEnded(t);
                this.clickedItem = null;
            }
        }
    },
    onBoardClickBegan: function (t) {
        var e = this;
        var i = this.boardsRoot.convertToNodeSpaceAR(t.getLocation());
        var n = Math.floor(i.x / 106 + 0.5);
        var o = 5 * Math.floor(-i.y / 106 + 0.5) + n;
        if (-1 != this.datas[o]) {
            this.dragBoard = !0;
            this.dragBoardMoved = cc.Vec2.ZERO;
            this.poses.forEach(function (t) {
                if (t) {
                    t.node.active = !0;
                }
            });
        } else {
            this.toPutArr.forEach(function (i) {
                if (
                    i.myBlocks.some(function (t) {
                        return t.i == o;
                    })
                ) {
                    e.clickedItem = i;
                    e.clickedItem.pickupFromBoard(t.getLocation());
                }
            });
        }
    },
    onBoardClickMoved: function (t) {
        var e = this;
        this.boardsRoot.position = this.boardsRoot.position.add(t);
        this.boardItemBgsRoot.position = this.boardItemsRoot.position.add(t);
        this.boardItemsRoot.position = this.boardItemsRoot.position.add(t);
        this.dragBoardMoved.addSelf(t);
        this.poses.forEach(function (t) {
            if (t) {
                t.setPreview(-1);
            }
        });
        var i = [];
        var n = this.getBlocksToPut(i);
        i.forEach(function (t) {
            if (e.poses[t]) {
                e.poses[t].setPreview(n ? 0 : 1);
            }
        });
    },
    onBoardClickEnded: function () {
        var t = this;
        var e = [];
        var i = this.getBlocksToPut(e);
        e.forEach(function (e) {
            t.poses[e].setPreview(-1);
        });
        if (i) {
            var n = Math.floor(this.dragBoardMoved.x / 106 + 0.5);
            var o = Math.floor(-this.dragBoardMoved.y / 106 + 0.5);
            var s = cc.v2(106 * n, 106 * -o);
            var c = 5 * o + n;
            this.datas.fill(-1);
            this.blocks.fill(null);
            e.forEach(function (e) {
                t.datas[e] = 0;
            });
            var a = this.boardsRoot.children.map(function (t) {
                return t;
            });
            a.sort(function (t, e) {
                return t.i - e.i;
            });
            a.forEach(function (e) {
                e.position = e.position.add(s);
                var i = e.getComponent("Block");
                i.i += c;
                t.blocks[i.i] = i;
            });
            this.boardItemBgsRoot.children.forEach(function (t) {
                t.position = t.position.add(s);
            });
            this.boardItemsRoot.children.forEach(function (t) {
                t.position = t.position.add(s);
            });
        }
        this.dragBoard = !1;
        this.boardsRoot.position = cc.Vec2.ZERO;
        this.boardItemBgsRoot.position = cc.Vec2.ZERO;
        this.boardItemsRoot.position = cc.Vec2.ZERO;
        this.poses.forEach(function (e, i) {
            if (e) {
                e.node.active = -1 == t.datas[i];
            }
        });
    },
    onStashClickBegan: function () {
        this.dragBoard = !1;
        this.clickedItem = null;
    },
    onStashClickMoved: function (t) {
        if (this.dragBoard) {
            //
        } else {
            if (this.clickedItem) {
                this.clickedItem.onClickMoved(t);
            }
        }
    },
    onStashClickEnded: function (t) {
        if (this.dragBoard) {
            //
        } else {
            if (this.clickedItem) {
                this.clickedItem.onClickEnded(t);
                this.clickedItem = null;
            }
        }
    },
    findPosForBlock: function (t) {
        var e = this;
        var i = function () {
            var i = n % 5;
            var o = (n - i) / 5;
            var s = t.xys.map(function (t) {
                return {
                    x: Math.floor(i + t.x),
                    y: Math.floor(o + t.y)
                };
            });
            var c = [];
            var a = !0;
            s.forEach(function (t) {
                var i = t.x;
                var n = t.y;
                if (!(i < 0 || n < 0 || i > 4 || n > 6)) {
                    var o = 5 * n + i;
                    if (e.blocks[o]) {
                        return void (a = !1);
                    } else {
                        return c.push(o), -1 == e.datas[o];
                    }
                }
                a = !1;
            });
            if (
                a &&
                !s.every(function (t) {
                    return e.testCantPlace(5 * t.y + t.x);
                })
            ) {
                return {
                    v: c[0]
                };
            }
        };
        for (var n = 0; n < 35; n++) {
            var o = i();
            if ("object" == typeof o) {
                return o.v;
            }
        }
        return -1;
    },
    findBlockForItem: function (t) {
        var e = this;
        if (0 == t.id) {
            return this.findPosForBlock(t);
        }
        var i = function () {
            var i = n % 5;
            var o = (n - i) / 5;
            var s = [];
            var c = !0;
            t.xys.forEach(function (t) {
                var n = Math.floor(i + t.x);
                var a = Math.floor(o + t.y);
                if (!(n < 0 || a < 0 || n > 4 || a > 6)) {
                    var r = 5 * a + n;
                    if (e.blocks[r]) {
                        if (e.blocks[r].item) {
                            return void (c = !1);
                        } else {
                            return s.push(r), 0 == e.datas[r];
                        }
                    } else {
                        return void (c = !1);
                    }
                }
                c = !1;
            });
            if (c) {
                return {
                    v: s[0]
                };
            }
        };
        for (var n = 0; n < 35; n++) {
            var o = i();
            if ("object" == typeof o) {
                return o.v;
            }
        }
        return -1;
    },
    testItem: function (t, e, i) {
        var n = this;
        if (void 0 === i) {
            i = null;
        }
        var o = [];
        this.blocks.forEach(function (t) {
            if (t) {
                t.setPreview(-1);
                if (t.item) {
                    t.item.hideUnderBuffEffect();
                }
            }
        });
        var s = this.boardsRoot.convertToNodeSpaceAR(e);
        var c = s.x / 106 + 0.5;
        var a = -s.y / 106 + 0.5;
        var r = !0;
        t.xys.forEach(function (t) {
            var e = Math.floor(c + t.x);
            var i = Math.floor(a + t.y);
            if (!(e < 0 || i < 0 || e > 4 || i > 6)) {
                var s = 5 * i + e;
                if (n.blocks[s]) {
                    return o.push(s), 0 == n.datas[s];
                } else {
                    return void (r = !1);
                }
            }
            r = !1;
        });
        o.forEach(function (t) {
            if (i) {
                i.push(n.blocks[t]);
            }
            n.blocks[t].setPreview(r ? 0 : 1);
        });
        if (6 == t.id) {
            var h = Math.floor(c + t.xys[0].x);
            var d = Math.floor(a + t.xys[0].y);
            this.getCrossItems(t.id, 5 * d + h, function (e) {
                e.showUnderBuffEffect(t.id);
            });
        }
        return r;
    },
    testBlock: function (t, e, i) {
        var n = this;
        if (void 0 === i) {
            i = null;
        }
        var o = this.extendModeBg.convertToNodeSpaceAR(e);
        var s = o.x / 106 + 0.5;
        var c = -o.y / 106 + 0.5;
        var a = [];
        var r = !0;
        t.xys.forEach(function (t) {
            var e = Math.floor(s + t.x);
            var i = Math.floor(c + t.y);
            if (!(e < 0 || i < 0 || e > 4 || i > 6)) {
                var o = 5 * i + e;
                if (n.poses[o]) {
                    if (n.blocks[o]) {
                        return void (r = !1);
                    } else {
                        return a.push(o), -1 == n.datas[o];
                    }
                } else {
                    return void (r = !1);
                }
            }
            r = !1;
        });
        this.poses.forEach(function (t) {
            if (t) {
                t.setPreview(-1);
            }
        });
        a.forEach(function (t) {
            if (i) {
                i.push(n.poses[t]);
            }
            n.poses[t].setPreview(r ? 0 : 1);
        });
        return r;
    },
    getBlocksToPut: function (t) {
        var e = this;
        var i = Math.floor(this.dragBoardMoved.x / 106 + 0.5);
        var n = Math.floor(-this.dragBoardMoved.y / 106 + 0.5);
        var o = !0;
        this.datas.forEach(function (s, c) {
            if (0 == s) {
                var a = c % 5;
                var r = a + i;
                var h = (c - a) / 5 + n;
                if (r < 0 || h < 0 || r > 4 || h > 6) {
                    o = !1;
                } else {
                    var d = 5 * h + r;
                    if (e.poses[d]) {
                        if (e.hasTryPlace(d)) {
                            o = !1;
                        } else {
                            t.push(d);
                        }
                    } else {
                        o = !1;
                    }
                }
            }
        });
        return o;
    },
    debug: function () {
        this.blocks.forEach(function (t) {
            if (
                t &&
                t.item &&
                t.item.myBlocks.every(function (e) {
                    return e.i != t.i;
                })
            ) {
                cc.warn("sync 1");
            }
        });
        this.boardItemsRoot.children.forEach(function (t) {
            var e = t.getComponent("Item");
            if (e.myBlocks.length != e.xys.length) {
                cc.warn("sync 2");
            }
            if (
                e.myBlocks.some(function (t) {
                    return t.item != e;
                })
            ) {
                cc.warn("sync 3");
            }
            var i = t.x / 106;
            var n = t.y / 106;
            console.log("(" + i + "," + n + ")");
        });
    },
    getBlockPos: function (t) {
        var e = t % 5;
        var i = (t - e) / 5;
        return cc.v2(106 * e, 106 * -i);
    },
    createBlock: function (t) {
        var e = this.blockPrefab.addNode(this.getBlockPos(t)).getComponent("Block");
        e.setRoot(this);
        e.i = t;
        this.blocks[t] = e;
        this.poses[t].node.active = !1;
        this.poses[t].item = null;
    },
    createBlocks: function () {
        var t = this;
        this.datas.forEach(function (e, i) {
            if (0 == e) {
                t.createBlock(i);
            }
        });
    },
    setExtendMode: function (t) {
        this.extendModeBg.active = t;
        this.ui1.active = !t;
        this.ui2.active = t;
        if (t) {
            if (this.isExtendMode) {
                //
            } else {
                this.toPutArr.length = 0;
            }
        }
        this.isExtendMode = t;
    },
    resetBlocksPreview: function () {
        this.blocks.forEach(function (t) {
            if (t) {
                t.setPreview(-1);
                if (t.item) {
                    t.item.hideUnderBuffEffect();
                    t.item.updateLv5Effect();
                }
            }
        });
    },
    resetPosesPreview: function () {
        this.poses.forEach(function (t) {
            if (t && t.node.active) {
                t.setPreview(-1);
            }
        });
    },
    tryPlace: function (t) {
        if (
            -1 ==
            this.toPutArr.findIndex(function (e) {
                return e == t;
            })
        ) {
            this.toPutArr.push(t);
        }
    },
    undoTryPlace: function (t) {
        var e = this.toPutArr.findIndex(function (e) {
            return e == t;
        });
        if (-1 != e) {
            this.toPutArr.splice(e, 1);
        }
    },
    hasTryPlace: function (t) {
        return this.toPutArr.some(function (e) {
            return e.myBlocks.some(function (e) {
                return e.i == t;
            });
        });
    },
    testCantPlace: function (t) {
        var e = this;
        var i = t % 5;
        var n = (t - i) / 5;
        return [
            {
                x: 0,
                y: -1
            },
            {
                x: 0,
                y: 1
            },
            {
                x: -1,
                y: 0
            },
            {
                x: 1,
                y: 0
            }
        ].every(function (t) {
            var o = t.x + i;
            var s = t.y + n;
            if (o < 0 || s < 0 || o > 4 || s > 6) {
                return !0;
            }
            var c = 5 * s + o;
            return -1 == e.datas[c];
        });
    },
    onClickPlaceEnd: function () {
        var t = this;
        var e = function (e) {
            for (var i = 0; i < e.length; i++) {
                var n = e[i];
                var o = n.myBlocks.map(function (t) {
                    return t.i;
                });
                if (
                    !o.every(function (e) {
                        return t.testCantPlace(e);
                    })
                ) {
                    o.forEach(function (e) {
                        if (t.blocks[e]) {
                            cc.warn("xxx");
                        }
                        t.datas[e] = 0;
                        t.createBlock(e);
                    });
                    n.removeFromBlock();
                    n.node.parent = null;
                    return !0;
                }
            }
            return !1;
        };
        var i = [];
        do {
            i = this.toPutArr.map(function (t) {
                return t;
            });
        } while (e(i));
        i.forEach(function (t) {
            t.removeFromBlock();
            t.itemRoot.putdown(t, t.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        this.setExtendMode(!1);
        this.itemRoot.setCanDrag(!0);
    },
    getCrossItems: function (t, e, i) {
        var n = this;
        if (6 == t) {
            var o = new Set();
            var s = e % 5;
            var c = (e - s) / 5;
            [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1]
            ].forEach(function (t) {
                var e = s + t[0];
                var i = c + t[1];
                if (!(e < 0 || i < 0 || e > 4 || i > 6)) {
                    var a = 5 * i + e;
                    if (n.blocks[a] && n.blocks[a].item) {
                        o.add(n.blocks[a].item);
                    }
                }
            });
            o.forEach(function (t) {
                i(t);
            });
        }
    },
    isFull: function () {
        return this.blocks.every(function (t) {
            return null == t || null != t.item;
        });
    }
});
