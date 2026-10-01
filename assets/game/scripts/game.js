var $prefabInfo = require("../../scripts/PrefabInfo");
cc.Class({
    extends: cc.Component,
    properties: {
        bg2Sp: cc.Sprite,
        groundAreaNode: cc.Node,
        bgMusic2: cc.AudioClip,
        shieldBar: cc.ProgressBar,
        shieldLabel: cc.Label,
        hpBar: cc.ProgressBar,
        hpLabel: cc.Label,
        pauseNode: cc.Node,
        speedNode: cc.Node,
        speedLabel: cc.Label,
        statsBtnNode: cc.Node,
        levelsJsonFile: cc.JsonAsset,
        ground: cc.Node,
        objsRoot: cc.Node,
        bulletsRoot: cc.Node,
        fightNodes: [cc.Node],
        heroJsonFile: cc.JsonAsset,
        eHurtNum: $prefabInfo,
        eHurtCritNum: $prefabInfo,
        eDiePrefab: $prefabInfo,
        ePoisonPrefab: $prefabInfo,
        eSlowPrefab: $prefabInfo,
        eIcePrefab: $prefabInfo,
        eWeakPrefab: $prefabInfo,
        eHpPrefab: $prefabInfo,
        eBossHpPrefab: $prefabInfo,
        eHitPrefab: $prefabInfo,
        eHitGroundPrefab: $prefabInfo,
        pHurtNum: $prefabInfo,
        pFireEffect: $prefabInfo,
        addBuffPrefab: $prefabInfo,
        accBuffPrefab: $prefabInfo,
        waveEndAniSpine: sp.Skeleton,
        moneyIconNode: cc.Node,
        tryPlantNode: cc.Node,
        tryPlantIcon: cc.Sprite,
        statsPanel: cc.Node,
        statsItemPrefab: $prefabInfo,
        angerBar: cc.ProgressBar,
        angerBarSp: cc.Sprite,
        angerBarSpfs: [cc.SpriteFrame],
        angerEmptyTip: cc.Node,
        angerBarNode: cc.Node,
        angerModeNode: cc.Node
    },
    onLoad: function () {
        this.waveEndAniSpine.node.active = !1;
        if (this.statsPanel) {
            this.statsPanel.active = !1;
        }
        this.angerEmptyTip.active = !1;
    },
    startLogic: function (t) {
        var e = this;
        var i = this.hub.levelData;
        this.levelData = i;
        var n = this.groundAreaNode.getBoundingBoxToWorld();
        this.groundAreaLB = this.objsRoot.convertToNodeSpaceAR(cc.v2(n.xMin, n.yMin));
        this.groundAreaTR = this.objsRoot.convertToNodeSpaceAR(cc.v2(n.xMax, n.yMax));
        this.timePaused = !1;
        this.t = 0;
        this.msIndex = 0;
        this.frameActions = [];
        this.cbs2 = [];
        this.cbId = 1;
        this.pausedCbs = [];
        this.pausedCbs2 = [];
        this.hasEnded = !1;
        this.statsBtnNode.active = !0;
        if (2 == cc.pvz.runtimeData.mode) {
            this.maxWave = 99999;
        } else {
            this.maxWave = i.wave;
        }
        this.isLastWave = 2 != cc.pvz.runtimeData.mode && cc.pvz.runtimeData.wave == i.wave - 1;
        this.enemys = [];
        this.taskEnemyCount1 = 0;
        this.taskEnemyCount2 = 0;
        cc.butler.node.on("maxHp", this.onGetHpBuff, this);
        this.initHeroes(t);
        this.updateHp(!1);
        this.updateShield();
        this.updateSpeed();
        this.isAngerPressed = !1;
        this.angerBarNode.on(
            cc.Node.EventType.TOUCH_START,
            function () {
                e.startAngerMode();
            },
            this
        );
        this.angerBarNode.on(
            cc.Node.EventType.TOUCH_END,
            function () {
                e.stopAngerMode();
                e.angerEmptyTip.active = !1;
            },
            this
        );
        this.angerBarNode.on(
            cc.Node.EventType.TOUCH_CANCEL,
            function () {
                e.stopAngerMode();
                e.angerEmptyTip.active = !1;
            },
            this
        );
        this.updateAnger();
        cc.director.getCollisionManager().enabled = !0;
        cc.pvz.runtimeData.mode;
        if (cc.pvz.runtimeData.showGame1st && 0 == cc.pvz.runtimeData.wave) {
            cc.guideManager.showGuide(
                0,
                [
                    {
                        hideFinger: !0,
                        tip: "僵尸正在进攻我们的花园，赶紧消灭他们!"
                    }
                ],
                function (t) {
                    if (t) {
                        e.beginEmitEnemys();
                    }
                }
            );
        } else {
            this.beginEmitEnemys();
        }
        this.enabled = !0;
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, this.resetSpeed, this);
    },
    onBackFromGame: function () {
        this.stopAngerMode();
        this.fightNodes.forEach(function (t) {
            return t.removeAllChildren();
        });
        cc.butler.node.off("maxHp", this.onGetHpBuff, this);
        this.enabled = !1;
        cc.director.off(cc.Director.EVENT_BEFORE_SCENE_LOADING, this.resetSpeed, this);
        cc.director.getCollisionManager().enabled = !1;
        this.heroes.forEach(function (t) {
            if (t.IKBone) {
                cc.tween(t.IKBone)
                    .to(0.064, {
                        x: 150,
                        y: 50
                    })
                    .start();
            }
        });
    },
    beginEmitEnemys: function () {
        var t = this;
        var e = null;
        var i = null;
        switch (cc.pvz.runtimeData.mode) {
            case 0:
                e = "game";
                i = "config/Level" + this.levelData.level;
                if (cc.pvz.runtimeData.showGame1st) {
                    i += "B";
                }
                break;
            case 1:
                e = "game";
                i = "config/" + this.levelData.level;
                break;
            case 2:
                e = "rank";
                i = "config/" + this.levelData.level;
                cc.popupManager.showToast("第" + (cc.pvz.runtimeData.wave + 1) + "波开始");
        }
        cc.pvz.utils.useBundleAsset(e, i, cc.JsonAsset, function (e) {
            t.emitEnemys(e.json);
        });
    },
    resetSpeed: function () {
        this.setSpeedLogic(1);
    },
    updateAnger: function () {
        this.angerBar.progress = cc.pvz.runtimeData.anger / 1e3;
        if (this.angerBar.node.width > 10) {
            this.angerBar.node.opacity = 255;
        } else {
            this.angerBar.node.opacity = 0;
        }
    },
    getMoneyWPos: function () {
        return this.moneyIconNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
    },
    getAngerBarWPos: function () {
        return this.angerBar.node.convertToWorldSpaceAR(cc.v2(this.angerBar.node.width, 0));
    },
    showBuffEffect: function (t, e, i, n) {
        var o = this.addBuffPrefab.addNode(e);
        var s = o.getComponent(sp.Skeleton);
        var c = s.setAnimation(0, t, !1);
        if (i) {
            var a = o.convertToNodeSpaceAR(i);
            var r = s.findBone("IK");
            r.x = a.x;
            r.y = a.y;
        }
        if (n) {
            s.setTrackCompleteListener(c, n);
        }
    },
    onGetHpBuff: function () {
        this.bag.updateHp();
        this.updateHp();
    },
    updateHp: function (t) {
        var e = this.heroes.reduce(function (t, e) {
            return t + e.hp;
        }, 0);
        var i = this.heroes.reduce(function (t, e) {
            return t + e.item.maxHp;
        }, 0);
        if (0 != i) {
            this.hpLabel.string = Math.round(e);
            if (t) {
                cc.tween(this.hpBar)
                    .to(0.1, {
                        progress: e / i
                    })
                    .start();
            } else {
                this.hpBar.progress = e / i;
            }
        }
    },
    updateShield: function () {
        var t = this.heroes.reduce(function (t, e) {
            return t + e.shieldValue;
        }, 0);
        var e = this.heroes.reduce(function (t, e) {
            return t + e.item.maxHp;
        }, 0);
        var i = t > 0;
        this.shieldBar.node.active = i;
        this.shieldLabel.node.parent.active = i;
        if (i) {
            this.shieldLabel.string = Math.floor(t);
            this.shieldBar.progress = t / e;
        }
    },
    insertFrameAction: function (t, e) {
        var i = this.frameActions.find(function (e) {
            return e.ms == t;
        });
        if (i) {
            i.cbs.push(e);
        } else {
            this.frameActions.push({
                ms: t,
                cbs: [e]
            });
        }
    },
    insertFrameCB: function (t, e) {
        var i = this.cbId;
        var n = this.cbs.findIndex(function (e) {
            return e.ms > t;
        });
        var o;
        if (-1 == n) {
            o = this.cbs.length;
        } else {
            o = n;
        }
        this.cbs.splice(o, 0, {
            ms: t,
            cb: e,
            id: i
        });
        this.cbId++;
        return i;
    },
    setTimeout: function (t, e, i) {
        if (i) {
            this.clearTimeout(i);
        }
        var n = Math.floor(cc.pvz.time) + e;
        return this.insertFrameCB(n, t);
    },
    clearTimeout: function (t) {
        var e = this.cbs.findIndex(function (e) {
            return e.id == t;
        });
        if (-1 != e) {
            this.cbs.splice(e, 1);
        }
    },
    updateTimeout: function (t, e, i) {
        var n = this.cbs.find(function (t) {
            return t.id == i;
        });
        if (n) {
            return (n.ms += e), i;
        } else {
            return this.setTimeout(t, e, i);
        }
    },
    setInterval: function (t, e) {
        var i = this.cbId;
        this.cbs2.push({
            id: i,
            cb: t,
            ms: Math.floor(cc.pvz.time) + e,
            inteval: e
        });
        this.cbId++;
        return i;
    },
    clearInterval: function (t) {
        var e = this.cbs2.findIndex(function (e) {
            return e.id == t;
        });
        if (-1 != e) {
            this.cbs2.splice(e, 1);
        }
    },
    update: function (t) {
        var e = this;
        if (!this.timePaused) {
            this.t += t;
            this.t;
            var i = 1e3 * this.t;
            if (this.msIndex < this.frameActions.length && i >= this.frameActions[this.msIndex].ms) {
                this.frameActions[this.msIndex].cbs.forEach(function (t) {
                    return t.call(e);
                });
                this.msIndex++;
            }
            if (this.isAngerPressed) {
                cc.pvz.runtimeData.anger -= 125 * t;
                if (cc.pvz.runtimeData.anger <= 0) {
                    this.angerEmptyTip.active = !0;
                    this.stopAngerMode();
                }
            }
            cc.pvz.runtimeData.anger = Math.min(1e3, cc.pvz.runtimeData.anger + 5 * t);
            this.updateAnger();
        }
        for (; this.cbs.length > 0 && cc.pvz.time > this.cbs[0].ms; ) {
            this.cbs.shift().cb.call(this);
        }
        this.cbs2.forEach(function (t) {
            if (cc.pvz.time >= t.ms) {
                t.cb.call(e);
                t.ms += t.inteval;
            }
        });
    },
    startAngerMode: function () {
        if (this.isAngerPressed || this.hasEnded) {
            //
        } else {
            if (cc.pvz.runtimeData.anger > 0) {
                cc.butler.playMusic(this.bgMusic2);
                this.isAngerPressed = !0;
                this.angerBarSp.spriteFrame = this.angerBarSpfs[1];
                this.angerModeNode.active = !0;
                this.heroes.forEach(function (t) {
                    return t.item.startAngerMode();
                });
            }
        }
    },
    stopAngerMode: function () {
        if (this.isAngerPressed) {
            cc.butler.playMusic(this.bag.bgMusic);
            this.isAngerPressed = !1;
            this.angerBarSp.spriteFrame = this.angerBarSpfs[0];
            this.angerModeNode.active = !1;
            this.heroes.forEach(function (t) {
                return t.item.stopAngerMode();
            });
        }
    },
    startTween: function (t) {
        var e = t._union();
        this.node.runAction(cc.targetedAction(t._target, e));
    },
    pauseGame: function () {
        cc.butler.pauseDirector(1);
    },
    resumeGame: function () {
        cc.butler.resumeDirector(1);
    },
    onPopup1st: function () {
        if (this.hasEnded) {
            //
        } else {
            this.timePaused = !0;
        }
    },
    onAllClosed: function () {
        this.timePaused = !1;
    },
    initHeroes: function (t) {
        var e = this;
        this.heroes = [];
        t.blockRoot.boardItemsRoot.children.forEach(function (t, i) {
            var n = t.getComponent("Item");
            cc.pvz.utils.useBundleAsset("actors", "plant/plant" + n.id, cc.Prefab, function (t) {
                var o = cc.instantiate(t);
                var s = o.getComponent("Hero");
                o.position = e.objsRoot.convertToNodeSpaceAR(n.spine.node.convertToWorldSpaceAR(cc.Vec2.ZERO));
                o.parent = e.objsRoot;
                s.initBy(e, n, {
                    json: n.json,
                    index: i,
                    id: n.id,
                    lv1: cc.pvz.PlayerData.getToolData(n.id).lv - 1,
                    maxLv: 0
                });
                s.position2 = o.position.add(n.attOffset);
                n.hero = s;
                n.initHeroNodes();
                e.heroes.push(s);
                e.updateHp(!1);
            });
        });
    },
    hasHero: function (t) {
        return this.heroes.some(function (e) {
            return e.info.id == t && e.hp > 0;
        });
    },
    emitEnemys: function (t) {
        var e = this;
        var i = cc.pvz.runtimeData.wave + 1;
        if (2 == cc.pvz.runtimeData.mode) {
            this.wavePlusHp = 0;
            this.wavePlusAtk = 0;
            if (i > 10) {
                this.wavePlusHp = (i - 10) * this.levelData.hpwave;
                this.wavePlusAtk = (i - 10) * this.levelData.atkwave;
            }
            if (i > 18) {
                i = ((i - 19) % 5) + 14;
            }
        }
        this.enemyCount = 0;
        t.filter(function (t) {
            return t.wave == i;
        }).forEach(function (t) {
            var i = e.t + t.time;
            for (var n = 0; n < t.EnemyNum; n++) {
                var o = 1e3 * (i + n * t.Space);
                e.insertFrameAction(o, function () {
                    e.executeEvent2(t);
                });
            }
            e.enemyCount += t.EnemyNum;
        });
        this.frameActions.sort(function (t, e) {
            return t.ms - e.ms;
        });
    },
    executeEvent2: function (t) {
        var e = this;
        cc.pvz.utils.useBundleAsset("actors", "Zombie/Enemy" + t.EnemyId, cc.Prefab, function (i) {
            e.executeEventNewEnemy(i, t);
        });
    },
    executeEventNewEnemy: function (t, e) {
        var i = cc.instantiate(t);
        var n = cc.math.randomRange(this.groundAreaLB.y, this.groundAreaTR.y);
        var o = e.hp;
        var s = e.atk;
        switch (cc.pvz.runtimeData.actBuff2) {
            case 101:
            case 102:
            case 103:
                o *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff2 - 101];
                break;
            case 107:
            case 108:
            case 109:
                s *= [1.3, 1.4, 1.5][cc.pvz.runtimeData.actBuff2 - 107];
        }
        switch (cc.pvz.runtimeData.mode) {
            case 0:
                o *= this.levelData.hpadd / 100;
                s *= this.levelData.atkadd / 100;
                break;
            case 1:
                o *= 1 + (cc.pvz.PlayerData.getStageLevel() - 9) * this.levelData.hpadd;
                s *= 1 + (cc.pvz.PlayerData.getStageLevel() - 9) * this.levelData.atkadd;
                break;
            case 2:
                o *= 1 + (cc.pvz.PlayerData.getStageLevel() - 5) * this.levelData.hpadd + this.wavePlusHp;
                s *= 1 + (cc.pvz.PlayerData.getStageLevel() - 5) * this.levelData.atkadd + this.wavePlusAtk;
        }
        var c = this.addEnemyIn(e.EnemyId, i, 360, n, o, s);
        if (2 == cc.pvz.runtimeData.mode) {
            c.exp = 0.6 * c.exp;
        }
    },
    addEnemyIn: function (t, e, i, n, o, s) {
        e.parent = this.objsRoot;
        e.x = i;
        e.y = n;
        var c = e.getComponent("Enemy");
        c.initBy(this, this.bulletsRoot, o, s);
        c.id = t;
        c.showHpBar = t > 100;
        this.addEnemy(c);
        return c;
    },
    addEnemy: function (t) {
        this.enemys.push(t);
    },
    delEnemy: function (t) {
        var e = this.enemys.findIndex(function (e) {
            return e == t;
        });
        if (-1 != e) {
            this.enemys.splice(e, 1);
        }
        t.node.parent = null;
        this.enemyCount--;
        if (t.id > 100) {
            this.taskEnemyCount1++;
        } else {
            this.taskEnemyCount2++;
        }
        if ((!this.isLastWave || this.enemyCount > 0) && t.exp > 0) {
            var i = t.exp;
            var n = cc.pvz.runtimeData.getBuffValue(11);
            if (n > 0) {
                i = Math.round(i * (1 + 0.01 * n));
            }
            cc.pvz.runtimeData.exp += i;
            var o = this.hub.lvupJsonFile.json[cc.pvz.runtimeData.lv].exp;
            if (cc.pvz.runtimeData.exp >= o) {
                cc.pvz.runtimeData.exp -= o;
                cc.pvz.runtimeData.lv++;
                cc.butler.playEffectAsync("game", "sound/playerlevelup");
                cc.popupManager.popup(
                    "game",
                    "BuffUI",
                    "UIGameBuff",
                    {
                        scale: !1
                    },
                    this
                );
            } else {
                this.checkIsSucc();
            }
            this.hub.updateExp();
        } else {
            this.checkIsSucc();
        }
    },
    addEnemyHpBar: function (t) {
        if (!t.hpBar) {
            var e = (t.showHpBar ? this.eBossHpPrefab : this.eHpPrefab).addNode(t.node.position);
            cc.find("node", e).position = t.hpBarPos;
            t.hpBar = e.getComponent(cc.ProgressBar);
        }
    },
    checkIsSucc: function () {
        var t = this;
        if (!this.hasEnded && 0 == this.enemyCount) {
            cc.pvz.runtimeData.wave++;
            if (this.taskEnemyCount1 > 0) {
                cc.pvz.PlayerData.addMissionProgress(
                    cc.pvz.GameConfig.MissionType["击败首领n个"],
                    this.taskEnemyCount1
                );
            }
            if (this.taskEnemyCount2 > 0) {
                cc.pvz.PlayerData.addMissionProgress(
                    cc.pvz.GameConfig.MissionType["击败僵尸n个"],
                    this.taskEnemyCount2
                );
            }
            cc.pvz.runtimeData.addMoney(10 + cc.pvz.runtimeData.getBuffValue(5));
            if (this.isLastWave) {
                this.isSucc = !0;
                this.hasEnded = !0;
                this.enabled = !1;
                this.setSpeedLogic(1);
                cc.popupManager.popup(
                    "game",
                    "win",
                    "UIGameEnd",
                    {
                        scale: !1
                    },
                    this
                );
                cc.butler.playEffectAsync("game", "sound/win");
            } else {
                this.waveEndAniSpine.node.active = !0;
                var e = this.moneyIconNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
                var i = this.waveEndAniSpine.node.convertToNodeSpaceAR(e);
                var n = this.waveEndAniSpine.findBone("IK");
                n.x = i.x;
                n.y = i.y;
                this.waveEndAniSpine.setCompleteListener(function () {
                    cc.pvz.runtimeData.autoTimes++;
                    cc.pvz.runtimeData.lv2Count = 1;
                    t.hub.backToBag();
                    t.waveEndAniSpine.node.active = !1;
                    t.waveEndAniSpine.setCompleteListener(null);
                });
            }
            if (0 == cc.pvz.runtimeData.mode) {
                cc.pvz.TAUtils.trackEndLevel(cc.pvz.runtimeData.level, cc.pvz.runtimeData.wave - 1, !0);
            }
        }
    },
    chooseEnemy: function (t, e) {
        if (this.hasEnded) {
            return null;
        }
        var i = this.enemys.filter(function (t) {
            return t.hp > 0;
        });
        var n;
        if (this.isAngerPressed) {
            n = 1e6;
        } else {
            n = e;
        }
        var o = null;
        i.forEach(function (e) {
            var i = e.node.position.sub(t.node.position).lengthSqr();
            if (i < n) {
                n = i;
                o = e;
            }
        });
        return o;
    },
    chooseEnemys: function (t, e, i) {
        var n = this;
        if (this.hasEnded) {
            return null;
        }
        var o = this.enemys.filter(function (i) {
            return (i.hp > 0 && n.isAngerPressed) || i.node.position.sub(t.node.position).lengthSqr() < e;
        });
        if (i >= o.length) {
            return o;
        }
        var s = [];
        for (var c = 0; c < i; c++) {
            var a = cc.math.randomRangeInt(0, o.length);
            s.push(o.splice(a, 1)[0]);
        }
        return s;
    },
    chooseEnemyByBullet: function () {
        if (this.hasEnded) {
            return null;
        }
        var t = this.enemys.filter(function (t) {
            return t.hp > 0;
        });
        return t[cc.math.randomRangeInt(0, t.length)];
    },
    chooseHero: function (t) {
        if (this.hasEnded) {
            return null;
        }
        var e = this.heroes.filter(function (t) {
            return t.hp > 0;
        });
        var i = 1600;
        var n = e[0];
        for (var o = 0; o < e.length; o++) {
            var s;
            if (e[o].position2) {
                s = e[o].position2.x;
            } else {
                s = e[o].node.x;
            }
            var c = Math.abs(s - t.x);
            if (c < i) {
                i = c;
                n = e[o];
            }
        }
        return n;
    },
    chooseMinHpHero: function () {
        var t = 1;
        var e = null;
        for (var i = 0; i < this.heroes.length; i++) {
            if (this.heroes[i].hp > 0) {
                var n = this.heroes[i].hp / this.heroes[i].item.maxHp;
                if (n < t) {
                    t = n;
                    e = this.heroes[i];
                }
            }
        }
        return e;
    },
    getHeroesMaxMarginX: function () {
        return this.heroes
            .filter(function (t) {
                return t.hp > 0;
            })
            .reduce(function (t, e) {
                return Math.max(t, e.node.x + e.item.righMargin);
            }, -360);
    },
    checkIsFail: function () {
        var t = this;
        if (
            this.heroes.some(function (t) {
                return !t.hasDie;
            })
        ) {
            //
        } else {
            this.isSucc = !1;
            this.hasEnded = !0;
            cc.butler.playEffectAsync("game", "sound/fail");
            if (2 == cc.pvz.runtimeData.mode) {
                this.setSpeedLogic(1),
                    cc.popupManager.popup(
                        "rank",
                        "Rankwin",
                        "UIRankEnd",
                        {
                            scale: !1
                        },
                        this
                    );
            } else {
                if (cc.pvz.runtimeData.hasReborn) {
                    this.setSpeedLogic(1),
                        cc.popupManager.popup(
                            "game",
                            "win",
                            "UIGameEnd",
                            {
                                scale: !1
                            },
                            this
                        ),
                        0 == cc.pvz.runtimeData.mode &&
                            cc.pvz.TAUtils.trackEndLevel(cc.pvz.runtimeData.level, cc.pvz.runtimeData.wave, !1);
                } else {
                    cc.popupManager.popup(
                        "game",
                        "fuhuoUI",
                        "UIGameReborn",
                        {
                            scale: !1
                        },
                        function (e) {
                            if (e) {
                                cc.pvz.runtimeData.addMoney(30);
                                cc.pvz.runtimeData.anger = 1e3;
                                cc.pvz.runtimeData.hasReborn = !0;
                                cc.pvz.runtimeData.autoTimes++;
                                cc.pvz.runtimeData.lv2Count = 1;
                                cc.director.loadScene("game1");
                            } else {
                                cc.popupManager.popup(
                                    "game",
                                    "win",
                                    "UIGameEnd",
                                    {
                                        scale: !1
                                    },
                                    t
                                );
                            }
                        }
                    );
                }
            }
        }
    },
    showEnemyHurtNum: function (t, e, i) {
        var n = (1 == t ? this.eHurtCritNum : this.eHurtNum).addNode(e);
        n.x += cc.math.randomRange(-40, 40);
        n.y += 50 + cc.math.randomRange(-10, 40);
        cc.find("num", n).getComponent(cc.Label).string = "-" + Math.max(1, Math.floor(i));
        n.getComponent(cc.Animation).play();
        n.getComponent(cc.Animation).on("finished", function () {
            n.parent = null;
        });
    },
    showJsEffect: function (t, e) {
        if (12 != e) {
            this.eHitPrefab
                .addNode(t)
                .getComponent(sp.Skeleton)
                .setAnimation(0, "zd" + e + "_hit" + cc.math.randomRangeInt(1, 4), !1);
        }
        this.eHitGroundPrefab
            .addNode(t)
            .getComponent(sp.Skeleton)
            .setAnimation(0, "zd" + e + "_js" + cc.math.randomRangeInt(1, 4), !1);
    },
    showHeroHurtNum: function (t, e) {
        var i = this.pHurtNum.addNode(t);
        i.x += cc.math.randomRange(-40, 40);
        i.y += cc.math.randomRange(10, 70);
        cc.find("num", i).getComponent(cc.Label).string = "-" + Math.floor(e);
        i.getComponent(cc.Animation).play();
        i.getComponent(cc.Animation).on("finished", function () {
            i.parent = null;
        });
    },
    onClickSpeed: function () {
        if (cc.pvz.runtimeData.openSpeed) {
            if (1 == cc.pvz.runtimeData.speed) {
                cc.pvz.runtimeData.speed = 2;
            } else {
                cc.pvz.runtimeData.speed = 1;
            }
            this.updateSpeed();
        } else {
            cc.popupManager.popup(
                "game",
                "2speedUI",
                "UISpeed",
                {
                    scale: !1
                },
                this
            );
        }
    },
    updateSpeed: function () {
        this.setSpeedLogic(cc.pvz.runtimeData.speed);
    },
    setSpeedLogic: function (t) {
        sp.timeScale = t;
        cc.director.getScheduler().setTimeScale(t);
    },
    onClickStats: function () {
        if (this.isStatsShown) {
            this.hideStats();
        } else {
            this.statsPanel.active = !0;
            this.isStatsShown = !0;
            this.updateStats();
            this.statsPanel.getComponent(cc.Animation).play().wrapMode = cc.WrapMode.Normal;
            this.statsPanel.getComponent(cc.Animation).off("finished");
        }
    },
    updateStats: function () {
        var t = this;
        if (this.isStatsShown) {
            var e = Math.max(
                1,
                cc.pvz.runtimeData.stats.reduce(function (t, e) {
                    return t + e;
                }, 0)
            );
            this.heroes
                .sort(function (t, e) {
                    return cc.pvz.runtimeData.stats[e.info.id] - cc.pvz.runtimeData.stats[t.info.id];
                })
                .forEach(function (i, n) {
                    if (i.zd) {
                        var o = t.statsItemPrefab.root.children.find(function (t) {
                            return t.__id == i.info.id;
                        });
                        if (o) {
                            //
                        } else {
                            (o = t.statsItemPrefab.addNode()).__id = i.info.id;
                        }
                        o.zIndex = n;
                        var s = cc.pvz.runtimeData.stats[i.info.id];
                        var c = i.info.json;
                        cc.pvz.utils.setSpriteFrame(
                            cc.find("quality", o).getComponent(cc.Sprite),
                            "uiImage",
                            "item/pz_" + c.quality
                        );
                        var a = cc.find("icon", o).getComponent(sp.Skeleton);
                        a.skeletonData = i.spine.skeletonData;
                        a.setAnimation(0, "stand" + (i.item.lv + 1), !0);
                        cc.find("name", o).getComponent(cc.Label).string = c.name;
                        var r = s / e;
                        cc.find("num2", o).getComponent(cc.Label).string = (100 * r).toFixed(2) + "%";
                        cc.find("bar", o).getComponent(cc.ProgressBar).progress = r;
                    }
                });
        }
    },
    hideStats: function () {
        var t = this;
        this.isStatsShown = !1;
        this.statsPanel.getComponent(cc.Animation).play().wrapMode = cc.WrapMode.Reverse;
        this.statsPanel.getComponent(cc.Animation).once("finished", function () {
            t.statsPanel.active = !1;
        });
    }
});
