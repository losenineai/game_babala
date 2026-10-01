var i = ["bai_", "lv_", "lan_", "zi_", "cheng_"];
cc.Class({
    extends: cc.Component,
    properties: {
        xys: [cc.Vec2],
        offset: cc.Vec2,
        id: 1,
        id0Type: 0,
        lv: 0,
        lvSp: cc.Sprite,
        bgSp: cc.Sprite,
        hasAd: !1,
        adAni: "",
        adSupOffset: cc.Vec2,
        spine: sp.Skeleton,
        righMargin: 53,
        barPos: {
            default: cc.v2(0, 120)
        },
        attOffset: cc.Vec2
    },
    onLoad: function () {
        this.enabled = !1;
    },
    setSelfListenEvent: function (t) {
        if (t) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
        } else {
            this.node.off(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
        }
    },
    updateLvBlocks: function () {
        if (this.bgSp) {
            cc.pvz.utils.setSpriteFrame(this.bgSp, "uiImage", "gezi/" + i[this.lv] + this.json.lattice2);
        }
        if (this.lvSp) {
            cc.pvz.utils.setSpriteFrame(this.lvSp, "uiImage", "item/" + (this.lv + 1));
        }
        if (this.spine) {
            var t = (this.cantDrag ? "black_" : "stand") + (this.lv + 1);
            this.spine.defaultAnimation = t;
            this.spine.setAnimation(0, t, !0);
        }
    },
    lvup: function (t) {
        if (void 0 === t) {
            t = !0;
        }
        this.lv++;
        this.updateLvBlocks();
        this.checkToUpdateMaxHp();
        if (t) {
            this.showLvupEffect();
        }
    },
    showLvupEffect: function () {
        var t = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.itemRoot.scene.hub.showLvupEffect(t);
    },
    initBy: function (t, e, i) {
        var n = this;
        this.itemRoot = t;
        this.json = this.itemRoot.scene.heroJsonFile.json[this.id - 1];
        this.near6 = !1;
        this.lv = e;
        this.updateLvBlocks();
        if (i) {
            i.forEach(function (t) {
                t.put(n);
            });
            this.myBlocks = i;
            var o = i[0].node.position.add(this.offset);
            this.node.position = o;
            this.node.zIndex = -(o.y + this.spine.node.y);
            this.canUse = !0;
        } else {
            this.myBlocks = [];
            this.canUse = !this.hasAd;
            this.setSelfListenEvent(!0);
            this.setBgSpParent(!0);
        }
        this.hero = null;
        this.angerEff = null;
        this.lineIKBones = [];
    },
    getMaxLv: function () {
        if (cc.pvz.PlayerData.getToolData(this.id).lv >= 5) {
            return 4;
        } else {
            return 3;
        }
    },
    showUnderBuffEffect: function () {
        if (this.buffNode) {
            this.buffNode.active = !0;
        } else {
            var t = this.itemRoot.buffEffect.addNodeTo(this.node, this.spine.position);
            this.buffNode = t;
        }
    },
    hideUnderBuffEffect: function () {
        if (this.buffNode) {
            this.buffNode.active = !1;
        }
    },
    updateLv5Effect: function () {
        this.lv;
    },
    hideLv5Effect: function () {
        if (this.lv5FlagNode) {
            this.lv5FlagNode.active = !1;
        }
    },
    setCanDrag: function (t) {
        if (this.spine) {
            this.spine.setAnimation(0, (t ? "stand" : "black_") + (this.lv + 1), !0);
        } else {
            if (t) {
                this.node.opacity = 255;
            } else {
                this.node.opacity = 100;
            }
        }
        this.cantDrag = !t;
    },
    updatePreviewByPos: function (t, e) {
        if (0 == this.id) {
            return this.itemRoot.blockRoot.testBlock(this, t, e);
        } else {
            return this.itemRoot.blockRoot.testItem(this, t, e);
        }
    },
    lockByAd: function (t) {
        var e = t.addNodeTo(this.node);
        e.getComponent(sp.Skeleton).setAnimation(0, this.adAni, !0);
        cc.find("ad", e).position = this.adSupOffset;
        this.hasAd = !0;
        this.canUse = !1;
    },
    unlockAd: function () {
        if (this.isValid) {
            var t = cc.find("ad", this.node);
            if (t) {
                t.active = !1;
                this.canUse = !0;
            } else {
                cc.pvz.TAUtils.track("error", {
                    message: "unlockAd",
                    stack: "noAdNode, id:" + this.id + ",lv:" + this.lv
                });
            }
        }
    },
    pickupFromBoard: function (t) {
        if (this.cantDrag) {
            //
        } else {
            this.hasMoved = !1;
            this.clickWPos = t;
            this.removeFromBlock();
            this.itemRoot.pickupFromBoard(this, t);
            this.updatePreviewByPos(t);
        }
    },
    onClickBegan: function (t) {
        if (!this.cantDrag) {
            var e = t.getLocation();
            this.hasMoved = !1;
            this.clickWPos = e;
            this.itemRoot.pickup(this, e);
            this.updatePreviewByPos(e);
            this.initSameIDLvLine();
        }
    },
    onClickMoved: function (t) {
        if (this.cantDrag) {
            //
        } else {
            this.hasMoved = !0;
            this.node.position = this.node.parent.convertToNodeSpaceAR(t.getLocation());
            this.updatePreviewByPos(t.getLocation());
            this.updateLineIKBones();
        }
    },
    removeFromBlock: function () {
        this.myBlocks.forEach(function (t) {
            return t.pick();
        });
        this.myBlocks.length = 0;
        if (0 == this.id) {
            this.itemRoot.blockRoot.undoTryPlace(this);
        } else {
            this.hideUnderBuffEffect();
        }
        this.checkToUpdateMaxHp();
    },
    onClickEnded: function (t) {
        var e = this;
        if (!this.cantDrag) {
            if (this.canUse) {
                var i = [];
                if (this.updatePreviewByPos(t.getLocation(), i)) {
                    var n = i[0].node.position.add(this.offset);
                    var o = new Set();
                    i.forEach(function (t) {
                        if (t.item) {
                            o.add(t.item);
                        }
                    });
                    var s = !1;
                    if (0 != this.id && this.lv < this.getMaxLv() && 1 == o.size) {
                        var c = o.values().next().value;
                        if (
                            c.id == this.id &&
                            c.lv == this.lv &&
                            i.every(function (t) {
                                return t.item == c;
                            })
                        ) {
                            s = !0;
                            c.lvup();
                            this.setBgSpParent(!0);
                            this.node.parent = null;
                            this.itemRoot.blockRoot.resetBlocksPreview();
                        }
                    }
                    if (!s) {
                        o.forEach(function (t) {
                            if (t != e) {
                                t.hideLv5Effect();
                                t.removeFromBlock();
                                t.itemRoot.putdown(t, t.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
                            }
                        });
                        i.forEach(function (t) {
                            t.put(e);
                        });
                        this.myBlocks = i;
                        if (0 == this.id) {
                            this.itemRoot.blockRoot.tryPlace(this);
                            var a = this.itemRoot.blockItemsRootNode.convertToWorldSpaceAR(n);
                            this.node.position = this.node.parent.convertToNodeSpaceAR(a);
                        } else {
                            if (-1 == i[0].i) {
                                this.node.parent = i[0].node;
                                this.node.position = cc.Vec2.ZERO;
                            } else {
                                this.node.parent = this.itemRoot.blockItemsRootNode;
                                this.node.position = n;
                                this.node.zIndex = -(n.y + this.spine.node.y);
                            }
                        }
                        this.setSelfListenEvent(!1);
                        this.checkToUpdateMaxHp();
                        if (0 == this.id) {
                            this.itemRoot.blockRoot.resetPosesPreview();
                            6 == cc.pvz.runtimeData.guide && this.itemRoot.scene.startGuide6();
                        } else {
                            this.itemRoot.blockRoot.resetBlocksPreview();
                        }
                    }
                    if (1 == cc.pvz.runtimeData.guide) {
                        if (0 == this.itemRoot.node.childrenCount) {
                            this.itemRoot.scene.startGuide2();
                        } else {
                            this.itemRoot.scene.updateMoveFinger();
                        }
                    }
                    if (3 == cc.pvz.runtimeData.guide) {
                        if (0 == this.itemRoot.node.childrenCount) {
                            this.itemRoot.scene.startGuide4();
                        } else {
                            this.itemRoot.scene.updateMoveFinger();
                        }
                    }
                    if (6 == cc.pvz.runtimeData.guide) {
                        if (0 == this.id) {
                            this.itemRoot.scene.hideMoveFinger();
                        } else {
                            this.itemRoot.scene.updateMoveFinger();
                        }
                    }
                    if (7 == cc.pvz.runtimeData.guide) {
                        if (0 == this.itemRoot.node.childrenCount) {
                            this.itemRoot.scene.startGuide8();
                        } else {
                            this.itemRoot.scene.updateMoveFinger();
                        }
                    }
                } else {
                    this.hideLv5Effect();
                    this.removeFromBlock();
                    this.itemRoot.putdown(this, t.getLocation());
                    if (0 == this.id) {
                        this.itemRoot.blockRoot.resetPosesPreview();
                    } else {
                        this.itemRoot.blockRoot.resetBlocksPreview();
                    }
                    1 == cc.pvz.runtimeData.guide && this.itemRoot.scene.updateMoveFinger();
                    3 == cc.pvz.runtimeData.guide && this.itemRoot.scene.updateMoveFinger();
                    6 == cc.pvz.runtimeData.guide && this.itemRoot.scene.updateMoveFinger();
                    7 == cc.pvz.runtimeData.guide && this.itemRoot.scene.updateMoveFinger();
                }
                if (0 != this.id) {
                    var r = t.getLocation().sub(this.clickWPos);
                    if (Math.abs(r.x) < 16 && Math.abs(r.y) < 16) {
                        cc.popupManager.popup(
                            "game",
                            "plantInfo2",
                            "UIGameToolInfo",
                            {
                                scale: !1
                            },
                            this.id,
                            this.lv
                        );
                    }
                }
                this.hideLines();
                this.itemRoot.layoutChildren();
            } else {
                if (cc.pvz.TAUtils.getSwitchAd()) {
                    this.hideLines();
                    cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["广告格子"], function (i) {
                        if (i) {
                            e.unlockAd();
                            e.onClickEnded(t);
                            e.itemRoot.scene.saveRuntimeData();
                        } else {
                            e.removeFromBlock();
                            e.itemRoot.putdown(e, t.getLocation());
                            if (0 == e.id) {
                                e.itemRoot.blockRoot.resetPosesPreview();
                            } else {
                                e.itemRoot.blockRoot.resetBlocksPreview();
                            }
                        }
                    });
                } else {
                    cc.popupManager.popup(
                        "game",
                        "bagbuyUI",
                        "UIBuyBlock",
                        {
                            scale: !1
                        },
                        this
                    );
                }
            }
        }
    },
    checkToUpdateMaxHp: function () {
        this.itemRoot.scene.onItemChanged();
    },
    initHeroNodes: function () {
        var t = this.hero.node.position.add(this.barPos.mul(0.82));
        if (this.barNode) {
            //
        } else {
            this.barNode = this.barPrefab.addNode(t);
            this.hpBar = cc.find("hp", this.barNode).getComponent(cc.ProgressBar);
            this.cdBar = cc.find("cd", this.barNode).getComponent(cc.ProgressBar);
            this.shieldBar = cc.find("dun", this.barNode).getComponent(cc.ProgressBar);
        }
        this.barNode.active = !0;
        this.barNode.position = t;
        this.hpBar.progress = 1;
        this.shieldBar.progress = 0;
        this.angerEff = null;
        this.lv1 = cc.pvz.PlayerData.getToolData(this.id).lv - 1;
        this.cdMs = 1e3 * this.json.cd;
        this.reloadMs = 1e3 * (Array.isArray(this.json.bulletcd) ? this.json.bulletcd[this.lv1] : this.json.bulletcd);
        if (this.near10 && cc.pvz.runtimeData.hasEnableBuff(1004)) {
            this.cdMs *= 0.8;
        }
        this.hpBar.progress = 1;
        this.shieldBar.progress = 0;
        this.enabled = !0;
        if (3 == this.id || 6 == this.id || 8 == this.id || 10 == this.id) {
            this.inCoolDown = !0;
            this.bulletCount = 0;
            this.cdBar.progress = 0;
            this.startReloadTimer();
        } else {
            this.onReloadReady();
        }
    },
    startHeroLogic: function (t, e) {
        var i = this;
        this.barPrefab = t;
        this.scene = e;
        if (6 == this.id) {
            var n = this.myBlocks[0].i;
            this.crossItems = [];
            this.itemRoot.blockRoot.getCrossItems(this.id, n, function (t) {
                i.crossItems.push(t);
            });
        }
    },
    onReloadReady: function () {
        this.inCoolDown = !1;
        this.cdBar.progress = 1;
        this.reloadT1 = -1;
        this.reloadT2 = -1;
        this.bulletCount = this.json.bullet;
        if (2 == this.id && cc.pvz.runtimeData.hasEnableBuff(203)) {
            this.bulletCount += this.json.bullet / 2;
        }
    },
    onCDReady: function () {
        this.inCoolDown = !1;
    },
    stopHeroLogic: function () {
        if (this.barNode) {
            this.barNode.parent = null;
            this.barNode = null;
        }
        this.enabled = !1;
        if (this.hero.hp <= 0) {
            this.hero.reborn();
            this.hero.showBuffEffect("revive", !0);
        } else {
            if (this.hero.hp < this.maxHp) {
                this.hero.showBuffEffect("HP", !0);
            }
        }
        this.hero.setAnimation(0, "stand", !0, null);
        this.hero.destroy();
        this.hero = null;
    },
    checkToStartReloadTimer: function () {
        if (this.bulletCount <= 0) {
            this.startReloadTimer();
        }
    },
    startReloadTimer: function () {
        var t = this.reloadMs;
        if (this.checkBuff(202)) {
            t /= 2;
        }
        if (this.checkBuff(301)) {
            t *= 0.8;
        }
        if (this.checkBuff(603)) {
            t *= 0.8;
        }
        if (this.checkBuff(801)) {
            t *= 0.8;
        }
        if (this.checkBuff(1003)) {
            t *= 0.8;
        }
        if (this.checkBuff(703)) {
            t *= 0.7;
        }
        if (this.checkBuff(902)) {
            t *= 0.8;
        }
        if (this.checkBuff(1103)) {
            t *= 0.8;
        }
        if (this.checkBuff(1202)) {
            t *= 0.8;
        }
        this.reloadT1 = cc.pvz.time;
        this.reloadT2 = cc.pvz.time + t;
    },
    startAngerMode: function () {
        this.spine.timeScale = 2;
        if (-1 != this.reloadT1) {
            var t = cc.pvz.time - this.reloadT1;
            this.reloadT1 += t / 2;
            this.reloadT2 += t / 2;
        }
        if (this.hero.hp > 0) {
            if (this.angerEff) {
                this.angerEff.node.position = this.hero.node.position;
                this.angerEff.node.active = !0;
            } else {
                var e = this.scene.accBuffPrefab.addNode(this.hero.node.position);
                this.angerEff = e.getComponent(sp.Skeleton);
                this.angerEff.setAnimation(0, "accelerate", !0);
            }
        }
    },
    stopAngerMode: function () {
        this.spine.timeScale = 1;
        if (-1 != this.reloadT1) {
            var t = cc.pvz.time - this.reloadT1;
            this.reloadT1 -= t;
            this.reloadT2 -= t;
        }
        if (this.angerEff) {
            this.angerEff.node.active = !1;
        }
    },
    update: function () {
        if (
            this.hero &&
            !this.hero.scene.timePaused &&
            !this.hero.scene.hasEnded &&
            !(this.hasDie || this.hero.hp <= 0)
        ) {
            var t = this.hero.scene.isAngerPressed;
            if (this.inCoolDown) {
                if (-1 != this.reloadT1) {
                    var e = cc.pvz.time - this.reloadT1;
                    if (t) {
                        e *= 2;
                    }
                    if (this.reloadT1 + e >= this.reloadT2) {
                        this.onReloadReady();
                    } else {
                        this.cdBar.progress = e / (this.reloadT2 - this.reloadT1);
                    }
                }
            } else if (
                this.hero.tryShoot({
                    lv: this.lv
                }) &&
                (this.hero.playSound(),
                (this.inCoolDown = !0),
                (t && 1 != this.json.bullet) ||
                    (this.bulletCount--, (this.cdBar.progress = this.bulletCount / this.json.bullet)),
                this.bulletCount > 0)
            ) {
                var i;
                if (t) {
                    i = this.cdMs / 2;
                } else {
                    i = this.cdMs;
                }
                this.scene.setTimeout(this.onCDReady.bind(this), i);
            }
        }
    },
    getMaxHp: function () {
        var t = cc.pvz.PlayerData.getToolData(this.id).lv;
        var e = this.json.attribute1[t - 1];
        if (this.lv > 0) {
            e *= this.json.fightlvup1[this.lv - 1] / 100;
        }
        e *= 1 + 0.01 * cc.pvz.runtimeData.getBuffValue(1);
        if (this.near6 && cc.pvz.runtimeData.hasEnableBuff(604)) {
            e *= 1.1;
        }
        if (this.checkBuff(402)) {
            e *= 1.3;
        }
        return e;
    },
    updateMaxHp: function () {
        var t = this.getMaxHp();
        var e = t - this.maxHp;
        this.maxHp = t;
        if (this.hero) {
            this.hero.hp += e;
        }
    },
    updateHp: function (t) {
        this.hpBar.progress = t;
    },
    updateShield: function (t) {
        this.shieldBar.progress = t;
        this.scene.updateShield();
    },
    checkBuff: function (t) {
        var e = (t - (t % 100)) / 100;
        return this.id == e && cc.pvz.runtimeData.hasEnableBuff(t);
    },
    initSameIDLvLine: function () {
        var t = this;
        this.setBgSpParent(!0);
        if (0 != this.id && this.lv < this.getMaxLv()) {
            var e = function (e) {
                var i = e.getComponent("Item");
                if (i && i != t && i.id == t.id && i.lv == t.lv) {
                    var n = t.itemRoot.linePrefab
                        .addNodeTo(t.node, t.spine.node.position.add(cc.v2(0, 45)))
                        .getComponent(sp.Skeleton);
                    var o = n.findBone("IK");
                    var s = i.spine.node.convertToWorldSpaceAR(cc.v2(0, 45));
                    t.lineIKBones.push({
                        spine: n,
                        IKBone: o,
                        wPos: s
                    });
                }
            };
            this.lineIKBones.length = 0;
            this.itemRoot.blockItemsRootNode.children.forEach(function (t) {
                return e(t);
            });
            this.itemRoot.node.children.forEach(function (t) {
                return e(t);
            });
            this.updateLineIKBones();
        }
    },
    updateLineIKBones: function () {
        if (0 != this.id) {
            this.lineIKBones.forEach(function (t) {
                var e = t.spine.node.convertToNodeSpaceAR(t.wPos);
                t.IKBone.x = e.x;
                t.IKBone.y = e.y;
            });
        }
    },
    hideLines: function () {
        this.setBgSpParent(!(this.myBlocks.length > 0));
        if (0 != this.id) {
            this.lineIKBones.forEach(function (t) {
                t.spine.node.parent = null;
            });
            this.lineIKBones.length = 0;
        }
    },
    setBgSpParent: function (t) {
        if (this.bgSp) {
            if (t) {
                if (this.bgSp.node.parent != this.node) {
                    this.bgSp.node.zIndex = -1;
                    this.bgSp.node.position = cc.Vec2.ZERO;
                    this.bgSp.node.parent = this.node;
                }
            } else if (this.node.parent && this.bgSp.node.parent == this.node) {
                var e = this.bgSp.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                this.bgSp.node.parent = this.itemRoot.blockRoot.boardItemBgsRoot;
                this.bgSp.node.position = this.bgSp.node.parent.convertToNodeSpaceAR(e);
            }
        }
    }
});
