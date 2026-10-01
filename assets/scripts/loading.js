cc.Class({
    extends: cc.Component,
    properties: {
        progressBar: cc.ProgressBar
    },
    onLoad: function () {
        cc.debug.setDisplayStats(!1);
        var e = cc.RenderFlow.prototype._updateRenderData;
        cc.RenderFlow.prototype._updateRenderData = function (t) {
            if (!t._renderComponent || !t._renderComponent._assembler) {
                t._renderFlag &= ~cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
                return void this._next._func(t);
            }
            e.call(this, t);
        };
        var t = cc.RenderFlow.prototype._render;
        cc.RenderFlow.prototype._render = function (e) {
            if (e._renderComponent && e._renderComponent._assembler) {
                t.call(this, e);
            } else {
                this._next._func(e);
            }
        };
        var o = cc.RenderFlow.prototype._postRender;
        cc.RenderFlow.prototype._postRender = function (e) {
            if (e._renderComponent && e._renderComponent._assembler) {
                o.call(this, e);
            } else {
                this._next._func(e);
            }
        };
    },
    start: function () {
        cc.macro.ENABLE_MULTI_TOUCH = !1;
        cc.pvz.TAUtils.init();
        this.total = 1;
        this.waited = 1;
        this.loadSubpackage("uiImage");
        this.loadSubpackage("mainUI");
        this.loadSubpackage("actors");
        this.loadSubpackage("game");
        this.singleTime = Math.max(0.3, 1.8 / this.total);
        this.barProgress = 0;
        this.progressBar.progress = 0;
        this.updateProgress();
    },
    updateProgress: function () {
        var e = (this.barProgress + 1) / this.total;
        cc.tween(this.progressBar)
            .to(this.singleTime, {
                progress: e
            })
            .start();
    },
    initData: function () {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.setKeepScreenOn({
                keepScreenOn: !0
            });
            wx.onError(function (e) {
                cc.pvz.TAUtils.track("error", {
                    message: e.message,
                    stack: e.stack
                });
            });
        }
        cc.isControlAd = !0;
        cc.pvz.AdUtils.initAllAds();
        cc.pvz.PlayerData.initPlayerData();
        this.onResReady();
    },
    onProgressChanged: function () {
        this.barProgress++;
        this.updateProgress();
    },
    onResReady: function () {
        this.onProgressChanged();
        this.waited -= 1;
        if (1 == this.waited) {
            this.initData();
        } else {
            if (0 == this.waited) {
                this.onAllResReady();
            }
        }
    },
    loadSubpackage: function (e) {
        var t = this;
        if (cc.assetManager.getBundle(e)) {
            this.onResReady();
        } else {
            this.total++;
            this.waited++;
            cc.assetManager.loadBundle(e, null, function (o) {
                if (o) {
                    console.log("load subpackage " + e + " fail:", o);
                } else {
                    console.log("load subpackage " + e);
                    t.onResReady();
                }
            });
        }
    },
    onAllResReady: function () {
        var e = this;
        cc.pvz.cloud.login(function () {
            if (cc.pvz.cloud.baseData.length > 2) {
                var t = JSON.parse(cc.pvz.cloud.baseData);
                console.log("server t:", t.t, ", local t:", cc.player.t, "s version:", t.dataVersion);
                var o;
                if (cc.player.achievePro.hasOwnProperty(cc.pvz.GameConfig.MissionType["装备总等级n"])) {
                    o = cc.player.achievePro[cc.pvz.GameConfig.MissionType["装备总等级n"]];
                } else {
                    o = 0;
                }
                var a;
                if (t.achievePro.hasOwnProperty(cc.pvz.GameConfig.MissionType["装备总等级n"])) {
                    a = t.achievePro[cc.pvz.GameConfig.MissionType["装备总等级n"]];
                } else {
                    a = 0;
                }
                if (t.t > cc.player.t || a > o) {
                    cc.player = t;
                    cc.pvz.PlayerData.postLoadData();
                }
            }
            cc.pvz.TAUtils.uploadLoginData({
                uid: cc.pvz.cloud.uid,
                name: cc.pvz.cloud.name,
                level: cc.pvz.PlayerData.getStageLevel()
            });
            e.checkIntoGame();
        });
        cc.pvz.TAUtils.initShareKey();
        cc.pvz.TAUtils.initShareConfig();
    },
    checkIntoGame: function () {
        if (1 == cc.pvz.PlayerData.getStageLevel()) {
            cc.pvz.runtimeData.init(0, 1);
            cc.director.loadScene("game1");
            cc.pvz.TAUtils.trackBackpack(1);
        } else {
            cc.director.loadScene("mainUI");
        }
    }
});
