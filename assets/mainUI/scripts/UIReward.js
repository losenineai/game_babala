cc.Class({
    extends: cc.Component,
    properties: {
        baseItemNode: cc.Node,
        parentOnePanel: cc.Node,
        parentMorePanel: cc.Node,
        closeBtn: cc.Node,
        effectSpine: sp.Skeleton,
        bgSpine: sp.Skeleton,
        rewardSound: cc.AudioClip
    },
    onLoad: function () {
        cc.UIReward = this;
        this.baseItemNode.active = !1;
        this.effectSpine.node.active = !1;
    },
    showEffectSpine: function () {
        var e = this;
        this.effectSpine.node.active = !0;
        this.effectSpine.setAnimation(0, "caidai", !1);
        this.effectSpine.setCompleteListener(function () {
            e.effectSpine.node.active = !1;
            e.effectSpine.setCompleteListener(null);
        });
    },
    initBy: function (e, t, i, o) {
        var a = this;
        if (void 0 === i) {
            i = null;
        }
        if (void 0 === o) {
            o = null;
        }
        this.fromType = t;
        this.callBack = i;
        this.getItemEffectPosCb = o;
        this.closeBtn.active = !1;
        this.onCheckRewardData(e);
        this.bgSpine.setEventListener(function (e, t) {
            if ("ShowItem" == t.data.name) {
                a.initUIInfo();
                a.showEffectSpine();
            }
        });
        this.bgSpine.setAnimation(0, "get1", !1);
        this.bgSpine.setCompleteListener(function () {
            a.bgSpine.setAnimation(0, "get2", !0);
            a.bgSpine.setCompleteListener(null);
        });
        cc.butler.playEffect(this.rewardSound);
    },
    onCheckRewardData: function (e) {
        this.rewardData = [];
        this.effectItemList = [];
        for (var t = 0; t < e.length; t++) {
            var i = e[t];
            if (i.itemId >= 5 && i.itemId <= 7) {
                cc.pvz.utils.onCheckRandomTool(
                    i,
                    this.rewardData,
                    this.fromType != cc.pvz.GameConfig.UIFromType["签到"]
                );
            } else {
                this.rewardData.push(i);
                i.itemId >= 2 && i.itemId <= 4 && this.effectItemList.push(i.itemId);
            }
        }
    },
    initUIInfo: function () {
        this.closeBtn.active = !0;
        var e = this.rewardData.length;
        var t;
        if (e <= 5) {
            t = this.parentOnePanel;
        } else {
            t = this.parentMorePanel;
        }
        this.baseItemNode.active = !0;
        this.baseItemNode.parent = t;
        this.baseItemNode.position = cc.v2(0, 0);
        var i = this.fromType != cc.pvz.GameConfig.UIFromType["双倍结算"];
        this.baseItemNode.getComponent("RewardItem").initRewardItem(this.rewardData[0], i);
        for (var o = 1; o < e; o++) {
            var a = cc.instantiate(this.baseItemNode);
            a.parent = t;
            a.getComponent("RewardItem").initRewardItem(this.rewardData[o], i);
        }
    },
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
        if (this.fromType != cc.pvz.GameConfig.UIFromType["双倍结算"]) {
            if (this.effectItemList.length > 0) {
                var e = -1;
                for (var t = 0; t < this.effectItemList.length; t++) {
                    var i = this.effectItemList[t];
                    for (var o = cc.math.randomRangeInt(1, 4); -1 != e && e == o; ) {
                        o = cc.math.randomRangeInt(1, 4);
                    }
                    e = o;
                    if (
                        this.fromType == cc.pvz.GameConfig.UIFromType["日常任务"] ||
                        this.fromType == cc.pvz.GameConfig.UIFromType["周常任务"] ||
                        this.fromType == cc.pvz.GameConfig.UIFromType["成就"]
                    ) {
                        cc.popupManager.showEffectFly(i, cc.UITask.getItemEffectPos(i), o);
                    } else {
                        if (this.fromType == cc.pvz.GameConfig.UIFromType["基金"]) {
                            cc.popupManager.showEffectFly(i, this.getItemEffectPosCb(i), o);
                        } else {
                            cc.popupManager.showEffectFly(i, cc.MainControl.getItemEffectPos(i), o);
                        }
                    }
                }
            }
            if (this.fromType === cc.pvz.GameConfig.UIFromType["关卡宝箱"]) {
                cc.MainControl.checkPowerInfo();
            }
            if (this.callBack) {
                this.callBack();
            }
            cc.MainControl.updateItemInfo();
            cc.RedControl.refreshAllRedTip();
        } else {
            if (this.callBack) {
                this.callBack();
            }
        }
    }
});
