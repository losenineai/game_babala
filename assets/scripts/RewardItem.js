cc.Class({
    extends: cc.Component,
    properties: {
        iconSprite: cc.Sprite,
        spine: sp.Skeleton,
        fragNode: cc.Node,
        qualitySprite: cc.Sprite,
        countLabel: cc.Label
    },
    initBoxRewardItem: function (e) {
        this.RewardData = e;
        this.itemId = this.RewardData.itemId;
        this.count = this.RewardData.count;
        this.countLabel.string = "x" + cc.pvz.utils.formatItemNum(this.count);
        var t = cc.JsonControl.getItemJson(this.itemId);
        cc.JsonControl.getItemIcon(this.iconSprite, t.Icon);
        cc.JsonControl.getQualityBgIcon(this.qualitySprite, t.Quality);
    },
    onClickShopBox: function () {
        if (this.itemId >= 5 && this.itemId <= 7) {
            cc.popupManager.popup(
                "mainUI",
                "shopboxList",
                "UIShopBoxDetail",
                {
                    ad: !1,
                    scale: !0
                },
                this.itemId
            );
        }
    },
    initShopBoxToolItem: function (e, t) {
        var o = this;
        var a = e;
        var n = cc.JsonControl.getToolJson(a);
        cc.JsonControl.getQualityBgIcon(this.qualitySprite, n.quality);
        var i = cc.pvz.PlayerData.getToolData(a);
        var c = cc.pvz.utils.getLevelInterval(i.lv);
        this.spine.node.scale = n.scale;
        cc.pvz.utils.useBundleAsset("actors", "kapi/hero" + a, sp.SkeletonData, function (e) {
            o.spine.skeletonData = e;
            o.spine.setAnimation(0, "stand" + c, !0);
        });
        this.fragNode.active = t;
        if (t) {
            for (var s = 0; s < this.node.childrenCount; s++) {
                this.node.children[s].getComponent(cc.Sprite).setMaterial(0, cc.JsonControl.materialList[t ? 1 : 0]);
            }
        }
    },
    initRewardItem: function (e, t) {
        var o = this;
        if (void 0 === t) {
            t = !0;
        }
        this.RewardData = e;
        this.itemId = this.RewardData.itemId;
        this.count = this.RewardData.count;
        this.toolId = this.RewardData.toolId;
        this.countLabel.string = "x" + this.count;
        var a = cc.JsonControl.getItemJson(this.itemId);
        if (this.spine) {
            this.spine.node.active = this.itemId == cc.pvz.GameConfig.ItemType["固定碎片"];
        }
        if (this.iconSprite) {
            this.iconSprite.node.active = this.itemId != cc.pvz.GameConfig.ItemType["固定碎片"];
        }
        if (this.itemId === cc.pvz.GameConfig.ItemType["固定碎片"]) {
            if (this.fragNode) {
                this.fragNode.active = !0;
            }
            var n = cc.JsonControl.getToolJson(this.toolId);
            cc.JsonControl.getQualityBgIcon(this.qualitySprite, n.quality);
            var i = cc.pvz.PlayerData.getToolData(this.toolId);
            var c = cc.pvz.utils.getLevelInterval(i.lv);
            this.spine.node.scale = n.scale;
            cc.pvz.utils.useBundleAsset("actors", "kapi/hero" + this.toolId, sp.SkeletonData, function (e) {
                o.spine.skeletonData = e;
                o.spine.setAnimation(0, "stand" + c, !0);
            });
        } else {
            cc.JsonControl.getItemIcon(this.iconSprite, a.Icon);
            cc.JsonControl.getQualityBgIcon(this.qualitySprite, a.Quality);
            this.fragNode && (this.fragNode.active = !1);
        }
        if (t) {
            this.onSaveReward();
        }
    },
    onSaveReward: function () {
        switch (this.itemId) {
            case cc.pvz.GameConfig.ItemType["体力"]:
                cc.pvz.PlayerData.addPower(this.count, !0);
                break;
            case cc.pvz.GameConfig.ItemType["荣誉"]:
                cc.pvz.PlayerData.updateActLevelScore(this.count);
                break;
            case cc.pvz.GameConfig.ItemType["固定碎片"]:
                cc.pvz.PlayerData.updateToolFragCount(this.toolId, this.count);
                break;
            default:
                cc.pvz.PlayerData.changeItemNum(this.itemId, this.count);
        }
    }
});
