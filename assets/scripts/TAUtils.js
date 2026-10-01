var o = 0;
var a = {
    init: function () {},
    initShareConfig: function () {
        var e = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.onShareAppMessage(function () {
                o = e.getShareIndex();
                return {
                    title: cc.pvz.GameConfig.ShareTitileList[o],
                    imageUrlId: cc.pvz.GameConfig.ShareIDList[o],
                    imageUrl: cc.pvz.GameConfig.ShareUrlList[o],
                    query: "fromuid=" + (cc.pvz.cloud.uid ? cc.pvz.cloud.uid : 0)
                };
            });
            wx.showShareMenu({
                withShareTicket: !0,
                menus: ["shareAppMessage", "shareTimeline"]
            });
        }
    },
    share: function (e, t) {
        console.log("share", e);
        if (this.lastShareType != e) {
            this.shareIndex = 0;
            this.lastShareType = e;
        }
        o = this.getShareIndex();
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            cc.popupManager.showToast("分享");
            return void t(!0);
        }
        var a = {
            title: cc.pvz.GameConfig.ShareTitileList[o],
            imageUrlId: cc.pvz.GameConfig.ShareIDList[o],
            imageUrl: cc.pvz.GameConfig.ShareUrlList[o],
            query: "fromuid=" + (cc.pvz.cloud.uid ? cc.pvz.cloud.uid : 0)
        };
        this.isFromShare = !0;
        this.shareCB = t;
        this.shareDate = Date.now();
        wx.shareAppMessage(a);
    },
    shareCurrent: function (e, t) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            var o = {
                title: e,
                query: "fromuid=" + (cc.pvz.cloud.uid ? cc.pvz.cloud.uid : 0)
            };
            wx.shareAppMessage(o);
        } else {
            t(!0);
        }
    },
    getShareIndex: function () {
        return 0;
    },
    onWxShow: function () {
        if (this.isFromShare && this.shareCB) {
            this.shareCB(!0);
            this.shareIndex++;
        }
        this.isFromShare = !1;
    },
    getGlobalConfig: function () {
        return cc.pvz.utils
            .sendMsg(cc.pvz.GameConst.SERVER_CONFIG_URL, null, "GET")
            .then(function (e) {
                return Promise.resolve(e);
            })
            .catch(function (e) {
                console.log("getGlobalConfig data error", e);
                return Promise.resolve({});
            });
    },
    getSwitch: function (e) {
        if (!cc.gameGlobalConfig) {
            return !1;
        }
        var t;
        if (cc.gameGlobalConfig.buttonCfgList) {
            t = cc.gameGlobalConfig.buttonCfgList.find(function (t) {
                return t.button_name == e;
            });
        } else {
            t = null;
        }
        if (t) {
            return console.log("getSwitch", e, !!t.flag && 1 == t.flag), !!t.flag && 1 == t.flag;
        } else {
            return console.log("getSwitch using default", e, !1), !1;
        }
    },
    getSwitchAd: function () {
        return !0;
    },
    initShareKey: function () {},
    getTwtraceidSwitch: function (e) {
        if (void 0 === e) {
            e = "yxbn";
        }
        return (
            cc.sys.platform != cc.sys.WECHAT_GAME ||
            ((cc.Twtraceid = this.getTwtraceidFrom(wx.getLaunchOptionsSync())), cc.Twtraceid == e)
        );
    },
    getThreshold: function (e, t) {
        if (cc.gameGlobalConfig.valueCfgList) {
            var o = cc.gameGlobalConfig.valueCfgList.find(function (t) {
                return t.value_name == e;
            });
            if (o) {
                console.log("getThreshold", e, o.value_num);
                return o.value_num;
            }
        }
        console.log("getThreshold using default", e, t);
        return t;
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
    onCheckGameVersion: function () {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            console.log("onCheckGameVersion");
            var e = wx.getUpdateManager();
            e.onCheckForUpdate(function (e) {
                console.log("请求完新版本信息的回调 : ", e.hasUpdate);
            });
            e.onUpdateReady(function () {
                wx.showModal({
                    title: "更新提示",
                    content: "新版本已准备就绪，请重启游戏！",
                    confirmText: "重启游戏",
                    showCancel: !1,
                    success: function (t) {
                        if (t.confirm) {
                            e.applyUpdate();
                        }
                    }
                });
            });
            e.onUpdateFailed(function () {});
        }
    },
    uploadRegisterData: function (e) {
        if (
            cc.sys.platform != cc.sys.DESKTOP_BROWSER &&
            cc.sys.platform != cc.sys.WIN32 &&
            cc.sys.platform != cc.sys.MOBILE_BROWSER
        ) {
            console.log("准备上报注册信息");
            var t = {
                sid: "1",
                roleid: e.uid + "",
                rolename: "玩家" + e.uid,
                level: "1"
            };
            P8LogSDK.signLog(t).then(function (e) {
                console.log("已上报注册信息:", e);
            });
        }
    },
    uploadLoginData: function (e) {
        if (
            cc.sys.platform != cc.sys.DESKTOP_BROWSER &&
            cc.sys.platform != cc.sys.WIN32 &&
            cc.sys.platform != cc.sys.MOBILE_BROWSER
        ) {
            console.log("准备上报登录信息");
            var t = {
                sid: "1",
                roleid: e.uid + "",
                rolename: "NONAME" === e.name ? "玩家" + e.uid : e.name,
                level: e.level + "",
                vip: "1",
                oaid: ""
            };
            P8LogSDK.pushLoginData(t).then(function (e) {
                console.log("已上报登录信息:", e);
            });
        }
    },
    uploadLvUpData: function () {
        if (
            cc.sys.platform != cc.sys.DESKTOP_BROWSER &&
            cc.sys.platform != cc.sys.WIN32 &&
            cc.sys.platform != cc.sys.MOBILE_BROWSER
        ) {
            console.log("准备上报升级信息");
            var e = {
                level: "" + cc.player.level,
                sid: "1",
                roleid: "" + cc.pvz.cloud.uid,
                rolename: "" + cc.pvz.cloud.name,
                vip: "1",
                oaid: ""
            };
            P8LogSDK.upGradeRecord(e).then(function (e) {
                console.log("已上报登录信息:", e);
            });
        }
    },
    trackP8AdClick: function (e) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            var t = {
                sid: "1",
                uid: "" + cc.pvz.cloud.uid,
                roleid: "" + cc.pvz.cloud.uid,
                rolename: "玩家" + cc.pvz.cloud.uid,
                level: "" + cc.player.level,
                ad_slot: "" + cc.pvz.GameConfig.AdType[e],
                ad_unit_id: cc.pvz.GameConst.AD_UNITS_REWARD[0],
                type: "RewardedVideoAd",
                status: "0"
            };
            P8LogSDK.wxVideoLog(t).then(function (e) {
                console.log(e);
            });
        }
    },
    trackP8AdSucc: function (e) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            var t = {
                sid: "1",
                uid: "" + cc.pvz.cloud.uid,
                roleid: "" + cc.pvz.cloud.uid,
                rolename: "勇士" + cc.pvz.cloud.uid,
                level: "" + cc.player.level,
                ad_slot: "" + cc.pvz.GameConfig.AdType[e],
                ad_unit_id: cc.pvz.GameConst.AD_UNITS_REWARD[0],
                type: "RewardedVideoAd",
                status: "1"
            };
            P8LogSDK.wxVideoLog(t).then(function (e) {
                console.log(e);
            });
        }
    },
    track: function () {},
    trackLogin: function () {},
    trackLoading: function (e, t) {
        if (void 0 === t) {
            t = 0;
        }
    },
    trackBackpack: function () {},
    trackLevel: function () {},
    trackEndLevel: function () {},
    trackAdUIShow: function () {},
    trackAdBtnClick: function () {},
    trackAdClose: function () {},
    trackAdEnd: function () {},
    trackSystemUI: function () {}
};
if (cc.pvz) {
    //
} else {
    cc.pvz = {};
}
cc.pvz.TAUtils = a;
module.exports = a;
