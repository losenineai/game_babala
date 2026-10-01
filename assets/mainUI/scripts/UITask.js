cc.TaskPage = cc.Enum({
    taskPage: 1,
    achievePage: 2
});
cc.Class({
    extends: cc.Component,
    properties: {
        coinLabel: cc.Label,
        diamondLabel: cc.Label,
        boxBgSprite: cc.Sprite,
        scoreSprite: cc.Sprite,
        scoreLabel: cc.Label,
        boxScorePanel: cc.Node,
        boxSpinePanel: cc.Node,
        missionProBar: cc.ProgressBar,
        missionWeekProBar: cc.ProgressBar,
        missionPanel: cc.Node,
        missionScroll: cc.ScrollView,
        missionParent: cc.Node,
        baseMissionItem: cc.Node,
        achievePanel: cc.Node,
        achieveScroll: cc.ScrollView,
        achieveParent: cc.Node,
        baseAchieveItem: cc.Node,
        timesLabel: cc.Label,
        redTips: [cc.Node],
        boxPanel: cc.Node,
        rewardParent: cc.Node
    },
    initTimeShow: function () {
        if (this.isDayMission) {
            this.lastTime = cc.pvz.utils.getTodayLastTimes();
        } else {
            var e = cc.pvz.utils.getTodayLastTimes();
            var t = cc.pvz.utils.getCurDayInWeek();
            if (7 == t) {
                this.lastTime = e;
            } else {
                this.lastTime = e + 86400 * (7 - t);
            }
        }
        this.timesLabel.string = cc.pvz.utils.formatCDTime(this.lastTime);
        this.schedule(this.refreshTimeShow, 1);
    },
    refreshTimeShow: function () {
        this.lastTime--;
        if (this.lastTime > 0) {
            this.timesLabel.string = cc.pvz.utils.formatCDTime(this.lastTime);
        } else {
            this.unschedule(this.refreshTimeShow, this);
        }
    },
    onCloseUI: function () {
        cc.MainControl.updateItemInfo();
        cc.RedControl.refreshAllRedTip();
        cc.popupManager.removePopup(this);
    },
    onToggleChange: function (e, t) {
        var i = parseInt(t);
        if (i != this.curPage) {
            this.curPage = i;
            this["refreshPage" + i]();
        }
    },
    initBy: function (e) {
        if (void 0 === e) {
            e = 1;
        }
        cc.UITask = this;
        this.updateItemInfo();
        this.curPage = e;
        this["refreshPage" + e]();
        this.redTips[0].active = cc.RedControl.onCheckDayMissionRed();
        this.redTips[1].active = cc.RedControl.onCheckWeekMissionRed();
        this.redTips[2].active = cc.RedControl.onCheckAchieveMissionRed();
        this.stageLevel = cc.pvz.PlayerData.getStageLevel();
    },
    initBoxInfo: function () {
        this.scoreNum = cc.pvz.PlayerData.getItemNum(
            this.isDayMission ? cc.pvz.GameConfig.ItemType["日常任务积分"] : cc.pvz.GameConfig.ItemType["周常任务积分"]
        );
        this.scoreLabel.string = this.scoreNum;
        this.missionProBar.node.active = this.isDayMission;
        this.missionWeekProBar.node.active = !this.isDayMission;
        if (this.isDayMission) {
            this.missionProBar.progress = this.scoreNum / this.BoxJson[this.BoxJson.length - 1].score;
        } else {
            this.missionWeekProBar.progress = this.scoreNum / this.BoxJson[this.BoxJson.length - 1].score;
        }
        cc.pvz.utils.setSpriteFrame(this.boxBgSprite, "uiImage", "mission/bg" + (this.isDayMission ? 1 : 2));
        cc.pvz.utils.setSpriteFrame(this.scoreSprite, "uiImage", "item/item" + (this.isDayMission ? 50 : 51));
        for (var e = 0; e < this.BoxJson.length; e++) {
            this.boxScorePanel.children[e].getComponent(cc.Label).string = this.BoxJson[e].score;
            var t;
            if (
                this.isDayMission
                    ? cc.pvz.PlayerData.getDayBoxData(this.BoxJson[e].ID).isReward
                    : cc.pvz.PlayerData.getWeekBoxData(this.BoxJson[e].ID).isReward
            ) {
                t = 3;
            } else {
                if (this.scoreNum >= this.BoxJson[e].score) {
                    t = 2;
                } else {
                    t = 1;
                }
            }
            this.boxSpinePanel.children[e].getComponent(sp.Skeleton).setAnimation(0, "libao" + t, !0);
        }
    },
    onClickBox: function (e, t) {
        var i = this;
        var o = parseInt(t);
        var a = this.BoxJson[o - 1];
        if (
            (this.isDayMission ? cc.pvz.PlayerData.getDayBoxData(a.ID) : cc.pvz.PlayerData.getWeekBoxData(a.ID))
                .isReward
        ) {
            cc.popupManager.showToast("奖励已领取");
        } else {
            var c = this.scoreNum >= a.score;
            var s = a.reward;
            var n = Math.floor(s.length / 2);
            var r = 0;
            this.rewardData = [];
            for (var h = 0; h < n; h++) {
                var p = s[r];
                var l = s[r + 1];
                if (p == cc.pvz.GameConfig.ItemType["金币"]) {
                    if (this.isDayMission) {
                        l += 50 * (this.stageLevel - 1);
                    } else {
                        l += 100 * (this.stageLevel - 1);
                    }
                }
                var d = cc.pvz.utils.getRewardItem(p, l);
                this.rewardData.push(d);
                r += 2;
            }
            if (c) {
                this.boxPanel.active = !1;
                if (this.isDayMission) {
                    cc.pvz.PlayerData.finishDayBoxReward(o);
                    this.redTips[0].active = cc.RedControl.onCheckDayMissionRed();
                } else {
                    cc.pvz.PlayerData.finishWeekBoxReward(o);
                    this.redTips[1].active = cc.RedControl.onCheckWeekMissionRed();
                }
                this.boxSpinePanel.children[o - 1].getComponent(sp.Skeleton).setAnimation(0, "libao3", !0);
                var v;
                if (this.isDayMission) {
                    v = cc.pvz.GameConfig.UIFromType["日常任务"];
                } else {
                    v = cc.pvz.GameConfig.UIFromType["周常任务"];
                }
                cc.popupManager.popup(
                    "mainUI",
                    "getrewardUI",
                    "UIReward",
                    {
                        ad: !1,
                        scale: !1
                    },
                    this.rewardData,
                    v,
                    function () {
                        i.updateItemInfo();
                    }
                );
            } else {
                if (o != this.curBoxId) {
                    this.curBoxId = o;
                    this.boxPanel.active = !0;
                    this.refreshBoxPanelInfo(o);
                } else {
                    if (this.boxPanel.active) {
                        this.boxPanel.active = !1;
                    } else {
                        this.boxPanel.active = !0;
                    }
                }
            }
        }
    },
    refreshBoxPanelInfo: function (e) {
        var t = this.boxSpinePanel.children[e - 1].position;
        this.boxPanel.position = cc.v2(t.x, this.boxPanel.position.y);
        for (var i = 0; i < this.rewardParent.childrenCount; i++) {
            var o = this.rewardParent.children[i];
            if (i < this.rewardData.length) {
                o.active = !0;
                o.getComponent("RewardItem").initBoxRewardItem(this.rewardData[i]);
            } else {
                o.active = !1;
            }
        }
    },
    updateItemInfo: function () {
        var e = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["金币"]);
        this.coinLabel.string = cc.pvz.utils.formatItemNum(e);
        var t = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["钻石"]);
        this.diamondLabel.string = cc.pvz.utils.formatItemNum(t);
    },
    getItemEffectPos: function (e) {
        if (e === cc.pvz.GameConfig.ItemType["钻石"]) {
            return this.diamondLabel.node.convertToWorldSpaceAR(cc.v2());
        } else {
            return this.coinLabel.node.convertToWorldSpaceAR(cc.v2());
        }
    },
    refreshPage1: function () {
        var e = this;
        this.missionPanel.active = !0;
        this.achievePanel.active = !1;
        this.boxPanel.active = !1;
        this.curBoxId = -1;
        cc.pvz.PlayerData.checkAndResetDayMission();
        this.isDayMission = !0;
        this.BoxJson = cc.JsonControl.getDayMissionBoxJson();
        this.initBoxInfo();
        var t = cc.JsonControl.getAllDayMissionJson()
            .map(function (e) {
                return e;
            })
            .sort(function (e, t) {
                var i = cc.pvz.PlayerData.getDayMissionData(e.func);
                var o = e.need;
                var a;
                if (i.isReward) {
                    a = 2;
                } else {
                    if (i.pro >= o) {
                        a = 0;
                    } else {
                        a = 1;
                    }
                }
                var c = cc.pvz.PlayerData.getDayMissionData(t.func);
                var s = t.need;
                return a - (c.isReward ? 2 : c.pro >= s ? 0 : 1);
            });
        var i = t.length;
        var o = i - this.missionParent.childrenCount;
        if (o > 0) {
            for (var a = 0; a < o; a++) {
                (n = cc.instantiate(this.baseMissionItem)).parent = this.missionParent;
            }
        } else {
            for (var c = i; c < this.missionParent.childrenCount; c++) {
                this.missionParent.children[c].active = !1;
            }
        }
        for (var s = 0; s < i; s++) {
            var n;
            (n = this.missionParent.children[s]).active = !0;
            n.getComponent("TaskItem").initMissionItem(!0, t[s], function () {
                e.initBoxInfo();
                e.redTips[0].active = cc.RedControl.onCheckDayMissionRed();
            });
        }
        this.initTimeShow();
        this.missionScroll.scrollToTop(0.1);
    },
    refreshPage2: function () {
        var e = this;
        this.missionPanel.active = !0;
        this.achievePanel.active = !1;
        this.boxPanel.active = !1;
        this.curBoxId = -1;
        cc.pvz.PlayerData.checkAndResetWeekMission();
        this.isDayMission = !1;
        this.BoxJson = cc.JsonControl.getWeekMissionBoxJson();
        this.initBoxInfo();
        var t = cc.JsonControl.getAllWeekMissionJson()
            .map(function (e) {
                return e;
            })
            .sort(function (e, t) {
                var i = cc.pvz.PlayerData.getWeekMissionData(e.func);
                var o = e.need;
                var a;
                if (i.isReward) {
                    a = 2;
                } else {
                    if (i.pro >= o) {
                        a = 0;
                    } else {
                        a = 1;
                    }
                }
                var c = cc.pvz.PlayerData.getWeekMissionData(t.func);
                var s = t.need;
                return a - (c.isReward ? 2 : c.pro >= s ? 0 : 1);
            });
        var i = t.length;
        var o = i - this.missionParent.childrenCount;
        if (o > 0) {
            for (var a = 0; a < o; a++) {
                (n = cc.instantiate(this.baseMissionItem)).parent = this.missionParent;
            }
        } else {
            for (var c = i; c < this.missionParent.childrenCount; c++) {
                this.missionParent.children[c].active = !1;
            }
        }
        for (var s = 0; s < i; s++) {
            var n;
            (n = this.missionParent.children[s]).active = !0;
            n.getComponent("TaskItem").initMissionItem(!1, t[s], function () {
                e.initBoxInfo();
                e.redTips[1].active = cc.RedControl.onCheckWeekMissionRed();
            });
        }
        this.initTimeShow();
        this.missionScroll.scrollToTop(0.1);
    },
    refreshPage3: function () {
        var e = this;
        this.missionPanel.active = !1;
        this.achievePanel.active = !0;
        this.boxPanel.active = !1;
        this.achieveList = [];
        this.AchieveJson = cc.JsonControl.getAllAchieveJson();
        var t = Math.floor(this.AchieveJson[this.AchieveJson.length - 1].ID / 100);
        var i = [];
        for (var o = 0; o < t; o++) {
            i.push(o + 1);
        }
        i.sort(function (e, t) {
            var i = cc.pvz.PlayerData.getAchieveData(e);
            var o = 0;
            if (i.end) {
                o = 2;
            } else {
                var a = 100 * e + i.lv;
                var c = cc.JsonControl.getAchieveJson(a);
                var s = cc.pvz.PlayerData.getAchieveProgress(c.func);
                if (c.need[0] <= s) {
                    o = 0;
                } else {
                    o = 1;
                }
            }
            var n = cc.pvz.PlayerData.getAchieveData(t);
            var r = 0;
            if (n.end) {
                r = 2;
            } else {
                var h = 100 * t + n.lv;
                var p = cc.JsonControl.getAchieveJson(h);
                var l = cc.pvz.PlayerData.getAchieveProgress(p.func);
                if (p.need[0] <= l) {
                    r = 0;
                } else {
                    r = 1;
                }
            }
            return o - r;
        });
        var a = t - this.achieveParent.childrenCount;
        if (a > 0) {
            for (var c = 0; c < a; c++) {
                cc.instantiate(this.baseAchieveItem).parent = this.achieveParent;
            }
        } else {
            for (var s = t; s < this.achieveParent.childrenCount; s++) {
                this.achieveParent.children[s].active = !1;
            }
        }
        for (var n = 0; n < t; n++) {
            this.achieveParent.children[n].getComponent("TaskItem").initAchieveMissionItem(i[n], function () {
                e.updateItemInfo();
                e.redTips[2].active = cc.RedControl.onCheckAchieveMissionRed();
            });
        }
        this.achieveScroll.scrollToTop(0.1);
    }
});
