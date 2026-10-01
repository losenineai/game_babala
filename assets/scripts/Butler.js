cc.Class({
    extends: cc.Component,
    properties: {
        loadingBar: cc.ProgressBar
    },
    onLoad: function () {
        cc.butler = this;
        this.dFlag = 0;
        cc.pvz.time = 0;
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, this.beforeDirectorUpdate, this);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.polyfillSafeArea();
        }
    },
    polyfillSafeArea: function () {
        if (wx.getSystemInfoSync().safeArea) {
            //
        } else {
            console.log("polyfill safeArea");
            cc.sys.getSafeAreaRect = function () {
                var e = cc.view.getVisibleSize();
                return cc.rect(0, 0, e.width, e.height);
            };
        }
    },
    beforeDirectorUpdate: function () {
        if (this.checkToHandleGameHide) {
            this.handleGameHide();
        }
        var e = 1e3 * cc.director.getDeltaTime();
        cc.pvz.time += e * cc.director.getScheduler().getTimeScale();
        if (cc.pvz.cloud && cc.pvz.cloud.uid && cc.pvz.cloud.needSaveToCloud > 0) {
            cc.pvz.PlayerData.saveDataToLocalOnline();
            cc.pvz.cloud.needSaveToCloud = 0;
        }
    },
    start: function () {
        var e = this;
        cc.game.addPersistRootNode(this.node);
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.onHide(function () {
                console.log("wx.onHide");
                e.handleGameHide();
            });
            wx.onShow(function () {
                console.log("wx.onShow");
                e.handleGameShow();
                cc.pvz.TAUtils.onWxShow();
            });
        } else {
            if (cc.sys.platform == cc.sys.BYTEDANCE_GAME) {
                tt.onHide(function () {
                    console.log("tt.onHide");
                    e.handleGameHide();
                }),
                    tt.onShow(function () {
                        console.log("tt.onShow");
                        e.handleGameShow();
                    });
            } else {
                cc.game.on(cc.game.EVENT_HIDE, function () {
                    console.log("cc.game.EVENT_HIDE, frame:", cc.director.getTotalFrames());
                    e.handleGameHide();
                }),
                    cc.game.on(cc.game.EVENT_SHOW, function () {
                        console.log("cc.game.EVENT_SHOW, frame:", cc.director.getTotalFrames());
                        e.handleGameShow();
                    });
            }
        }
        cc.pvz.TAUtils.onCheckGameVersion();
    },
    handleGameHide: function () {
        console.log("handleGameHide");
        this.pauseMusic();
        cc.audioEngine.stopAllEffects();
        if (cc.isRestart) {
            //
        } else {
            this.saveData();
        }
    },
    handleGameShow: function () {
        this.resumeMusic();
    },
    pauseDirector: function (e) {
        if (0 == this.dFlag) {
            cc.director.pause();
        }
        this.dFlag |= 1 << e;
    },
    resumeDirector: function (e) {
        this.dFlag &= ~(1 << e);
        if (0 == this.dFlag) {
            cc.director.resume();
        }
    },
    playMusic: function (e) {
        this.music = e;
        if (cc.player && cc.player.isMMute) {
            //
        } else {
            this.playingMusic = e;
            if (e) {
                console.log("playmusic");
                cc.audioEngine.playMusic(e, !0);
            }
        }
    },
    pauseMusic: function () {
        cc.audioEngine.pauseMusic();
    },
    resumeMusic: function () {
        if (cc.player && cc.player.isMMute) {
            console.log("resumeMusic return");
        } else {
            if (this.music != this.playingMusic) {
                console.log("resumeMusic play new"), this.playMusic(this.music);
            } else {
                console.log("resumeMusic resume old"), cc.audioEngine.resumeMusic();
            }
        }
    },
    playEffect: function (e, t) {
        if (void 0 === t) {
            t = !1;
        }
        return cc.player && cc.player.isSMute ? -1 : e ? cc.audioEngine.playEffect(e, t) : -1;
    },
    resumeEffect: function (e) {
        if (cc.player && cc.player.isSMute) {
            return -1;
        }
        cc.audioEngine.resumeEffect(e);
    },
    playEffectAsync: function (e, t, o) {
        var a = this;
        if (void 0 === o) {
            o = !1;
        }
        if (!cc.player || !cc.player.isSMute) {
            var n = null;
            if (o) {
                if (this.exclusiveMap) {
                    //
                } else {
                    this.exclusiveMap = {};
                }
                n = e + t;
                if (this.exclusiveMap[n]) {
                    return;
                }
                this.exclusiveMap[n] = !0;
            }
            cc.pvz.utils.useBundleAsset(e, t, cc.AudioClip, function (e) {
                if (o) {
                    var t = a.playEffect(e, !1);
                    if (-1 == t) {
                        a.exclusiveMap[n] = !1;
                    } else {
                        cc.audioEngine.setFinishCallback(t, function () {
                            a.exclusiveMap[n] = !1;
                        });
                    }
                } else {
                    a.playEffect(e, !1);
                }
            });
        }
    },
    playEffectAsync2: function (e) {
        if (!cc.player || !cc.player.isSMute) {
            var t = e.indexOf(",");
            this.playEffectAsync(e.substring(0, t), e.substring(t + 1));
        }
    },
    setMusicSwitch: function (e) {
        if (cc.player.isMMute != e) {
            this.node.emit("music-switch", e);
        }
        this.setMusicMute(e);
        if (cc.player.isMMute) {
            this.pauseMusic();
        } else {
            this.resumeMusic();
        }
    },
    setSoundSwitch: function (e) {
        this.setSoundMute(e);
        if (cc.player.isSMute) {
            cc.audioEngine.stopAllEffects();
        }
    },
    saveData: function () {
        cc.pvz.PlayerData.saveData();
    },
    setMusicMute: function (e) {
        cc.player.isMMute = e;
        cc.pvz.PlayerData.onDataChanged();
    },
    setSoundMute: function (e) {
        cc.player.isSMute = e;
        cc.pvz.PlayerData.onDataChanged();
    },
    onToggleMusic: function (e) {
        console.log("onToggleMusic", e.isChecked);
        this.setMusicSwitch(!e.isChecked);
        this.setSoundSwitch(!e.isChecked);
    },
    loadBundles: function (e, t, o) {
        var a = this;
        if (this.loadingBar) {
            this.loadingBar.progress = 0;
        }
        this.loadedBundle = 0;
        cc.assetManager.loadBundle(e[0], null, function n(i, c) {
            if (i) {
                console.log("load subpackage  fail:", i);
            } else {
                console.log("load bundle " + c.name + " successfully.");
                a.loadedBundle++;
                if (a.loadedBundle == e.length) {
                    o && o();
                } else {
                    cc.assetManager.loadBundle(e[a.loadedBundle], null, n);
                }
                a.loadingBar &&
                    cc
                        .tween(a.loadingBar)
                        .to(0.2, {
                            progress: (a.loadedBundle + 1) / t
                        })
                        .start();
            }
        });
        if (this.loadingBar) {
            cc.tween(this.loadingBar)
                .to(0.2, {
                    progress: (this.loadedBundle + 1) / t
                })
                .start();
        }
    }
});
