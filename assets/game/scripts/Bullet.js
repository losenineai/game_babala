cc.Class({
    extends: cc.Component,
    properties: {
        sprite: cc.Sprite,
        spriteBundle: "",
        spritePath: "",
        spine: sp.Skeleton,
        spinePre: "",
        aoeHitEffect: !1,
        life: {
            default: -1,
            tooltip: "毫秒，-1为出屏消失"
        },
        dieOutScreen: !0,
        speed: 500,
        buffSlow: !1,
        buffIce: !1,
        buffPoison: !1,
        dieKeepFrame: 0,
        hitCount: {
            default: 1,
            tooltip: "攻击次数，默认1次攻击后消失，填2就穿透1次"
        },
        hitChangeAngle: !1,
        jsEffExclusive: !1,
        canReturn: !1
    },
    initBy: function (t, e) {
        this.scene = t;
        this.lv = e;
        this.dieTimer = -1;
        this.hitCounter = this.hitCount;
        this.lifeTimer = -1;
        if (this.canReturn) {
            this.returnTimer = this.scene.setTimeout(this.doReturnLogic.bind(this), this.life);
            this.life += this.life;
        }
        if (this.life > 0) {
            this.lifeTimer = this.scene.setTimeout(this.onLifeEnd.bind(this), this.life);
        }
    },
    moveByAngle: function (t) {
        if (this.speed > 0) {
            var e = this.speed / 60;
            var i = (t * Math.PI) / 180;
            this.moveDelta = cc.v2(e * Math.cos(i), e * Math.sin(i));
        }
        this.node.angle = t;
    },
    doReturnLogic: function () {
        this.moveDelta = cc.v2(-this.moveDelta.x, -this.moveDelta.y);
    },
    onLifeEnd: function () {
        this.node.parent = null;
    },
    onMoveEnded: function () {
        if (-1 != this.lifeTimer) {
            this.scene.clearTimeout(this.lifeTimer);
            this.lifeTimer = -1;
        }
        this.node.parent = null;
    },
    update: function () {
        if (!this.scene.timePaused && this.moveDelta) {
            var t = this.moveDelta.mul(cc.director.getScheduler().getTimeScale());
            this.node.position = this.node.position.add(t);
        }
    },
    onHitEnemy: function (t) {
        var e = this;
        this.hitCounter--;
        if (this.hitCounter <= 0) {
            t.enabled = !1;
            -1 != this.lifeTimer && (this.scene.clearTimeout(this.lifeTimer), (this.lifeTimer = -1));
            if (this.dieKeepFrame > 0) {
                -1 == this.dieTimer &&
                    (this.dieTimer = this.scene.setTimeout(function () {
                        e.node.parent = null;
                    }, (1e3 * this.dieKeepFrame) / 60));
            } else {
                this.node.parent = null;
            }
        } else if (this.hitChangeAngle) {
            var i = this.scene.chooseEnemyByBullet(this);
            if (i) {
                var n = this.node.position;
                var o = i.node.position.add(cc.v2(0, i.centerY)).sub(n);
                var s = Math.atan2(o.y, o.x);
                this.moveByAngle((180 * s) / Math.PI);
            }
        }
    },
    doCollisionLogic: function (t, e) {
        if (1 != t.tag) {
            var i = t.getComponent("Enemy");
            if (i && i.hp > 0 && i != this.excludeEnemy) {
                this.a.doBulletAttLogic(this, i);
                this.onHitEnemy(e);
            }
        } else {
            if (this.dieOutScreen) {
                this.onMoveEnded();
            }
        }
    },
    onCollisionEnter: function (t, e) {
        if (e.enabled) {
            this.doCollisionLogic(t, e);
        }
    },
    onRangePoisonEnter: function (t) {
        var e = t.getComponent("Enemy");
        if (e && e.hp > 0) {
            e.addBuffPoison(this.a, 5e3, this.att);
        }
    },
    onAoeCollisionEnter: function (t) {
        var e = t.getComponent("Enemy");
        if (e && e.hp > 0) {
            this.a.doBulletAttLogic(this, e);
        }
    }
});
