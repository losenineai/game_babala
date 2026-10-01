cc.Class({
    extends: cc.Component,
    properties: {
        nameSprite: cc.Sprite,
        bgSprite: cc.Sprite,
        rewardItem: cc.Node,
        rewardPanel: cc.Node,
        finishNode: cc.Node
    },
    initSignItem: function (e, t, i) {
        this.signDay = e;
        this.signJson = t;
        this.curDay = i;
        var o = this.signDay < this.curDay || (!(this.signDay > this.curDay) && cc.UISign.isRewardSign);
        this.finishNode.active = o;
        var a = this.signJson.reward;
        this.rewardDataList = [];
        if (7 == this.signDay) {
            var c = Math.floor(a.length / 2);
            var s = 0;
            for (var n = 0; n < c; n++) {
                var r = cc.pvz.utils.getRewardItem(a[s], a[s + 1]);
                s += 2;
                this.rewardPanel.children[n].getComponent("RewardItem").initRewardItem(r, !1);
                this.rewardDataList.push(r);
            }
        } else {
            var h;
            var p = cc.pvz.utils.getRewardItem(a[0], a[1]);
            this.rewardItem.getComponent("RewardItem").initRewardItem(p, !1);
            this.rewardDataList.push(p);
            cc.pvz.utils.setSpriteFrame(this.nameSprite, "uiImage", "sign/day" + this.signDay);
            if (o) {
                h = 1;
            } else {
                if (this.signDay > this.curDay) {
                    h = 3;
                } else {
                    h = 2;
                }
            }
            cc.pvz.utils.setSpriteFrame(this.bgSprite, "uiImage", "sign/k" + h);
        }
    },
    onGetSignReward: function (e) {
        if (void 0 === e) {
            e = !1;
        }
        if (e) {
            for (var t = 0; t < this.rewardDataList.length; t++) {
                this.rewardDataList[t].count *= 2;
            }
        }
        if (this.bgSprite) {
            cc.pvz.utils.setSpriteFrame(this.bgSprite, "uiImage", "sign/k1");
        }
        this.finishNode.active = !0;
        cc.UISign.onCloseUI();
        cc.popupManager.popup(
            "mainUI",
            "getrewardUI",
            "UIReward",
            {
                ad: !1,
                scale: !1
            },
            this.rewardDataList,
            cc.pvz.GameConfig.UIFromType["签到"]
        );
    }
});
