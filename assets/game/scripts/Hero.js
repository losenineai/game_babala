var $bullet = require("./Bullet");
cc.Class({
    extends: cc.Component,
    properties: {
        spine: sp.Skeleton,
        zd: $bullet,
        zd2: $bullet,
        landMineNode: cc.Node
    },
    onLoad: function () {
        if (this.zd) {
            this.zd.node.active = !1;
        }
        if (this.zd2) {
            this.zd2.node.active = !1;
        }
        if (this.landMineNode) {
            this.landMineNode.active = !1;
        }
    },
    start: function () {},
    initBy: function (t, e, i) {
        var n = this;
        this.scene = t;
        this.info = i;
        this.item = e;
        this.spine = this.item.spine;
        var o = this.info.json.range;
        this.atkRR = o * o;
        this.lvs = [];
        this.hp = this.item.maxHp;
        this.shieldValue = 0;
        this.hasDie = !1;
        this.setAnimation(0, "stand", !0, null);
        this.isPhy = !0;
        this.isMagic = !0;
        this.is3gz = [2, 5, 9, 10].some(function (t) {
            return t == n.item.id;
        });
        this.is2gz = [2, 4, 8].some(function (t) {
            return t == n.item.id;
        });
        cc.butler.node.on("lvup", this.onLvup, this);
    },
    onLvup: function (t) {
        if (this.item.index == t) {
            this.item.lvup(!1);
            this.scene.hub.showLvupEffect(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        }
    },
    setAnimation: function (t, e, i, n) {
        this.spine.setAnimation(t, e + (this.item.lv + 1), i);
        this.spine.setCompleteListener(n);
    },
    getAtk: function (t) {
        var e = Math.min(this.info.lv1, this.info.json.attribute2.length - 1);
        var i = this.info.json.attribute2[e];
        if (t > 0) {
            i *= this.info.json.fightlvup2[t - 1] / 100;
        }
        var n = cc.pvz.runtimeData.getBuffValue(2);
        var o = cc.pvz.runtimeData.getBuffValue(10);
        if (o > 0) {
            n += o * cc.pvz.runtimeData.items.length;
        }
        if (n > 0) {
            i *= 1 + 0.01 * n;
        }
        return i;
    },
    getShield: function (t) {
        var e = Math.min(this.info.lv1, this.info.json.attribute2.length - 1);
        var i = this.info.json.attribute2[e];
        if (t > 0) {
            i *= this.info.json.fightlvup2[t - 1] / 100;
        }
        return i;
    },
    pushLvAndAtk: function (t) {
        var e = this.getAtk(t.lv);
        this.lvs.push({
            lv: t.lv,
            atk: e
        });
    },
    playAttAndDo: function (t, e) {
        var i = this;
        this.setAnimation(0, "attack", !1, function () {
            i.item.checkToStartReloadTimer();
            i.setAnimation(0, "stand", !0, null);
            if (e) {
                e();
            }
        });
        this.spine.setEventListener(function () {
            if (t) {
                t();
            }
        });
    },
    playSound: function () {
        switch (this.info.id) {
            case 3:
            case 12:
                break;
            case 6:
                cc.butler.playEffectAsync("game", "sound/dun");
                break;
            case 8:
                cc.butler.playEffectAsync("game", "sound/hp");
                break;
            case 9:
                cc.butler.playEffectAsync("game", "sound/jiguang");
                break;
            case 10:
                cc.butler.playEffectAsync("game", "sound/getSunShine");
                break;
            default:
                cc.butler.playEffectAsync("game", "sound/shoot");
        }
    },
    tryShoot: function (t, e) {
        var i = this;
        switch (this.info.id) {
            case 3:
                this.playAttAndDo(function () {
                    var t = Math.floor(i.getAtk(i.item.lv));
                    if (i.checkBuff(302)) {
                        t += 1;
                    }
                    if (i.checkBuff(304) && Math.random() < 0.25) {
                        t *= 2;
                    }
                    cc.pvz.runtimeData.addMoney(t);
                    i.scene.showBuffEffect("money", i.node.position, i.scene.getMoneyWPos());
                });
                return !0;
            case 6:
                this.playAttAndDo(function () {
                    var t = i.getAtk(i.item.lv) / 100;
                    var e = 0;
                    if (cc.pvz.runtimeData.hasEnableBuff(601)) {
                        e = 0.15;
                    }
                    if (cc.pvz.runtimeData.hasEnableBuff(602)) {
                        e += 0.3;
                    }
                    if (e > 0) {
                        t *= 1 + e;
                    }
                    i.item.crossItems.forEach(function (e) {
                        if (e.hero && e.hero.hp > 0) {
                            e.hero.addShield(e.maxHp * t);
                            i.scene.showBuffEffect("shield", e.hero.node.position);
                        }
                    });
                });
                return !0;
            case 8:
                var n = this.scene.chooseMinHpHero();
                return (
                    !!n &&
                    (this.playAttAndDo(function () {
                        var t = i.getAtk(i.item.lv);
                        if (i.checkBuff(802)) {
                            t *= 1.2;
                        }
                        n.addHp(t);
                        i.scene.showBuffEffect("HP", n.node.position);
                    }),
                    !0)
                );
            case 10:
                this.playAttAndDo(function () {
                    var t = i.getAtk(i.item.lv);
                    var e = 0;
                    if (cc.pvz.runtimeData.hasEnableBuff(1001)) {
                        e = 0.1;
                    }
                    if (cc.pvz.runtimeData.hasEnableBuff(1002)) {
                        e += 0.2;
                    }
                    if (e > 0) {
                        t *= 1 + e;
                    }
                    i.scene.showBuffEffect(
                        "music",
                        i.node.position.add(cc.v2(0, 50)),
                        i.scene.getAngerBarWPos(),
                        function () {
                            cc.pvz.runtimeData.anger += t;
                            i.scene.updateAnger();
                        }
                    );
                });
                return !0;
            case 11:
                this.playAttAndDo(function () {
                    var t = 1;
                    if (cc.pvz.runtimeData.hasEnableBuff(1104)) {
                        if (i.lastBulletCount) {
                            if (1 == i.lastBulletCount) {
                                t = 2;
                            } else {
                                t = 1;
                            }
                        }
                        i.lastBulletCount = t;
                    }
                    var e = function () {
                        var t = cc.instantiate(i.landMineNode);
                        var e = cc.v2(
                            i.scene.getHeroesMaxMarginX() + cc.math.randomRange(0, 150),
                            cc.math.randomRange(i.scene.groundAreaLB.y + 120, i.scene.groundAreaTR.y - 120)
                        );
                        t.position = i.node.position;
                        t.active = !0;
                        t.parent = i.scene.objsRoot;
                        t.zIndex = -t.y;
                        var n = t.getComponent(cc.Collider);
                        n.enabled = !1;
                        var o = t.getComponent(sp.Skeleton);
                        var s = o.findBone("IK");
                        s.x = (e.x - t.x) / t.scale;
                        s.y = (e.y - t.y) / t.scale;
                        s.x = Math.max(0, s.x);
                        o.setAnimation(0, "zd11_1", !0);
                        o.setCompleteListener(function () {
                            t.position = e;
                            n.enabled = !0;
                            o.setAnimation(0, "zd11_2", !1);
                            o.setCompleteListener(null);
                        });
                    };
                    for (var n = 0; n < t; n++) {
                        e();
                    }
                });
                return !0;
            case 12:
                var o = this.checkBuff(1204) ? 2 : 1,
                    s = this.scene.chooseEnemys(this, this.atkRR, o);
                if (0 == s.length) {
                    return !1;
                }
                var c = this.scene.getHeroesMaxMarginX(),
                    a = 0;
                this.playAttAndDo(function () {
                    if (1 != a || i.checkBuff(1204)) {
                        var t = s[Math.min(s.length - 1, a)];
                        var e = t.node.position.add(cc.v2(0, t.centerY));
                        var n = cc.v2(Math.min(c, e.x), e.y);
                        var o = i.scene.objsRoot.convertToWorldSpaceAR(n);
                        var r = cc.instantiate(i.zd.node);
                        var h = r.getComponent("Bullet");
                        r.parent = i.scene.bulletsRoot;
                        r.active = !0;
                        r.position = i.node.position;
                        h.spine.setAnimation(0, h.spine.defaultAnimation, !0);
                        var d = h.spine.findBone("IK");
                        var u = h.spine.node.convertToNodeSpaceAR(o);
                        d.x = u.x;
                        d.y = u.y;
                        h.initBy(i.scene, i.item.lv);
                        h.a = i;
                        h.att = i.getAtk(i.item.lv);
                        var p = function (t) {
                            i.scene.setTimeout(function () {
                                i.scene.showJsEffect(cc.v2(n.x + 100 * t, n.y), i.info.id);
                            }, 48 * t);
                        };
                        for (var l = 1; l < 5; l++) {
                            p(l);
                        }
                        cc.butler.playEffectAsync("game", "sound/gunzi");
                        a++;
                    }
                });
                return !0;
        }
        var r = e || this.scene.chooseEnemy(this, this.atkRR);
        return (
            !!r &&
            (this.pushLvAndAtk(t),
            !this.isAttacking &&
                ((this.isAttacking = !0),
                this.playAttAndDo(
                    function () {
                        if (r.isValid) {
                            i.isAttacking = !1;
                            i.checkToShoot(r);
                        }
                    },
                    function () {
                        if (i.item.bulletCount <= 0) {
                            cc.tween(i.IKBone)
                                .to(0.064, {
                                    x: 150,
                                    y: 50
                                })
                                .start();
                        }
                    }
                ),
                this.IKBone || (this.IKBone = this.spine.findBone("IK")),
                cc
                    .tween(this.IKBone)
                    .to(0.064, {
                        x: (r.node.x - this.node.x) / 0.76,
                        y: (r.node.y + r.centerY - this.node.y) / 0.76
                    })
                    .start(),
                !0))
        );
    },
    checkToShoot: function (t) {
        if (0 != this.lvs.length) {
            if (this.zd) {
                var e = this.lvs.shift();
                var i = t || this.scene.chooseEnemy(this, this.atkRR);
                if (i) {
                    this.shoot(i, this.item.lv, e.atk);
                }
            }
            if (this.lvs.length > 0) {
                this.scene.setTimeout(this.checkToShoot.bind(this), 80);
            }
        }
    },
    getShootAPos: function () {
        if (this.GPBone) {
            //
        } else {
            this.GPBone = this.spine.findBone("GP");
        }
        var t = cc.v2(this.GPBone.worldX, this.GPBone.worldY);
        return this.spine.node.convertToWorldSpaceAR(t);
    },
    shoot: function (t, e, i) {
        if (4 == this.info.id) {
            var n;
            if (this.checkBuff(401)) {
                n = 9;
            } else {
                n = 5;
            }
            return this.shootN(n, t, e, i);
        }
        if (this.checkBuff(904)) {
            return this.shootN(3, t, e, i);
        } else {
            if (7 == this.info.id) {
                return this.shootIK(t, e, i);
            } else {
                return void this.shoot1(t, e, i);
            }
        }
    },
    shoot1: function (t, e, i) {
        var n = this.getShootAPos();
        var o = this.scene.bulletsRoot.convertToNodeSpaceAR(n);
        var s = t.node.position.add(cc.v2(0, t.centerY)).sub(o);
        if (s.x < 0) {
            s.x = 0;
        }
        var c = Math.atan2(s.y, s.x);
        var a = this.zd;
        var r = cc.instantiate(a.node);
        r.parent = this.scene.bulletsRoot;
        r.active = !0;
        r.position = o;
        var h = r.getComponent("Bullet");
        if (this.checkBuff(104)) {
            h.hitCount = 2;
        }
        if (this.checkBuff(503)) {
            h.hitCount = 2;
        }
        h.initBy(this.scene, e);
        h.a = this;
        if (13 == this.info.id && 2 == cc.pvz.runtimeData.mode) {
            h.att = i / 2;
        } else {
            h.att = i;
        }
        h.moveByAngle((180 * c) / Math.PI);
    },
    shootN: function (t, e, i, n) {
        var o = this.getShootAPos();
        var s = this.scene.bulletsRoot.convertToNodeSpaceAR(o);
        var c = e.node.position.add(cc.v2(0, e.centerY)).sub(s);
        if (c.x < 0) {
            c.x = 0;
        }
        var a = (180 * Math.atan2(c.y, c.x)) / Math.PI;
        var r;
        if (t > 5) {
            r = [0, -10, -20, -30, 40, 10, 20, 30, 40];
        } else {
            r = [0, -15, 15, -30, 30];
        }
        for (var h = 0; h < t; h++) {
            var d = cc.instantiate(this.zd.node);
            d.parent = this.scene.bulletsRoot;
            d.active = !0;
            d.position = s;
            var u = d.getComponent("Bullet");
            u.initBy(this.scene, i);
            u.a = this;
            u.att = n;
            u.moveByAngle(a + r[h]);
        }
    },
    shootIK: function (t, e, i) {
        var n = this;
        var o = this.getShootAPos();
        var s = this.scene.bulletsRoot.convertToNodeSpaceAR(o);
        var c = t.node.convertToWorldSpaceAR(cc.v2(0, t.centerY));
        var a = cc.instantiate(this.zd.node);
        var r = a.getComponent("Bullet");
        a.parent = this.scene.bulletsRoot;
        a.active = !0;
        a.position = s;
        if (this.checkBuff(702)) {
            a.getComponent("EventCollider").collider.radius *= 1.3;
        }
        var h = r.spine.setAnimation(0, r.spine.defaultAnimation, !0);
        r.spine.setTrackEventListener(h, function () {
            n.scene.showJsEffect(t.node.position, n.info.id);
        });
        var d = r.spine.findBone("IK");
        var u = r.spine.node.convertToNodeSpaceAR(c);
        d.x = u.x;
        d.y = u.y;
        d.x = Math.max(0, d.x);
        r.initBy(this.scene, e);
        r.a = this;
        r.att = i;
    },
    checkHeroBuff: function () {
        return !1;
    },
    checkBuff: function (t) {
        var e = (t - (t % 100)) / 100;
        return this.info.id == e && cc.pvz.runtimeData.hasEnableBuff(t);
    },
    doBulletAttLogic: function (t, e) {
        var i = t.att;
        if (this.checkBuff(101)) {
            i *= 1.25;
        }
        if (this.checkBuff(201)) {
            i *= 1.25;
        }
        if (this.checkBuff(504)) {
            i *= 1.5;
        }
        if (this.checkBuff(701)) {
            i *= 1.25;
        }
        if (this.checkBuff(901)) {
            i *= 1.25;
        }
        if (this.checkBuff(1101)) {
            i *= 1.25;
        }
        if (this.checkBuff(1201)) {
            i *= 1.25;
        }
        if (e.weakNode && this.isPhy) {
            i *= 1.2;
        }
        switch (cc.pvz.runtimeData.actBuff1) {
            case 1:
            case 2:
            case 3:
                if (this.isPhy) {
                    i *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff1 - 1];
                }
                break;
            case 4:
            case 5:
            case 6:
                if (this.is3gz) {
                    i *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff1 - 4];
                }
                break;
            case 10:
            case 11:
            case 12:
                if (this.is2gz) {
                    i *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff1 - 10];
                }
        }
        var n = 0;
        if (this.checkCrit(t, e)) {
            n = 1;
            i *= this.getCritPlus(t, e);
        }
        i *= cc.math.randomRange(0.95, 1.05);
        e.hurtBy(this, i);
        this.scene.showEnemyHurtNum(n, e.node.position, i);
        if (t.jsEffExclusive) {
            //
        } else {
            this.scene.showJsEffect(e.node.position, this.info.id);
        }
        cc.pvz.runtimeData.stats[this.info.id] += i;
        if (t.buffSlow) {
            e.addBuffSlow();
        }
        if (t.buffIce && this.checkBuff(1203) && Math.random() < 0.2) {
            e.addBuffIce();
        }
        if (this.checkBuff(704) && Math.random() < 0.5) {
            e.addBuffWeak();
        }
        if (this.checkBuff(204)) {
            e.repulse(this.node.position);
        }
        if (this.checkBuff(403)) {
            e.repulse(this.node.position);
        }
        if (this.checkBuff(1102)) {
            e.repulse(this.node.position);
        }
    },
    checkCrit: function () {
        if (this.checkBuff(501)) {
            if (this.attCounter) {
                this.attCounter = this.attCounter + 1;
            } else {
                this.attCounter = 1;
            }
            var t;
            if (this.checkBuff(502)) {
                t = 2;
            } else {
                t = 3;
            }
            if (this.attCounter >= t) {
                this.attCounter = 0;
                return !0;
            }
        }
        var e = 0;
        if (this.checkBuff(102)) {
            e += 0.25;
        }
        if (this.checkBuff(404)) {
            e += 0.25;
        }
        if (this.checkBuff(903)) {
            e += 0.1;
        }
        return Math.random() < e;
    },
    getCritPlus: function () {
        var t = 1.5;
        if (this.checkBuff(103)) {
            t += 0.5;
        }
        return t;
    },
    doLandMinesLogic: function (t) {
        var e = t.getComponent("Enemy");
        if (e && e.hp > 0) {
            this.doBulletAttLogic(
                {
                    att: this.getAtk(this.item.lv),
                    lv: this.item.lv,
                    jsEffExclusive: !0
                },
                e
            );
        }
    },
    onLandminesCollision: function (t, e) {
        if (e.enabled) {
            var i = t.getComponent("Enemy");
            if (i && i.hp > 0) {
                e.enabled = !1;
                var n = e.node.getComponent(sp.Skeleton);
                var o = cc.find("range", e.node).getComponent(cc.Collider);
                cc.pvz.utils.manuallyCheckCollider(o);
                this.scene.showJsEffect(e.node.position, this.info.id);
                n.node.destroy();
            }
        }
    },
    addHp: function (t) {
        this.hp = Math.min(this.item.maxHp, this.hp + t);
        this.item.updateHp(this.hp / this.item.maxHp);
        this.scene.updateHp(!0);
    },
    delHp: function (t) {
        this.hp = Math.max(0, this.hp - t);
        this.item.updateHp(this.hp / this.item.maxHp);
        this.scene.updateHp(!0);
    },
    addShield: function (t) {
        this.shieldValue = Math.min(this.item.maxHp, this.shieldValue + t);
        this.item.updateShield(this.shieldValue / this.item.maxHp);
        this.scene.updateShield();
    },
    hurtBy: function (t, e, i) {
        var n = this;
        if (!(this.hasEnded || this.hp <= 0)) {
            if (this.shieldValue > 0) {
                var o = Math.min(this.shieldValue, i);
                i -= o;
                this.shieldValue -= o;
                this.item.updateShield(this.shieldValue / this.item.maxHp);
            }
            if (i > 0 && (this.delHp(i), this.hp <= 0)) {
                var s =
                    !cc.pvz.runtimeData.hasUseReborn &&
                    (8 == this.info.id || this.scene.hasHero(8)) &&
                    cc.pvz.runtimeData.hasEnableBuff(803);
                if (s) {
                    cc.pvz.runtimeData.hasUseReborn = !0;
                } else {
                    this.item.barNode.active = !1;
                }
                this.setAnimation(0, "die", !1, function () {
                    if (s) {
                        n.reborn(cc.pvz.runtimeData.hasEnableBuff(804) ? 1 : 0.3);
                        n.showBuffEffect("revive", !1);
                    } else {
                        n.hasDie = !0;
                        n.scene.checkIsFail();
                        n.spine.setCompleteListener(null);
                    }
                });
            }
        }
    },
    reborn: function (t) {
        var e = this;
        this.setAnimation(0, "fuhuo", !1, function () {
            e.hp = e.item.maxHp * t;
            e.item.updateHp();
            e.hasDie = !1;
            e.setAnimation(0, "stand", !0, null);
        });
    },
    showBuffEffect: function (t, e) {
        if (void 0 === e) {
            e = !1;
        }
        if (e) {
            this.scene.addBuffPrefab
                .addNodeTo(this.item.spine.node, cc.Vec2.ZERO)
                .getComponent(sp.Skeleton)
                .setAnimation(0, t, !1);
        } else {
            this.scene.showBuffEffect(t, this.node.position);
        }
    }
});
