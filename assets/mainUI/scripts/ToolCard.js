cc.Class({
    extends: cc.Component,
    properties: {
        spine: sp.Skeleton,
        qualitySprite: cc.Sprite,
        typeSprite: cc.Sprite,
        nameLabel: cc.Label,
        levelLabel: cc.Label,
        fragLabel: cc.Label,
        lvProgressBar: cc.ProgressBar,
        maxFragLine: cc.Node,
        lvTipNode: cc.Node,
        fragTipNode: cc.Node
    },
    initToolCardItem: function (e, t) {
        var i = this;
        this.ui = e;
        this.toolId = t;
        this.stageLevel = cc.pvz.PlayerData.getStageLevel();
        this.toolJson = cc.JsonControl.getToolJson(this.toolId);
        this.nameLabel.string = this.toolJson.name;
        cc.JsonControl.getToolTypeIcon(this.typeSprite, this.toolJson.lattice);
        this.spine.node.scale = this.toolJson.scale;
        cc.pvz.utils.useBundleAsset("actors", "kapi/hero" + this.toolId, sp.SkeletonData, function (e) {
            i.spine.skeletonData = e;
            i.refreshToolSpineShow();
        });
        this.onLvUpRefreshCard(!1);
    },
    refreshToolSpineShow: function () {
        var e = cc.pvz.PlayerData.getToolData(this.toolId).lv;
        var t = cc.pvz.utils.getLevelInterval(e);
        this.spine.setAnimation(0, "stand" + t, !0);
    },
    onLvUpRefreshCard: function (e) {
        if (void 0 === e) {
            e = !0;
        }
        this.toolData = cc.pvz.PlayerData.getToolData(this.toolId);
        this.toollvJson = cc.JsonControl.getToolLvUpJson(this.toolData.lv);
        if (e) {
            this.refreshToolSpineShow();
        }
        cc.JsonControl.getQualityCardIcon(this.qualitySprite, this.toolJson.quality);
        this.toolJson.quality;
        var t = this.stageLevel <= cc.pvz.GameConfig.ToolLockLevel[this.toolId - 1];
        if (t) {
            this.levelLabel.string = "未解锁";
        } else {
            this.levelLabel.string = "等级" + this.toolData.lv;
        }
        this.isMaxLv = this.toolData.lv >= cc.pvz.GameConfig.MaxToolLv;
        var i = this.toollvJson["sp" + this.toolJson.quality];
        this.isEnoughFrag = this.toolData.c >= i;
        if (this.isMaxLv) {
            this.fragLabel.string = "已满级";
        } else {
            this.fragLabel.string = this.toolData.c + "/" + i;
        }
        this.lvProgressBar.progress = this.toolData.c / i;
        this.lvProgressBar.node.active = !this.isEnoughFrag || !this.isMaxLv;
        this.maxFragLine.active = this.isEnoughFrag || this.isMaxLv;
        this.lvTipNode.active = this.isEnoughFrag && !this.isMaxLv;
        this.fragTipNode.active = !this.isEnoughFrag || this.isMaxLv;
    },
    onClickCard: function () {
        this.ui.onClickCard(this);
    }
});
