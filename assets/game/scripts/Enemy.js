var i = cc.Class({
    name: "SubEnemyConfig",
    properties: {
        subNode: cc.Node,
        opAni: "qishen",
        hpRate: 1,
        atkRate: 1
    }
});
cc.Class({
    extends: cc.Component,
    properties: {
        spine: sp.Skeleton,
        spinePre: "",
        spineEx: "",
        showChuChang: !0,
        speed: {
            default: 80,
            tooltip: "每秒移动距离: y"
        },
        attRange: {
            default: 100,
            tooltip: "攻击距离: x"
        },
        attCD: {
            default: 2e3,
            tooltip: "攻击间隔: 毫秒"
        },
        centerY: 50,
        exp: 10,
        zdSpine: sp.Skeleton,
        zdIsIKMode: !1,
        subEnemys: [i],
        hpBarPos: cc.Vec2
    },
    onLoad: function () {
        this.moveSpeed = cc.v2(-this.speed, 0);
        if (this.zdSpine) {
            this.zdSpine.node.active = !1;
        }
        this.subEnemys.forEach(function (t) {
            return (t.subNode.active = !1);
        });
    },
    start: function () { },
    initBy: function (t, e, i, n) {
        this.scene = t;
        this.bulletsRoot = e;
        this.hp = this.maxHp = i;
        this.atk = n;
        this.hpBar = null;
        this.inBuff12 = !1;
        this.slowTimer = -1;
        this.slowNode = null;
        this.poisonNode = null;
        this.poisonInfos = [];
        this.iceTimer = -1;
        this.iceNode1 = null;
        this.iceNode2 = null;
        this.weakTimer = -1;
        this.weakNode = null;
        this.attRangeRR = this.attRange * this.attRange;
        switch (cc.pvz.runtimeData.actBuff2) {
            case 104:
            case 105:
            case 106:
                this.attCD /= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff2 - 104];
        }
        if (this.showChuChang) {
            this.setStatus(3);
        } else {
            this.setStatus(0);
        }
    },
    setAnimation: function (t, e, i, n) {
        if (void 0 === n) {
            n = null;
        }
        if (!this.spine) {
            cc.error(
                "Enemy.setAnimation: spine is null, node=" +
                    (this.node ? this.node.name : "?") +
                    ", ani=" +
                    this.aniName(e)
            );
            return null;
        }
        var o = this.spine.setAnimation(t, this.aniName(e), i);
        if (n) {
            this.spine.setTrackCompleteListener(o, n);
        }
        return o;
    },
    aniName: function (t) {
        return this.spinePre + t + this.spineEx;
    },
    getAtk: function () {
        if (this.inBuff12) {
            return 1.2 * this.atk;
        } else {
            return this.atk;
        }
    },
    setStatus: function (t) {
        var e = this;
        switch (t) {
            case 3:
                this.setAnimation(0, "chuchang", !1, function () {
                    e.setStatus(0);
                    e.setAnimation(0, "walk", !0);
                });
                this.node.zIndex = -this.node.y;
                break;
            case 0:
                this.moveSpeed = cc.v2(-this.speed, 0);
                this.setAnimation(0, "walk", !0);
                break;
            case 1:
                var i = this.scene.chooseHero(this.node.position);
                if (i) {
                    this.target = i;
                    if (this.checkInAttRange(i)) {
                        this.setStatus(2);
                        this.setAnimation(0, "stand", !0);
                    } else {
                        var n;
                        if (this.zdSpine) {
                            n = cc.v2(0, 0);
                        } else {
                            n = cc.v2(this.attRange + cc.math.randomRange(-20, 0), cc.math.randomRange(-5, 5));
                        }
                        var o = i.node.position.add(n).sub(this.node.position);
                        var s = Math.atan2(o.y, o.x);
                        this.moveSpeed = cc.v2(this.speed * Math.cos(s), this.speed * Math.sin(s));
                    }
                } else {
                    this.target = null;
                    cc.pvz.TAUtils.track("error", {
                        message: "Enemy",
                        stack:
                            "setStatus, id:" +
                            this.id +
                            ",hp:" +
                            this.hp +
                            ",hasEnded:" +
                            this.scene.hasEnded +
                            ",enemyCount:" +
                            this.scene.enemyCount +
                            ",heroCount:" +
                            (this.scene.heroes ? this.scene.heroes.length : 0)
                    });
                }
                break;
            case 2:
                this.attTime = -1;
                this.spine.setEventListener(function () {
                    if (e.zdSpine) {
                        if (e.zdIsIKMode) {
                            e.newBulletIKMode();
                        } else {
                            e.newBullet();
                        }
                    } else {
                        e.doAttLogic(e.target, 0);
                    }
                });
        }
        this.status = t;
    },
    newBulletIKMode: function () {
        var t = this;
        var e = this.scene.chooseHero(this.node.position);
        if (e) {
            var i = cc.instantiate(this.zdSpine.node);
            i.parent = this.scene.bulletsRoot;
            i.active = !0;
            if (this.GPBone) {
                //
            } else {
                this.GPBone = this.spine.findBone("GP");
            }
            i.position = this.node.position.add(cc.v2(this.GPBone.worldX, this.GPBone.worldY));
            var n = e.node.position.add(cc.v2(0, 50));
            var o = i.getComponent(sp.Skeleton);
            var s = o.findBone("zhadan");
            s.x = n.x - i.x;
            s.y = n.y - i.y;
            o.setAnimation(0, this.aniName("zd"), !0);
            o.setCompleteListener(function () {
                t.doAttLogic(e, 1);
                i.position = n;
                o.setAnimation(0, t.aniName("bz"), !1);
                o.setCompleteListener(null);
            });
        }
    },
    newBullet: function () {
        var t = this;
        var e = this.scene.chooseHero(this.node.position);
        if (e) {
            var i = cc.instantiate(this.zdSpine.node);
            i.parent = this.scene.bulletsRoot;
            i.active = !0;
            if (this.GPBone) {
                //
            } else {
                this.GPBone = this.spine.findBone("GP");
            }
            i.position = this.node.position.add(cc.v2(this.GPBone.worldX, this.GPBone.worldY));
            var n = e.node.position.add(cc.v2(0, 50)).sub(i.position);
            var o = n.len() / 800;
            i.angle = (180 * Math.atan2(n.y, n.x)) / Math.PI + 180;
            i.runAction(
                cc.sequence(
                    cc.moveBy(o, n),
                    cc.callFunc(function () {
                        t.doAttLogic(e, 1);
                        s.setAnimation(0, t.aniName("zd2"), !1);
                        s.setCompleteListener(function () {
                            i.parent = null;
                            s.setCompleteListener(null);
                        });
                    })
                )
            );
            var s = i.getComponent(sp.Skeleton);
            s.setAnimation(0, this.aniName("zd1"), !0);
            s.setCompleteListener(null);
        }
    },
    repulse: function (t) {
        var e = this;
        if (!(this.hp <= 0 || this.id >= 100)) {
            var i = this.node.position.sub(t);
            var n = Math.atan2(i.y, i.x);
            var o = cc.v2(10 * Math.cos(n), 10 * Math.sin(n));
            if (o.x < 0) {
                o.x = 0;
            }
            var s = cc.v2(
                Math.max(this.node.x + o.x, this.scene.groundAreaLB.x),
                cc.math.clamp(this.node.y + o.y, this.scene.groundAreaLB.y, this.scene.groundAreaTR.y)
            );
            if (this.node.x <= this.scene.groundAreaTR.x && s.x > this.scene.groundAreaTR.x) {
                s.x = this.scene.groundAreaTR.x;
            }
            this.enabled = !1;
            this.node.runAction(
                cc.sequence(
                    cc.moveTo(0.1, s),
                    cc.callFunc(function () {
                        if (e.hp > 0) {
                            e.enabled = !0;
                            e.setStatus(0);
                        }
                    })
                )
            );
        }
    },
    update: function (t) {
        if (!this.scene.timePaused && !(this.scene.hasEnded || this.hp <= 0)) {
            var e = t * cc.director.getScheduler().getTimeScale() * this.spine.timeScale;
            var i = cc.pvz.runtimeData.getBuffValue(4);
            if (i > 0) {
                e *= 1 - 0.01 * i;
            }
            switch (cc.pvz.runtimeData.actBuff2) {
                case 110:
                case 111:
                case 112:
                    e *= [1.2, 1.3, 1.4][cc.pvz.runtimeData.actBuff2 - 110];
            }
            this.doLogic(e);
            if (this.hpBar) {
                this.hpBar.node.position = this.node.position;
            }
        }
    },
    checkInAttRange: function (t) {
        var e = t.position2 || t.node.position;
        if (this.zdSpine) {
            return this.node.position.sub(e).lengthSqr() < this.attRangeRR;
        } else {
            return this.node.x - e.x <= this.attRange;
        }
    },
    doAttLogic: function (t, e) {
        var i = this.getAtk();
        if (0 == e && cc.pvz.runtimeData.hasEnableBuff(1103) && Math.random() < 0.2) {
            i *= 0.5;
        }
        if (1 == e && cc.pvz.runtimeData.hasEnableBuff(1104) && Math.random() < 0.2) {
            i *= 0.5;
        }
        i *= cc.math.randomRange(0.95, 1.05);
        this.scene.showHeroHurtNum(t.node.position, i);
        t.hurtBy(this, e, i);
    },
    doLogic: function (t) {
        var e = this;
        switch (this.status) {
            case 0:
                this.node.position = this.node.position.add(this.moveSpeed.mul(t));
                this.node.zIndex = -this.node.y;
                if (this.node.x < 250) {
                    this.setStatus(1);
                }
                break;
            case 1:
                if (this.target && this.target.hp > 0) {
                    this.node.position = this.node.position.add(this.moveSpeed.mul(t));
                    this.node.zIndex = -this.node.y;
                    this.checkInAttRange(this.target) && (this.setStatus(2), this.setAnimation(0, "stand", !0));
                } else {
                    this.setStatus(1);
                    this.setAnimation(0, "walk", !0);
                }
                break;
            case 2:
                if (cc.pvz.time > this.attTime) {
                    this.setAnimation(0, "attack", !1, function () {
                        if (!e.target || e.target.hp <= 0) {
                            e.setStatus(1);
                            if (e.target && 1 == e.status) {
                                e.setAnimation(0, "walk", !0);
                            } else {
                                e.setAnimation(0, "stand", !0);
                            }
                        } else {
                            e.setAnimation(0, "stand", !0);
                        }
                    });
                    this.attTime = cc.pvz.time + this.attCD;
                }
        }
    },
    doDieLogic: function () {
        var t = this;
        if (-1 != this.slowTimer) {
            this.slowNode.parent = null;
            this.slowNode = null;
            this.scene.clearTimeout(this.slowTimer);
            this.slowTimer = -1;
        }
        if (this.poisonNode) {
            this.poisonNode.parent = null;
            this.poisonNode = null;
        }
        this.poisonInfos.forEach(function (e) {
            t.scene.clearInterval(e.t1);
            t.scene.clearTimeout(e.timer);
        });
        this.poisonInfos.length = 0;
        if (-1 != this.iceTimer) {
            this.iceNode1.parent = null;
            this.iceNode1 = null;
            this.iceNode2.parent = null;
            this.iceNode2 = null;
            this.scene.clearTimeout(this.iceTimer);
            this.iceTimer = -1;
        }
        if (-1 != this.weakTimer) {
            this.weakNode.parent = null;
            this.weakNode = null;
            this.scene.clearTimeout(this.weakTimer);
            this.weakTimer = -1;
        }
        if (this.hpBar) {
            this.hpBar.node.parent = null;
            this.hpBar = null;
        }
        this.subEnemys.forEach(function (e) {
            var i = t.node.position.add(e.subNode.position);
            e.subNode.active = !0;
            t.scene.addEnemyIn(-1, e.subNode, i.x, i.y, t.maxHp * e.hpRate, Math.max(1, t.atk * e.atkRate));
        });
        this.scene.enemyCount += this.subEnemys.length;
        this.scene.delEnemy(this);
    },
    hurtBy: function (t, e) {
        var i = this;
        if (this.hp <= 0) {
            //
        } else {
            this.hp -= e;
            if (this.hp <= 0) {
                -1 != this.iceTimer && (this.scene.clearTimeout(this.iceTimer), this.removeIceBuff()),
                    this.setAnimation(0, "die", !1, function () {
                        i.doDieLogic();
                    }),
                    this.scene.eDiePrefab
                        .addNode(this.node.position)
                        .getComponent(sp.Skeleton)
                        .setAnimation(0, this.id > 99 ? "die_BOSS" : "die" + cc.math.randomRangeInt(1, 4), !1);
            } else {
                this.scene.addEnemyHpBar(this),
                    this.hpBar && (this.hpBar.progress = this.hp / this.maxHp),
                    this.setAnimation(1, "hit", !1);
            }
        }
    },
    onBuffCollisionEnter: function (t) {
        if (1 != t.tag) {
            t.getComponent("Enemy").inBuff12 = !0;
        }
    },
    onBuffCollisionExit: function (t) {
        if (1 != t.tag) {
            t.getComponent("Enemy").inBuff12 = !1;
        }
    },
    addBuffSlow: function () {
        var t = this;
        if (-1 == this.slowTimer) {
            this.slowNode = this.scene.eSlowPrefab.addNodeTo(this.node, cc.Vec2.ZERO);
            this.slowNode.zIndex = cc.macro.MIN_ZINDEX;
        }
        this.spine.timeScale = 0.75;
        this.slowTimer = this.scene.setTimeout(
            function () {
                t.spine.timeScale = 1;
                t.slowNode.parent = null;
                t.slowNode = null;
                t.slowTimer = -1;
            },
            5e3,
            this.slowTimer
        );
    },
    addBuffPoison: function (t, e, i) {
        var n = this;
        var o = this.poisonInfos.find(function (e) {
            return e.a == t;
        });
        if (!o) {
            if (this.poisonNode) {
                //
            } else {
                this.poisonNode = this.scene.ePoisonPrefab.addNodeTo(this.node, cc.Vec2.ZERO);
            }
            var s = 0.1 * i;
            (o = {
                a: t
            }).t1 = this.scene.setInterval(function () {
                n.hurtBy(t, s);
                n.scene.showEnemyHurtNum(0, n.node.position, s);
            }, 1e3);
            this.poisonInfos.push(o);
        }
        o.timer = this.scene.setTimeout(
            function () {
                var e = n.poisonInfos.findIndex(function (e) {
                    return e.a == t;
                });
                n.scene.clearInterval(n.poisonInfos[e].t1);
                n.poisonInfos.splice(e, 1);
                if (0 == n.poisonInfos.length) {
                    n.poisonNode.parent = null;
                    n.poisonNode = null;
                }
            },
            e,
            o.timer
        );
    },
    addBuffIce: function () {
        if (!(this.hp <= 0)) {
            if (-1 == this.iceTimer) {
                this.iceNode1 = this.scene.eIcePrefab.addNodeTo(this.node, this.hpBarPos);
                var t = this.iceNode1.children[0].getComponent(sp.Skeleton);
                t.setAnimation(0, "stun", !0);
                t.setCompleteListener(null);
                this.iceNode1.zIndex = cc.macro.MAX_ZINDEX;
            }
            this.spine.paused = !0;
            this.enabled = !1;
            this.iceTimer = this.scene.setTimeout(this.removeIceBuff.bind(this), 3e3, this.iceTimer);
        }
    },
    removeIceBuff: function () {
        this.spine.paused = !1;
        this.enabled = !0;
        this.iceNode1.parent = null;
        this.iceNode1 = null;
        this.iceTimer = -1;
    },
    addBuffWeak: function () {
        var t = this;
        if (-1 == this.weakTimer) {
            this.weakNode = this.scene.eWeakPrefab.addNodeTo(this.node, cc.Vec2.ZERO);
        }
        this.weakTimer = this.scene.setTimeout(
            function () {
                t.weakNode.parent = null;
                t.weakNode = null;
                t.weakTimer = -1;
            },
            3e3,
            this.weakTimer
        );
    }
});
