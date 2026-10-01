cc.Class({
    extends: cc.Component,
    properties: {
        bgSprites: [cc.Sprite],
        toolCardNode: cc.Node,
        attrbibuteIcons: [cc.Sprite],
        attrNumLabels: [cc.Label],
        attrNameLabels: [cc.Label],
        attriNextLabels: [cc.Label],
        priceLabel: cc.Label,
        levelUpSpine: sp.Skeleton,
        lvBtn: cc.Node,
        maxTipNode: cc.Node,
        lockTipLabel: cc.Label,
        lockTipNode: cc.Node,
        skinBtn: cc.Node,
        baseSkillNode: cc.Node,
        skillParentPanel: cc.Node,
        lvBtnSprites: [cc.Sprite],
        actionLabel: cc.Label,
        actionBtnNode: cc.Node
    },
    onLoad: function () {
        this.levelUpSpine.node.active = !1;
    },
    initBy: function (e, t, i, o) {
        if (void 0 === i) {
            i = !1;
        }
        if (void 0 === o) {
            o = null;
        }
        this.ui = e;
        this.toolId = t;
        this.isLock = i;
        this.callBack = o;
        this.toolData = cc.pvz.PlayerData.getToolData(this.toolId);
        this.toolJson = cc.JsonControl.getToolJson(this.toolId);
        this.inLv = this.toolData.lv;
        this.toolCardItem = this.toolCardNode.getComponent("ToolCard");
        this.toolCardItem.initToolCardItem(this.ui, this.toolId);
        this.maxTipNode.active = this.toolCardItem.isMaxLv;
        this.lvBtn.active = !this.isLock && !this.toolCardItem.isMaxLv;
        this.lockTipLabel.node.active = this.isLock;
        this.lockTipLabel.string = cc.pvz.GameConfig.ToolLockTip.replace(
            "$",
            cc.pvz.GameConfig.ToolLockLevel[this.toolId - 1]
        );
        this.lockTipNode.active = this.isLock;
        this.skinBtn.active = !this.isLock;
        this.actionBtnNode.active = !this.isLock;
        if (this.actionBtnNode.active) {
            if (-1 == this.toolData.pos) {
                this.actionLabel.string = "上阵";
            } else {
                this.actionLabel.string = "卸下";
            }
        }
        for (var a = 0; a < this.bgSprites.length; a++) {
            this.bgSprites[a].setMaterial(0, cc.JsonControl.materialList[this.isLock ? 1 : 0]);
        }
        this.initAttributeInfo();
        this.initSkillInfo();
        if (this.toolCardItem.isMaxLv || this.isLock) {
            //
        } else {
            this.refreshLvInfo();
        }
        if (2 == cc.tempGuideIndex) {
            this.scheduleOnce(this.startGuide, 0.42);
        }
    },
    startGuide: function () {
        if (2 == cc.tempGuideIndex) {
            var e = cc.find("back", this.node);
            var t = cc.MainControl.btnNodeList[2];
            var i = cc.find("btn/battlePanel/btn_start", cc.MainUI.node);
            cc.guideManager.showGuide(
                0,
                [
                    {
                        tip: "消耗碎片和金币能使卡皮巴拉变得更强！",
                        focus: this.lvBtn,
                        btn: this.lvBtn.name
                    },
                    {
                        tip: "关卡中获得更多卡皮巴拉碎片",
                        focus: e,
                        btn: e.name
                    },
                    {
                        tip: "前方怪兽们正在接近，赶紧过去看看！",
                        focus: t,
                        btn: t.name
                    },
                    {
                        tip: "让怪兽们看看你的厉害，开始战斗吧！",
                        focus: i,
                        btn: i.name
                    }
                ],
                function (e, t) {
                    if (e) {
                        cc.tempGuideIndex = 3;
                    } else {
                        if (1 == t) {
                            cc.player.guide1 = 1;
                            cc.pvz.PlayerData.onDataChanged();
                        }
                    }
                }
            );
        }
    },
    refreshLvInfo: function () {
        var e = cc.JsonControl.getToolLvUpJson(this.toolData.lv);
        var t = this.toolJson.quality;
        this.priceCoin = e["coins" + t];
        this.priceLabel.string = "" + this.priceCoin;
        this.priceFrag = e["sp" + t];
        this.isEnoughCoin = cc.pvz.PlayerData.isItemEnough(cc.pvz.GameConfig.ItemType["金币"], this.priceCoin);
        for (var i = 0; i < this.lvBtnSprites.length; i++) {
            this.lvBtnSprites[i].setMaterial(0, cc.JsonControl.materialList[this.isEnoughCoin ? 0 : 1]);
        }
    },
    initSkillInfo: function () {
        this.baseSkillNode.getComponent("ToolSkillInfo").initSkillInfo(this.toolId, 1, this.toolData.lv, this.isLock);
        for (var e = 1; e < 5; e++) {
            var t = cc.instantiate(this.baseSkillNode);
            t.parent = this.skillParentPanel;
            t.active = !0;
            t.getComponent("ToolSkillInfo").initSkillInfo(this.toolId, e + 1, this.toolData.lv, this.isLock);
        }
    },
    initAttributeInfo: function () {
        for (var e = 0; e < this.attrbibuteIcons.length; e++) {
            var t = this.toolJson["attributetype" + (e + 1)];
            cc.JsonControl.getToolAttriIcon(this.attrbibuteIcons[e], t);
            this.attrNameLabels[e].string = cc.pvz.GameConfig.ToolAttriNameList[t - 1];
        }
        for (var i = 0; i < this.attrNumLabels.length; i++) {
            this.attrNumLabels[i].string = this.getAttributeNums(i);
        }
    },
    getAttributeNums: function (e) {
        var t = "";
        var i;
        if (0 == this.toolData.lv) {
            i = 1;
        } else {
            i = this.toolData.lv;
        }
        switch (e) {
            case 0:
                t = "" + this.toolJson.Atk;
                break;
            case 1:
                if (3 == this.toolId || 10 == this.toolId) {
                    t = this.toolJson.cdtxt[i - 1] + "秒";
                    if (this.toolJson.cdtxt.length > i) {
                        this.attriNextLabels[2].node.active = !0;
                        var o = this.toolJson.cdtxt[i - 1] - this.toolJson.cdtxt[i];
                        o = cc.pvz.utils.foramtAttributeNum(o);
                        this.attriNextLabels[2].string = "-" + o;
                    } else {
                        this.attriNextLabels[2].node.active = !1;
                    }
                } else {
                    t = this.toolJson.cdtxt + (8 == this.toolId || 6 == this.toolId ? "秒" : "");
                    this.attriNextLabels[2].node.active = !1;
                }
                break;
            case 2:
            case 3:
                var a = this.toolJson["attributetype" + (e - 1)],
                    c = this.toolJson["attribute" + (e - 1)],
                    s = 0;
                if (1 == c.length) {
                    s = c[0];
                    this.attriNextLabels[e - 2].node.active = !1;
                } else if (((s = c[i - 1]), c.length > i)) {
                    var n = c[i] - s;
                    n = cc.pvz.utils.foramtAttributeNum(n);
                    this.attriNextLabels[e - 2].node.active = !0;
                    this.attriNextLabels[e - 2].string = "+" + n + (9 == a ? "%" : "");
                } else {
                    this.attriNextLabels[e - 2].node.active = !1;
                }
                t = s + (9 == a ? "%" : "");
        }
        return t;
    },
    showLvUpSpine: function () {
        var e = this;
        this.levelUpSpine.node.active = !0;
        this.levelUpSpine.setAnimation(0, "zb_sj", !1);
        this.levelUpSpine.setCompleteListener(function () {
            e.levelUpSpine.node.active = !1;
            e.levelUpSpine.setCompleteListener(null);
        });
        cc.butler.playEffect(cc.MainControl.lvUpSound);
    },
    refreshLevelUp: function () {
        this.maxTipNode.active = this.toolCardItem.isMaxLv;
        this.lvBtn.active = !this.toolCardItem.isMaxLv;
        for (var e = 0; e < this.attrNumLabels.length; e++) {
            this.attrNumLabels[e].string = this.getAttributeNums(e);
        }
        for (var t = 0; t < 5; t++) {
            this.skillParentPanel.children[t]
                .getComponent("ToolSkillInfo")
                .initSkillInfo(this.toolId, t + 1, this.toolData.lv);
        }
        if (this.toolCardItem.isMaxLv) {
            //
        } else {
            this.refreshLvInfo();
        }
    },
    onClickLvUp: function () {
        var e = this;
        if (this.isEnoughCoin) {
            if (this.toolCardItem.isEnoughFrag) {
                this.showLvUpSpine();
                cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["升级任意装备1次"], 1);
                cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["装备总等级n"]);
                cc.pvz.PlayerData.addMissionProgress(cc.pvz.GameConfig.MissionType["装备最高等级达到n"]);
                cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["金币"], -this.priceCoin);
                cc.pvz.PlayerData.updateToolFragCount(this.toolId, -this.priceFrag);
                cc.pvz.PlayerData.updateToolLv(this.toolId, 1);
                this.toolCardItem.onLvUpRefreshCard();
                this.refreshLevelUp();
                cc.MainControl.updateItemInfo();
                cc.RedControl.refreshAllRedTip();
            } else if (cc.pvz.PlayerData.isHaveAdBuyToolTimes(this.toolId)) {
                var t = cc.pvz.utils.getRewardToolItem(
                    this.toolId,
                    cc.pvz.GameConfig.AdBuyTooldCounts[this.toolJson.quality - 2]
                );
                cc.popupManager.popup(
                    "mainUI",
                    "adbuyUI",
                    "UIAdBuy",
                    {
                        ad: !1,
                        scale: !0
                    },
                    t,
                    function () {
                        e.toolCardItem.onLvUpRefreshCard();
                    }
                );
            } else {
                cc.popupManager.showToast("碎片不足！");
            }
        } else if (cc.pvz.PlayerData.isHaveAdBuyBankTimes(0)) {
            var i = cc.pvz.utils.getRewardItem(cc.pvz.GameConfig.ItemType["金币"], 2500);
            cc.popupManager.popup(
                "mainUI",
                "adbuyUI",
                "UIAdBuy",
                {
                    ad: !1,
                    scale: !0
                },
                i,
                function () {
                    e.isEnoughCoin = cc.pvz.PlayerData.isItemEnough(cc.pvz.GameConfig.ItemType["金币"], e.priceCoin);
                    for (var t = 0; t < e.lvBtnSprites.length; t++) {
                        e.lvBtnSprites[t].setMaterial(0, cc.JsonControl.materialList[e.isEnoughCoin ? 0 : 1]);
                    }
                }
            );
        } else {
            cc.popupManager.showToast("金币不足！");
        }
    },
    onClickUpDown: function () {
        if (-1 == this.toolData.pos) {
            this.ui.onClickUp(this);
        } else {
            this.ui.onClickDown(this.toolId);
        }
        cc.UITool.isChangeArray = !0;
        this.onCloseUI();
    },
    onClickSkin: function () {
        cc.popupManager.popup(
            "mainUI",
            "plantskin",
            "UIToolSkin",
            {
                ad: !1,
                scale: !0
            },
            this.toolId
        );
    },
    onCloseUI: function () {
        if (this.inLv != this.toolData.lv) {
            cc.RedControl.onCheckToolLvRed();
            cc.RedControl.onCheckBattleRed();
        }
        if (this.callBack) {
            this.callBack();
        }
        cc.popupManager.removePopup(this);
    }
});
