var $prefabInfo = require("../../scripts/PrefabInfo");
cc.Class({
    extends: cc.Component,
    properties: {
        bagRoot: cc.Node,
        gameRoot: cc.Node,
        ani: cc.Animation,
        actBuffPanel: cc.Node,
        moneyLabel: cc.Label,
        waveLabel: cc.Label,
        lvLabel: cc.Label,
        expBar: cc.ProgressBar,
        lvupEffect: $prefabInfo,
        lvupAudio: cc.AudioClip,
        levelsJsonFile: cc.JsonAsset,
        lvupJsonFile: cc.JsonAsset
    },
    onLoad: function () {
        this.bagRoot.active = !0;
        this.bag = this.bagRoot.getComponent("game1");
        this.gameRoot.active = !1;
        this.game = this.gameRoot.getComponent("game");
        this.game.enabled = !1;
        this.bag.hub = this;
        this.bag.game = this.game;
        this.game.hub = this;
        this.game.bag = this.bag;
    },
    start: function () {
        this.actBuffPanel.active = 1 == cc.pvz.runtimeData.mode;
        if (this.actBuffPanel.active) {
            this.actBuffPanel.getComponent("ActBuffPanel").initActBuffInfo();
        }
        var t = null;
        switch (cc.pvz.runtimeData.mode) {
            case 0:
                t = this.levelsJsonFile.json[cc.pvz.runtimeData.level - 1];
                break;
            case 1:
                t = cc.JsonControl.ActLevelJson[cc.pvz.runtimeData.level - 1];
                break;
            case 2:
                t = cc.JsonControl.rankLevelJsonFile.json[0];
        }
        this.levelData = t;
        this.updateLevel();
        this.updateExp();
        this.updateMoney();
        cc.butler.node.on("money", this.onGetMoney, this);
    },
    onPopup1st: function () {
        if (this.bag.onPopup1st) {
            this.bag.onPopup1st();
        }
        if (this.game.onPopup1st) {
            this.game.onPopup1st();
        }
    },
    onAllClosed: function () {
        if (this.bag.onAllClosed) {
            this.bag.onAllClosed();
        }
        if (this.game.onAllClosed) {
            this.game.onAllClosed();
        }
    },
    onGetMoney: function () {
        this.updateMoney();
    },
    updateLevel: function () {
        if (2 == cc.pvz.runtimeData.mode) {
            this.waveLabel.string = "第" + (cc.pvz.runtimeData.wave + 1) + "波";
        } else {
            this.waveLabel.node.active = this.levelData.wave > 0;
            this.waveLabel.node.active &&
                (this.waveLabel.string = "第" + (cc.pvz.runtimeData.wave + 1) + "/" + this.levelData.wave + "波");
        }
    },
    updateMoney: function () {
        this.moneyLabel.string = cc.pvz.runtimeData.money;
    },
    updateExp: function () {
        var t = this.lvupJsonFile.json[cc.pvz.runtimeData.lv].exp;
        this.lvLabel.string = cc.pvz.runtimeData.lv + 1;
        this.expBar.progress = cc.pvz.runtimeData.exp / t;
    },
    showLvupEffect: function (t) {
        this.lvupEffect.addNodeByWorldPos(t);
        cc.butler.playEffect(this.lvupAudio);
    },
    onClickStart: function () {
        var t = this;
        if (this.bag.checkStartGame(this.onClickStart)) {
            this.ani.play("bag-to-game").wrapMode = cc.WrapMode.Normal;
            this.ani.once("finished", function () {
                t.game.cbs = [];
                t.bag.onClickStart(t.game);
                t.game.startLogic(t.bag);
            });
        }
    },
    backToBag: function () {
        var t = this;
        this.game.onBackFromGame();
        this.bag.onBackFromGame();
        this.updateLevel();
        this.ani.play("bag-to-game").wrapMode = cc.WrapMode.Reverse;
        this.ani.once("finished", function () {
            if (cc.pvz.runtimeData.autoTimes > 0) {
                cc.pvz.runtimeData.autoTimes--;
                t.bag.doRefreshLogic(!0);
                t.bag.saveRuntimeData();
            }
        });
    },
    onClickPause: function () {
        cc.popupManager.popup("game", "fightset", "UIGamePause", {
            scale: !1
        });
    }
});
