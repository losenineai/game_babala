cc.Class({
    extends: cc.Component,
    properties: {
        shopRed: cc.Node,
        battleRed: cc.Node,
        toolLvRed: cc.Node,
        actLevelRed: cc.Node,
        rankRed: cc.Node,
        signRed: cc.Node,
        shareRed: cc.Node,
        missionRed: cc.Node,
        fundRed: cc.Node,
        game2Red: cc.Node
    },
    onLoad: function () {
        cc.RedControl = this;
    },
    refreshAllRedTip: function () {
        this.onCheckShopRed();
        this.onCheckBattleRed();
        this.onCheckToolLvRed();
        this.onCheckActLevelRed();
        this.onChecRankRed();
        this.onCheckSignRed();
        this.onCheckShareRed();
        this.onCheckMissionRed();
        this.onCheckGame2Red();
    },
    onChecRankRed: function () {
        if (cc.pvz.PlayerData.getStageLevel() <= cc.pvz.GameConfig.OpenSysLv[1]) {
            this.rankRed.active = !1;
        } else {
            if (new Date().getDate() == cc.player.gameDate) {
                this.rankRed.active = cc.player.rankCount > 0;
            } else {
                this.rankRed.active = !0;
            }
        }
    },
    onCheckMissionRed: function () {
        cc.pvz.PlayerData.checkAndResetDayMission();
        cc.pvz.PlayerData.checkAndResetWeekMission();
        if (this.onCheckDayMissionRed() || this.onCheckWeekMissionRed() || this.onCheckAchieveMissionRed()) {
            this.missionRed.active = !0;
        } else {
            this.missionRed.active = !1;
        }
    },
    onCheckDayMissionRed: function () {
        var e = cc.JsonControl.getAllDayMissionJson();
        for (var t = 0; t < e.length; t++) {
            var i = e[t];
            var o = cc.pvz.PlayerData.getDayMissionData(i.func);
            if (!o.isReward && o.pro >= i.need) {
                return !0;
            }
        }
        var a = cc.JsonControl.getDayMissionBoxJson();
        var c = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["日常任务积分"]);
        for (var s = 0; s < a.length; s++) {
            var n = a[s];
            if (!cc.pvz.PlayerData.getDayBoxData(n.ID).isReward && c >= n.score) {
                return !0;
            }
        }
        return !1;
    },
    onCheckWeekMissionRed: function () {
        var e = cc.JsonControl.getAllWeekMissionJson();
        for (var t = 0; t < e.length; t++) {
            var i = e[t];
            var o = cc.pvz.PlayerData.getWeekMissionData(i.func);
            if (!o.isReward && o.pro >= i.need) {
                return !0;
            }
        }
        var a = cc.JsonControl.getWeekMissionBoxJson();
        var c = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["周常任务积分"]);
        for (var s = 0; s < a.length; s++) {
            var n = a[s];
            if (!cc.pvz.PlayerData.getWeekBoxData(n.ID).isReward && c >= n.score) {
                return !0;
            }
        }
        return !1;
    },
    onCheckAchieveMissionRed: function () {
        var e = cc.JsonControl.getAllAchieveJson();
        var t = Math.floor(e[e.length - 1].ID / 100);
        for (var i = 0; i < t; i++) {
            var o = i + 1;
            var a = cc.pvz.PlayerData.getAchieveData(o);
            if (!a.end) {
                var c = 100 * o + a.lv;
                var s = cc.JsonControl.getAchieveJson(c);
                var n = cc.pvz.PlayerData.getAchieveProgress(s.func);
                if (s.need[0] <= n) {
                    return !0;
                }
            }
        }
        return !1;
    },
    onCheckSignRed: function () {
        cc.pvz.PlayerData.checkAndResetSign();
        var e = cc.pvz.PlayerData.getSignData();
        this.signRed.active = !e.isReward;
    },
    onCheckShopRed: function () {
        if (new Date().getDate() == cc.player.shopDate) {
            if (1 != cc.pvz.PlayerData.getShopTimes(cc.pvz.GameConfig.ShopTimesType["钻石免费"])) {
                if (7 != cc.pvz.PlayerData.getShopTimes(cc.pvz.GameConfig.ShopTimesType["金币免费"])) {
                    var e = cc.player.shopBoxData.date[0];
                    if (-1 != e) {
                        if (Math.floor((Date.now() - e) / 1e3) >= cc.pvz.GameConfig.ShopBoxCD[0]) {
                            this.shopRed.active = !0;
                        } else {
                            this.shopRed.active = !1;
                        }
                    } else {
                        this.shopRed.active = !0;
                    }
                } else {
                    this.shopRed.active = !0;
                }
            } else {
                this.shopRed.active = !0;
            }
        } else {
            this.shopRed.active = !0;
        }
    },
    onCheckBattleRed: function () {
        cc.pvz.PlayerData.checkAndResetGameDate();
        cc.pvz.PlayerData.checkAndResetSign();
        if (cc.pvz.PlayerData.getSignData().isReward) {
            var e = cc.pvz.PlayerData.getStageLevel();
            var t = cc.pvz.PlayerData.getMaxLevelWave();
            for (var i = e; i > 0; i--) {
                var o = e > i;
                var a = cc.pvz.PlayerData.getLevelBoxData(i);
                var c = cc.JsonControl.getLevelJson(i);
                for (var s = 0; s < a.length; s++) {
                    var n = c["wave" + (s + 1)];
                    if (0 == a[s]) {
                        if (o) {
                            return void (this.battleRed.active = !0);
                        }
                        if (t >= n && e == s) {
                            return void (this.battleRed.active = !0);
                        }
                    }
                }
            }
            cc.pvz.PlayerData.checkAndResetDayMission();
            cc.pvz.PlayerData.checkAndResetWeekMission();
            if (this.onCheckDayMissionRed() || this.onCheckWeekMissionRed() || this.onCheckAchieveMissionRed()) {
                this.battleRed.active = !0;
            } else {
                this.battleRed.active = !1;
            }
        } else {
            this.battleRed.active = !0;
        }
    },
    onCheckToolLvRed: function () {
        var e = [];
        var t = cc.pvz.PlayerData.getStageLevel();
        for (var i = 0; i < cc.pvz.GameConfig.MaxToolCount; i++) {
            var o = i + 1;
            if (cc.pvz.GameConfig.ToolLockLevel[i] < t) {
                e.push(o);
            }
        }
        for (var a = 0; a < e.length; a++) {
            var c = e[a];
            var s = cc.pvz.PlayerData.getToolData(c);
            if (s.lv < cc.pvz.GameConfig.MaxToolLv) {
                var n = cc.JsonControl.getToolJson(c);
                var r = cc.JsonControl.getToolLvUpJson(s.lv);
                var h = r["sp" + n.quality];
                if (s.c >= h) {
                    var p = r["coins" + n.quality];
                    if (cc.pvz.PlayerData.isItemEnough(cc.pvz.GameConfig.ItemType["金币"], p)) {
                        return void (this.toolLvRed.active = !0);
                    }
                }
            }
        }
        if (cc.pvz.PlayerData.isEnoughArrayTool()) {
            this.toolLvRed.active = !1;
        } else {
            this.toolLvRed.active = !0;
        }
    },
    onCheckActLevelRed: function () {
        if (cc.pvz.PlayerData.getStageLevel() <= cc.pvz.GameConfig.OpenSysLv[0]) {
            this.actLevelRed.active = !1;
        } else if (new Date().getDate() == cc.player.actLevelDate) {
            var e = cc.pvz.PlayerData.getActLevelData();
            if (e.times > 0) {
                this.actLevelRed.active = !0;
            } else {
                var t = cc.JsonControl.ActLevelBoxJson;
                for (var i = 0; i < 4; i++) {
                    if (t[i].score <= e.score && 0 == e.boxStatus[i]) {
                        return void (this.actLevelRed.active = !0);
                    }
                }
                this.actLevelRed.active = !1;
            }
        } else {
            this.actLevelRed.active = !0;
        }
    },
    onCheckShareRed: function () {
        var e = !cc.player.isShare;
        this.shareRed.active = e;
    },
    isFundRed: function () {
        for (var e = 2; e < cc.player.level; e++) {
            if (!cc.pvz.PlayerData.hasFundGet(99 + e, 0)) {
                return !0;
            }
        }
        return !1;
    },
    onCheckFundRed: function () {
        this.fundRed.active = this.isFundRed();
    },
    onCheckGame2Red: function () {
        this.game2Red.active = !cc.player.game2t;
    }
});
