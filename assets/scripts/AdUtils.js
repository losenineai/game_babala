var o = null;
var a = null;
var n = null;
var i = [0];
var c = {
    initAllAds: function () {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            o = wx.getLaunchOptionsSync();
        }
        if (cc.isControlAd) {
            this.initP8AdInfo();
        }
    },
    getLaunchOptions: function () {
        return o;
    },
    isWhiteList: function () {
        return (
            cc.sys.platform != cc.sys.WECHAT_GAME ||
            this.isWhiteListSceneId() ||
            cc.pvz.TAUtils.getTwtraceidSwitch(cc.pvz.GameConst.Twtraceid_YXBN) ||
            cc.pvz.TAUtils.getTwtraceidSwitch(cc.pvz.GameConst.Twtraceid_YXSP)
        );
    },
    isWhiteListSceneId: function () {
        return (
            cc.sys.platform != cc.sys.WECHAT_GAME ||
            -1 !=
                [1095].findIndex(function (e) {
                    return e == o.scene;
                })
        );
    },
    getTwtraceidFrom: function (e) {
        if (Object.keys(e.query).length > 0) {
            for (var t in e.query) {
                if ("?twtraceid" == t) {
                    return e.query[t];
                }
                if ("twtraceid" == t) {
                    return e.query[t];
                }
            }
        }
        return "";
    },
    callRewardAdCallback: function (e) {
        cc.butler.resumeDirector(0);
        if (this.hasCalledCB) {
            console.log("callRewardAdCallback but hascalled");
        } else {
            e &&
                (cc.player.adTimes++,
                cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["观看广告n次"], 1),
                cc.pvz.PlayerData.saveData(),
                cc.pvz.TAUtils.trackP8AdSucc(this.rewardVideoIndex));
            if (this.cb) {
                this.cb(e), cc.butler.node.emit("ad"), (this.hasCalledCB = !0);
            } else {
                cc.pvz.TAUtils.track("error", {
                    message: "Ad",
                    stack: "cb is null,isEnded:" + e + ",index:" + this.rewardVideoIndex
                });
            }
        }
    },
    createRewardAd: function (e) {
        var t = this;
        var o = wx.createRewardedVideoAd({
            adUnitId: cc.pvz.GameConst.AD_UNITS_REWARD[e],
            multiton: !0
        });
        o.onLoad(function () {
            console.log("RewardedVideoAd onLoad", e);
        });
        o.onError(function (t) {
            console.log("RewardedVideoAd onError", e, t);
            cc.pvz.TAUtils.track("adError", {
                errCode: t.errCode || t.err_code,
                errMsg: t.errMsg
            });
        });
        o.onClose(function (e) {
            if ((e && e.isEnded) || void 0 === e) {
                t.callRewardAdCallback(!0);
                cc.pvz.TAUtils.trackAdClose(t.rewardVideoIndex, !0);
            } else {
                t.callRewardAdCallback(!1);
                cc.pvz.TAUtils.trackAdClose(t.rewardVideoIndex, !1);
            }
        });
        return o;
    },
    createPublicRewardAd: function (e) {
        var t = this;
        var o = !n;
        n = wx.createRewardedVideoAd({
            adUnitId: cc.pvz.GameConst.AD_UNITS_REWARD[e]
        });
        if (o) {
            n.onLoad(function () {
                console.log("RewardedVideoAd onLoad");
            });
            n.onError(function (e) {
                console.log("RewardedVideoAd onError", e);
            });
            n.onClose(function (e) {
                if ((e && e.isEnded) || void 0 === e) {
                    t.callRewardAdCallback(!0);
                    cc.pvz.TAUtils.trackAdClose(t.rewardVideoIndex, !0);
                } else {
                    t.callRewardAdCallback(!1);
                    cc.pvz.TAUtils.trackAdClose(t.rewardVideoIndex, !1);
                }
            });
        }
    },
    initP8AdInfo: function () {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            P8SDK.wxADinit(cc.pvz.GameConst.AD_UNITS_REWARD[0], null, null, null);
        }
    },
    initRewardVideo: function () {
        var e = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            a = new Array(cc.pvz.GameConst.AD_UNITS_REWARD.length).fill(null);
            if ("devtools" != (wx.getDeviceInfo ? wx.getDeviceInfo() : wx.getSystemInfoSync()).platform) {
                i.forEach(function (t) {
                    a[t] = e.createRewardAd(t);
                }),
                    console.log("initRewardVideo ended");
            } else {
                console.log("initRewardVideo skiped");
            }
        }
    },
    showAdRewardVideo: function (e, t) {
        console.log("showAdRewardVideo", e);
        if (cc.isControlAd) {
            var o = this;
            o.cb = t;
            o.rewardVideoIndex = e;
            o.hasCalledCB = !1;
            if (
                10 == cc.player.adTimes &&
                [
                    cc.pvz.GameConfig.AdType["广告格子"],
                    cc.pvz.GameConfig.AdType["buff刷新"],
                    cc.pvz.GameConfig.AdType["buff全部"],
                    cc.pvz.GameConfig.AdType["关卡结算"],
                    cc.pvz.GameConfig.AdType["阳光"],
                    cc.pvz.GameConfig.AdType["死亡复活"],
                    cc.pvz.GameConfig.AdType["双倍速度"]
                ].some(function (t) {
                    return t == e;
                })
            ) {
                return void cc.pvz.TAUtils.share(e, function (e) {
                    o.callRewardAdCallback(e);
                });
            }
            cc.pvz.TAUtils.trackP8AdClick(e);
            if (
                cc.sys.platform == cc.sys.WIN32 ||
                cc.sys.platform == cc.sys.MACOS ||
                cc.sys.platform == cc.sys.DESKTOP_BROWSER ||
                cc.sys.platform == cc.sys.MOBILE_BROWSER
            ) {
                cc.popupManager.showToast("广告" + e);
                return void o.callRewardAdCallback(!0);
            }
            if (cc.pvz.cloud.access >= 90) {
                o.callRewardAdCallback(!0);
            } else {
                cc.butler.pauseDirector(0);
                P8SDK.videoADShow(
                    function () {
                        o.callRewardAdCallback(!0);
                    },
                    function () {
                        o.callRewardAdCallback(!1);
                    },
                    function () {
                        cc.popupManager.showToast("暂无广告可看");
                        o.callRewardAdCallback(!1);
                    }
                );
            }
        } else {
            cc.popupManager.showToast("暂无广告可看");
        }
    },
    showAdBanner: function (e) {
        if (void 0 === e) {
            e = !1;
        }
    },
    hideAdBanner: function () {}
};
if (cc.pvz) {
    //
} else {
    cc.pvz = {};
}
cc.pvz.AdUtils = c;
module.exports = c;
