cc.ToolItem = cc.Class({
    name: "ToolItem",
    properties: {
        lv: cc.Integer,
        c: cc.Integer
    }
});
var o = {
    newData: function () {
        var e = {
            dataVersion: 1,
            t: -1,
            isMMute: !1,
            isSMute: !1,
            itemData: {},
            power: 20,
            powerDate: -1,
            powerBuyDate: -1,
            powerBuyTimes: [5, 3],
            toolData: {},
            gameDate: -1,
            level: 1,
            levelWave: 0,
            sweepTimes: 5,
            levelBoxData: {},
            actLevelDate: -1,
            actLevelData: {
                level: 0,
                times: 3,
                score: 0,
                buffList: [-1, -1],
                boxStatus: [0, 0, 0, 0]
            },
            shopDate: -1,
            isNewShop: !0,
            shopDailyData: {},
            shopTimesData: [20, 1, 7],
            shopBoxData: {
                lv: 1,
                exp: 0,
                date: [-1, -1]
            },
            isShare: !1,
            shareDate: -1,
            shareTimes: 10,
            adBuffDate: -1,
            adBuffTimes: [10, 3],
            adBuyData: {
                bank: [3, 3],
                toolBuy: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                actTimes: 1
            },
            guide1: 0,
            signDate: -1,
            signData: {
                signDay: 1,
                isReward: !1
            },
            dayMissionDate: -1,
            dayMissionData: {},
            dayBoxData: {},
            weekMissionDate: -1,
            weekMissionData: {},
            weekBoxData: {},
            achievePro: {},
            achieveData: {},
            adTimes: 0
        };
        e.regTime = Date.now();
        e.free3b = 1;
        e.rankCount = 2;
        cc.player = e;
    },
    postLoadData: function () {
        if (cc.player.dataVersion < 1) {
            cc.player.dataVersion = 1;
            this.saveData(!0);
        }
    },
    initPlayerData: function () {
        var e = cc.sys.localStorage.getItem("kapipack1");
        if (e) {
            cc.player = JSON.parse(e);
            cc.pvz.TAUtils.trackLogin(!1);
        } else {
            console.log("New Player initPlayer");
            this.newData();
            console.log("初始化 背包");
            this.initBaseToolData();
            this.initBaseItemData();
            cc.pvz.cloud.needSaveToCloud = 0;
            cc.pvz.TAUtils.trackLogin(!0);
        }
        this.postLoadData();
    },
    saveData: function () {
        if (cc.player) {
            cc.sys.localStorage.setItem("kapipack1", JSON.stringify(cc.player));
        }
    },
    clearData: function () {
        cc.sys.localStorage.removeItem("kapipack1");
    },
    onDataChanged: function () {
        this.saveData();
        cc.pvz.cloud.needSaveToCloud++;
    },
    saveDataToLocalOnlineCore: function (e) {
        var t = this;
        var o = Date.now();
        var a = JSON.parse(JSON.stringify(cc.player));
        a.t = o;
        cc.pvz.cloud.checkUpdatePlayerInfo(a, function (a) {
            if (e) {
                cc.player.t = o;
                t.saveData();
                e(a);
            }
        });
        cc.storageTime = Date.now();
    },
    saveDataToLocalOnline: function (e) {
        var t = this;
        this.saveDataToLocalOnlineCore(e);
        if (cc.storageTimeId) {
            clearTimeout(cc.storageTimeId);
            cc.storageTimeId = null;
        }
        cc.storageTimeId = setTimeout(function () {
            t.saveDataToLocalOnlineCore();
        }, 3e5);
    },
    getZeroOClock: function (e) {
        var t = new Date(e);
        var o = t.getFullYear();
        var a = t.getMonth();
        var n = t.getDate();
        return new Date(o, a, n).getTime();
    },
    hasPastOneDay: function () {
        return this.getZeroOClock(Date.now()) - this.getZeroOClock(cc.player.regTime) > 0;
    },
    initBaseItemData: function () {
        var e = [2, 3];
        var t = [500, 0];
        for (var o = 0; o < e.length; o++) {
            this.changeItemNum(e[o], t[o]);
        }
    },
    changeItemNum: function (e, t) {
        if (cc.player.itemData.hasOwnProperty(e)) {
            cc.player.itemData[e] += t;
        } else {
            cc.player.itemData[e] = t;
        }
        if (e == cc.pvz.GameConfig.ItemType["金币"] && t > 0) {
            this.addMissionProgress(cc.pvz.GameConfig.MissionType["累计获得金币"], t);
        } else {
            if (e == cc.pvz.GameConfig.ItemType["钻石"] && t < 0) {
                this.addMissionProgress(cc.pvz.GameConfig.MissionType["累计消耗钻石"], Math.abs(t));
            }
        }
        this.onDataChanged();
    },
    setItemNum: function (e, t) {
        cc.player.itemData[e] = t;
    },
    getItemNum: function (e) {
        if (cc.player.itemData.hasOwnProperty(e)) {
            return cc.player.itemData[e];
        } else {
            return 0;
        }
    },
    isItemEnough: function (e, t) {
        return !!cc.player.itemData.hasOwnProperty(e) && cc.player.itemData[e] >= t;
    },
    initBaseToolData: function () {
        cc.player.toolData = {};
        for (var e = 0; e < cc.pvz.GameConfig.MaxToolCount; e++) {
            var t = e + 1;
            var o;
            if (1 == t) {
                o = 5;
            } else {
                o = 0;
            }
            var a;
            if (e < 6) {
                a = e;
            } else {
                a = -1;
            }
            cc.player.toolData[t] = {
                lv: 1,
                c: o,
                pos: a
            };
        }
        this.saveData();
    },
    getToolData: function (e) {
        if (cc.player.toolData.hasOwnProperty(e)) {
            //
        } else {
            cc.player.toolData[e] = {
                lv: 1,
                c: 0,
                pos: -1
            };
            this.onDataChanged();
        }
        return cc.player.toolData[e];
    },
    updateToolLv: function (e, t) {
        if (cc.player.toolData.hasOwnProperty(e)) {
            cc.player.toolData[e].lv += t;
            this.onDataChanged();
        } else {
            console.log("道具不存在", e);
        }
    },
    updateToolFragCount: function (e, t) {
        if (cc.player.toolData.hasOwnProperty(e)) {
            cc.player.toolData[e].c += t;
            this.onDataChanged();
        } else {
            console.log("道具不存在", e);
        }
    },
    isEnoughArrayTool: function () {
        var e = 6;
        if (cc.player.level > cc.pvz.GameConfig.ArrayPlaceOpLv[1]) {
            e = 8;
        } else {
            if (cc.player.level > cc.pvz.GameConfig.ArrayPlaceOpLv[0]) {
                e = 7;
            }
        }
        var t = 0;
        for (var o = 0; o < cc.pvz.GameConfig.MaxToolCount; o++) {
            if (-1 != cc.player.toolData[o + 1].pos) {
                t++;
            }
        }
        return t >= e;
    },
    checkAndResetPowetBuy: function () {
        var e = new Date().getDate();
        if (e != cc.player.powerBuyDate) {
            cc.player.powerBuyDate = e;
            cc.player.powerBuyTimes = [5, 3];
            this.onDataChanged();
        }
    },
    getPowerBuyTimes: function (e) {
        if (void 0 === e) {
            e = !1;
        }
        return cc.player.powerBuyTimes[e ? 0 : 1];
    },
    updatePowerBuyTimes: function (e, t) {
        if (void 0 === t) {
            t = 1;
        }
        cc.player.powerBuyTimes[e ? 0 : 1] -= t;
        this.onDataChanged();
    },
    isHaveBuyPowerTimes: function () {
        return cc.player.powerBuyTimes[0] + cc.player.powerBuyTimes[1] > 0;
    },
    usePlayerPower: function (e) {
        cc.player.power += e;
        if (this.isMaxPower()) {
            //
        } else {
            cc.player.powerDate = Date.now() + 1e3 * cc.pvz.GameConfig.CdPowerTime;
        }
        this.onDataChanged();
    },
    addPower: function (e, t) {
        if (void 0 === t) {
            t = !1;
        }
        cc.player.power += e;
        if (this.isMaxPower()) {
            if (t) {
                cc.player.power = cc.player.power;
            } else {
                cc.player.power = this.getMaxPower();
            }
            cc.player.powerDate = -1;
        } else {
            cc.player.powerDate = Date.now() + 1e3 * cc.pvz.GameConfig.CdPowerTime;
        }
        this.onDataChanged();
    },
    isMaxPower: function () {
        return cc.player.power >= this.getMaxPower();
    },
    getMaxPower: function () {
        return cc.pvz.GameConfig.MaxPower;
    },
    getPower: function () {
        return cc.player.power;
    },
    getPowerDate: function () {
        return cc.player.powerDate;
    },
    updatePowerDate: function () {
        cc.player.powerDate = Date.now();
        this.onDataChanged();
    },
    checkAndResetActLevel: function () {
        var e = new Date().getDate();
        if (e != cc.player.actLevelDate) {
            cc.player.actLevelDate = e;
            cc.player.actLevelData.times = 3;
            cc.player.actLevelData.score = 0;
            cc.player.actLevelData.buffList = [-1, -1];
            cc.player.actLevelData.boxStatus = [0, 0, 0, 0];
            if (cc.player.actLevelData.level < 2) {
                cc.player.actLevelData.level++;
            } else {
                cc.player.actLevelData.level = 1;
            }
            this.onDataChanged();
        }
    },
    getActLevelData: function () {
        return cc.player.actLevelData;
    },
    updateActLevelTimes: function () {
        cc.player.actLevelData.times--;
        this.onDataChanged();
    },
    updateActLevelScore: function (e) {
        cc.player.actLevelData.score += e;
        this.onDataChanged();
    },
    updateActLevelBuff: function (e, t) {
        cc.player.actLevelData.buffList[e - 1] = t;
        this.onDataChanged();
    },
    updateActLevelBoxStatus: function (e) {
        cc.player.actLevelData.boxStatus[e - 1] = 1;
        this.onDataChanged();
    },
    checkAndResetGameDate: function () {
        var e = new Date().getDate();
        if (e != cc.player.gameDate) {
            cc.player.gameDate = e;
            cc.player.sweepTimes = 5;
            cc.player.adTimes = 0;
            cc.player.rankCount = 2;
            this.onDataChanged();
        }
    },
    getSweepTimes: function () {
        return cc.player.sweepTimes;
    },
    updateSweepTimes: function () {
        cc.player.sweepTimes--;
        this.onDataChanged();
    },
    updateStageLevel: function (e) {
        if (void 0 === e) {
            e = 1;
        }
        if (cc.player.level < cc.pvz.GameConfig.MaxLevel) {
            cc.player.level += e;
        }
        cc.player.levelWave = 0;
        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["通过主线章节n"], cc.player.level - 1);
        this.onDataChanged();
        cc.pvz.TAUtils.uploadLvUpData();
    },
    getStageLevel: function () {
        return cc.player.level;
    },
    getMaxLevelWave: function () {
        return cc.player.levelWave;
    },
    updateMaxLevelWave: function (e) {
        if (cc.player.levelWave < e) {
            cc.player.levelWave = e;
            this.onDataChanged();
        }
    },
    getLevelBoxData: function (e) {
        if (cc.player.levelBoxData.hasOwnProperty(e)) {
            //
        } else {
            cc.player.levelBoxData[e] = [0, 0, 0];
            this.onDataChanged();
        }
        return cc.player.levelBoxData[e];
    },
    updateLevelBoxData: function (e, t) {
        if (cc.player.levelBoxData.hasOwnProperty(e)) {
            //
        } else {
            cc.player.levelBoxData[e] = [0, 0, 0];
        }
        cc.player.levelBoxData[e][t - 1] = 1;
        this.onDataChanged();
    },
    checkAndResetShop: function () {
        var e = new Date().getDate();
        if (e != cc.player.shopDate) {
            cc.player.shopDate = e;
            cc.player.shopDailyData = {};
            cc.player.shopTimesData = [20, 1, 7];
            cc.player.isNewShop = !0;
            this.onDataChanged();
        }
    },
    updateShopTimes: function (e) {
        cc.player.shopTimesData[e]--;
        this.onDataChanged();
    },
    getShopTimes: function (e) {
        return cc.player.shopTimesData[e];
    },
    isNewShopStatus: function () {
        return cc.player.isNewShop;
    },
    changeShopStatus: function () {
        cc.player.isNewShop = !1;
        this.onDataChanged();
    },
    addShopData: function (e, t) {
        if (cc.player.shopDailyData.hasOwnProperty(e)) {
            console.log(" Error Add Shop Data :", e);
        } else {
            cc.player.shopDailyData[e] = t;
            this.onDataChanged();
        }
    },
    setShopData: function (e, t) {
        cc.player.shopDailyData[e] = t;
        this.onDataChanged();
    },
    getShopData: function (e) {
        if (cc.player.shopDailyData.hasOwnProperty(e)) {
            //
        } else {
            cc.player.shopDailyData[e] = null;
        }
        return cc.player.shopDailyData[e];
    },
    updateShopDataBuy: function (e, t) {
        if (void 0 === t) {
            t = 1;
        }
        if (cc.player.shopDailyData.hasOwnProperty(e)) {
            cc.player.shopDailyData[e].buyTimes -= t;
            this.onDataChanged();
        } else {
            console.log(" Error Add Shop Data :", e);
        }
    },
    getShopBoxData: function () {
        return cc.player.shopBoxData;
    },
    updateShopBoxDate: function (e, t) {
        cc.player.shopBoxData.date[e - 1] = t;
        this.onDataChanged();
    },
    updateShopBoxExp: function (e) {
        if (cc.player.shopBoxData.lv < 10) {
            cc.player.shopBoxData.exp += e;
            this.onDataChanged();
        }
    },
    updateShopBoxlV: function (e, t) {
        cc.player.shopBoxData.exp = t;
        if (cc.player.shopBoxData.lv < 10) {
            cc.player.shopBoxData.lv += e;
        }
        this.onDataChanged();
    },
    checkAndResetShare: function () {
        var e = new Date().getDate();
        if (e != cc.player.shareDate) {
            cc.player.shareDate = e;
            cc.player.isShare = !1;
            cc.player.shareTimes = 10;
            this.onDataChanged();
        }
    },
    getShareTimes: function () {
        return cc.player.shareTimes;
    },
    updateShareTimes: function () {
        cc.player.shareTimes--;
        this.onDataChanged();
    },
    finishShare: function () {
        cc.player.isShare = !0;
        this.onDataChanged();
    },
    checkAndResetAdData: function () {
        var e = new Date().getDate();
        if (e != cc.player.adBuffDate) {
            cc.player.adBuffDate = e;
            cc.player.adBuffTimes = [10, 3];
            cc.player.adBuyData = {
                bank: [3, 3],
                toolBuy: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                actTimes: 1
            };
            this.onDataChanged();
        }
    },
    isHaveMoreActTimes: function () {
        return 1 == cc.player.adBuyData.actTimes;
    },
    updateAdActTimes: function () {
        cc.player.adBuyData.actTimes = 0;
        this.onDataChanged();
    },
    isHaveAdBuyBankTimes: function (e) {
        return cc.player.adBuyData.bank[e] > 0;
    },
    isHaveAdBuyToolTimes: function (e) {
        return 1 == cc.player.adBuyData.toolBuy[e - 1];
    },
    updateAdBuyBankTimes: function (e) {
        cc.player.adBuyData.bank[e]--;
        this.onDataChanged();
    },
    updateAdBuyToolTimes: function (e) {
        cc.player.adBuyData.toolBuy[e - 1] = 0;
        this.onDataChanged();
    },
    getAdBuyData: function () {
        return cc.player.adBuyData;
    },
    getAdBuffTimes: function (e) {
        return cc.player.adBuffTimes[e];
    },
    updateAdBuffTimes: function (e) {
        cc.player.adBuffTimes[e]--;
        this.onDataChanged();
    },
    finishSignReward: function () {
        cc.player.signData.isReward = !0;
        this.onDataChanged();
    },
    getSignData: function () {
        return cc.player.signData;
    },
    checkAndResetSign: function () {
        var e = new Date().getDate();
        if (e != cc.player.signDate) {
            cc.player.signDate = e;
            if (cc.player.signData.isReward) {
                cc.player.signData.signDay++;
            }
            cc.player.signData.isReward = !1;
            this.onDataChanged();
        }
    },
    checkAndResetDayMission: function () {
        var e = new Date().getDate();
        if (e != cc.player.dayMissionDate) {
            cc.player.dayMissionDate = e;
            cc.player.dayMissionData = {};
            cc.player.dayBoxData = {};
            this.setItemNum(cc.pvz.GameConfig.ItemType["日常任务积分"], 0);
            this.addDayMissionProgress(cc.pvz.GameConfig.MissionType["登录1次"]);
            this.onDataChanged();
        }
    },
    getDayBoxData: function (e) {
        if (cc.player.dayBoxData[e]) {
            //
        } else {
            cc.player.dayBoxData[e] = {
                isReward: !1
            };
            this.onDataChanged();
        }
        return cc.player.dayBoxData[e];
    },
    finishDayBoxReward: function (e) {
        if (cc.player.dayBoxData[e]) {
            cc.player.dayBoxData[e].isReward = !0;
            this.onDataChanged();
        }
    },
    getDayMissionData: function (e) {
        if (cc.player.dayMissionData[e]) {
            //
        } else {
            cc.player.dayMissionData[e] = {
                pro: 0,
                isReward: !1
            };
            this.onDataChanged();
        }
        return cc.player.dayMissionData[e];
    },
    addDayMissionProgress: function (e, t) {
        if (void 0 === t) {
            t = 1;
        }
        this.checkAndResetDayMission();
        if (cc.player.dayMissionData[e]) {
            //
        } else {
            cc.player.dayMissionData[e] = {
                pro: 0,
                isReward: !1
            };
        }
        if (cc.player.dayMissionData[e].isReward) {
            //
        } else {
            cc.player.dayMissionData[e].pro += t;
        }
    },
    finishDayMission: function (e) {
        if (cc.player.dayMissionData[e]) {
            cc.player.dayMissionData[e].isReward = !0;
            this.onDataChanged();
        }
    },
    getWeekBoxData: function (e) {
        if (cc.player.weekBoxData[e]) {
            //
        } else {
            cc.player.weekBoxData[e] = {
                isReward: !1
            };
            this.onDataChanged();
        }
        return cc.player.weekBoxData[e];
    },
    finishWeekBoxReward: function (e) {
        if (cc.player.weekBoxData[e]) {
            cc.player.weekBoxData[e].isReward = !0;
            this.onDataChanged();
        }
    },
    checkAndResetWeekMission: function () {
        var e = cc.pvz.utils.getCurDayInWeek();
        if (e != cc.player.weekMissionDate) {
            cc.player.weekMissionDate = e;
            if (1 == e) {
                cc.player.weekMissionData = {};
                cc.player.weekBoxData = {};
                this.setItemNum(cc.pvz.GameConfig.ItemType["周常任务积分"], 0);
            }
            this.onDataChanged();
        }
    },
    getWeekMissionData: function (e) {
        if (cc.player.weekMissionData[e]) {
            //
        } else {
            cc.player.weekMissionData[e] = {
                pro: 0,
                isReward: !1
            };
            this.onDataChanged();
        }
        return cc.player.weekMissionData[e];
    },
    addWeekMissionProgress: function (e, t) {
        if (void 0 === t) {
            t = 1;
        }
        this.checkAndResetWeekMission();
        if (cc.player.weekMissionData[e]) {
            //
        } else {
            cc.player.weekMissionData[e] = {
                pro: 0,
                isReward: !1
            };
        }
        if (cc.player.weekMissionData[e].isReward) {
            //
        } else {
            cc.player.weekMissionData[e].pro += t;
        }
    },
    finishWeekMission: function (e) {
        if (cc.player.weekMissionData[e]) {
            cc.player.weekMissionData[e].isReward = !0;
            this.onDataChanged();
        }
    },
    getAchieveData: function (e) {
        if (cc.player.achieveData[e]) {
            //
        } else {
            cc.player.achieveData[e] = {
                lv: 1,
                end: !1
            };
            this.onDataChanged();
        }
        return cc.player.achieveData[e];
    },
    updateAchieveData: function (e, t) {
        if (void 0 === t) {
            t = 1;
        }
        if (cc.player.achieveData[e]) {
            //
        } else {
            cc.player.achieveData[e] = {
                lv: 1,
                end: !1
            };
        }
        cc.player.achieveData[e].lv += t;
        var o = 100 * e + cc.player.achieveData[e].lv;
        if (cc.JsonControl.getAchieveJson(o)) {
            //
        } else {
            cc.player.achieveData[e].lv -= t;
            cc.player.achieveData[e].end = !0;
        }
        this.onDataChanged();
    },
    getAchieveProgress: function (e) {
        if (cc.player.achievePro.hasOwnProperty(e)) {
            //
        } else {
            cc.player.achievePro[e] = 0;
            this.saveData();
        }
        return cc.player.achievePro[e];
    },
    addAchieveProgress: function (e, t) {
        if (void 0 === t) {
            t = 1;
        }
        if (cc.player.achievePro.hasOwnProperty(e)) {
            //
        } else {
            cc.player.achievePro[e] = 0;
        }
        switch (e) {
            case cc.pvz.GameConfig.MissionType["通过主线章节n"]:
                if (t > cc.player.achievePro[e]) {
                    cc.player.achievePro[e] = t;
                }
                break;
            case cc.pvz.GameConfig.MissionType["装备最高等级达到n"]:
                var o = cc.player.achievePro[e],
                    a = this.getToolMaxLv();
                if (o < a) {
                    cc.player.achievePro[e] = a;
                }
                break;
            case cc.pvz.GameConfig.MissionType["装备总等级n"]:
                var n = cc.player.achievePro[e],
                    i = this.getToolAllLv();
                if (n < i) {
                    cc.player.achievePro[e] = i;
                }
                break;
            default:
                cc.player.achievePro[e] += t;
        }
    },
    getToolMaxLv: function () {
        var e = 0;
        for (var t in cc.player.toolData) {
            var o = cc.player.toolData[t];
            if (e <= o.lv) {
                e = o.lv;
            }
        }
        return e;
    },
    getToolAllLv: function () {
        var e = 0;
        for (var t in cc.player.toolData) e += cc.player.toolData[t].lv;
        return e;
    },
    addMissionProgress: function (e, t) {
        if (void 0 === t) {
            t = 1;
        }
        switch (e) {
            case cc.pvz.GameConfig.MissionType["挑战主线章节1次"]:
            case cc.pvz.GameConfig.MissionType["升级任意装备1次"]:
                cc.pvz.PlayerData.addDayMissionProgress(e, t);
                break;
            case cc.pvz.GameConfig.MissionType["每日商店购买n次物品"]:
            case cc.pvz.GameConfig.MissionType["高级宝箱抽取装备n次"]:
                cc.pvz.PlayerData.addDayMissionProgress(e, t);
                cc.pvz.PlayerData.addWeekMissionProgress(e, t);
                break;
            case cc.pvz.GameConfig.MissionType["扫荡关卡n次"]:
            case cc.pvz.GameConfig.MissionType["参与无尽挑战赛N次"]:
            case cc.pvz.GameConfig.MissionType["参与挑战关卡n次"]:
                cc.pvz.PlayerData.addDayMissionProgress(e, t);
                break;
            case cc.pvz.GameConfig.MissionType["购买体力n次"]:
                cc.pvz.PlayerData.addDayMissionProgress(e, t);
                cc.pvz.PlayerData.addAchieveProgress(e, t);
                break;
            case cc.pvz.GameConfig.MissionType["观看广告n次"]:
                cc.pvz.PlayerData.addDayMissionProgress(e, t);
                cc.pvz.PlayerData.addWeekMissionProgress(e, t);
                cc.pvz.PlayerData.addAchieveProgress(e, t);
                break;
            case cc.pvz.GameConfig.MissionType["通关主线副本n次"]:
                cc.pvz.PlayerData.addWeekMissionProgress(e, t);
                break;
            case cc.pvz.GameConfig.MissionType["击败僵尸n个"]:
            case cc.pvz.GameConfig.MissionType["击败首领n个"]:
                cc.pvz.PlayerData.addWeekMissionProgress(e, t);
                cc.pvz.PlayerData.addAchieveProgress(e, t);
                break;
            case cc.pvz.GameConfig.MissionType["通关挑战关卡n次"]:
                cc.pvz.PlayerData.addWeekMissionProgress(e, t);
                break;
            case cc.pvz.GameConfig.MissionType["通过主线章节n"]:
            case cc.pvz.GameConfig.MissionType["装备最高等级达到n"]:
            case cc.pvz.GameConfig.MissionType["装备总等级n"]:
            case cc.pvz.GameConfig.MissionType["累计获得金币"]:
            case cc.pvz.GameConfig.MissionType["累计消耗钻石"]:
                cc.pvz.PlayerData.addAchieveProgress(e, t);
        }
        this.onDataChanged();
    },
    onCheckOldPlayerMission: function () {
        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["通过主线章节n"], cc.player.level - 1);
        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["装备总等级n"]);
        cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["装备最高等级达到n"]);
    },
    hasFundGet: function () {
        return !1;
    },
    setFundGetted: function () {}
};
if (cc.pvz) {
    //
} else {
    cc.pvz = {};
}
cc.pvz.PlayerData = o;
module.exports = o;
