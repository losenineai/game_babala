cc.Class({
    extends: cc.Component,
    properties: {
        boxSpine: sp.Skeleton,
        closeBtn: cc.Node,
        uiTip: cc.Node,
        baseItemNode: cc.Node,
        parentOnePanel: cc.Node,
        parentMorePanel: cc.Node
    },
    onLoad: function () {
        this.baseItemNode.active = !1;
        this.uiTip.active = !1;
        this.closeBtn.active = !1;
    },
    initBy: function (e, t, i) {
        var o = this;
        if (void 0 === i) {
            i = null;
        }
        var a = e;
        this.callBack = i;
        this.onCheckRewardData(t);
        this.boxSpine.setEventListener(function (e, t) {
            if ("kapai" == t.data.name) {
                o.onShowBoxReward();
            }
        });
        this.boxSpine.node.active = !0;
        this.boxSpine.setAnimation(0, "BX" + a + "_1", !1);
        this.boxSpine.setCompleteListener(function () {
            o.boxSpine.setAnimation(0, "BX" + a + "_2", !0);
            o.boxSpine.setCompleteListener(null);
        });
        cc.butler.playEffect(cc.MainControl.rewardSound);
        if (2 == a) {
            cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["高级宝箱抽取装备n次"], 1);
        }
    },
    onShowBoxReward: function () {
        var e = this;
        this.uiTip.active = !0;
        var t = this.rewardData.length;
        var i;
        if (t <= 5) {
            i = this.parentOnePanel;
        } else {
            i = this.parentMorePanel;
        }
        this.baseItemNode.active = !0;
        this.baseItemNode.parent = i;
        if (t > 5) {
            cc.pvz.utils.fadeInBtn(this.baseItemNode);
        }
        this.baseItemNode.position = cc.v2(0, 0);
        this.baseItemNode.getComponent("RewardItem").initRewardItem(this.rewardData[0], !0);
        if (t <= 5) {
            for (var o = 1; o < t; o++) {
                var a = cc.instantiate(this.baseItemNode);
                a.parent = i;
                a.getComponent("RewardItem").initRewardItem(this.rewardData[o], !0);
                if (o == t - 1) {
                    this.closeBtn.active = !0;
                }
            }
        } else {
            var c = function (o) {
                setTimeout(function () {
                    var a = cc.instantiate(e.baseItemNode);
                    a.parent = i;
                    cc.pvz.utils.fadeInBtn(a);
                    a.getComponent("RewardItem").initRewardItem(e.rewardData[o], !0);
                    if (o == t - 1) {
                        e.closeBtn.active = !0;
                    }
                }, 40 * (o - 1) + 120);
            };
            for (var s = 1; s < t; s++) {
                c(s);
            }
        }
    },
    onCheckRewardData: function (e) {
        this.rewardData = [];
        this.effectItemList = [];
        for (var t = 0; t < e.length; t++) {
            var i = e[t];
            if (i.itemId >= 5 && i.itemId <= 7) {
                cc.pvz.utils.onCheckRandomTool(i, this.rewardData);
            } else {
                this.rewardData.push(i);
                i.itemId >= 2 && i.itemId <= 4 && this.effectItemList.push(i.itemId);
            }
        }
    },
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
        if (this.effectItemList.length > 0) {
            var e = -1;
            for (var t = 0; t < this.effectItemList.length; t++) {
                var i = this.effectItemList[t];
                for (var o = cc.math.randomRangeInt(1, 4); -1 != e && e == o; ) {
                    o = cc.math.randomRangeInt(1, 4);
                }
                e = o;
                cc.popupManager.showEffectFly(i, cc.MainControl.getItemEffectPos(i), o);
            }
        }
        if (this.callBack) {
            this.callBack();
        }
        cc.MainControl.updateItemInfo();
        cc.RedControl.refreshAllRedTip();
    }
});
