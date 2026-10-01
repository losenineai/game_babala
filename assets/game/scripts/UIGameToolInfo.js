cc.Class({
    extends: cc.Component,
    properties: {
        nameLabel: cc.Label,
        lvLabel: cc.Label,
        iconSpine: sp.Skeleton,
        attrbibuteIcons: [cc.Sprite],
        attrNumLabels: [cc.Label],
        attrNameLabels: [cc.Label],
        arrti4Panel: cc.Node
    },
    initBy: function (t, e) {
        var i = this;
        this.toolId = t;
        if (t > 100) {
            this.fakeToolId = t - 100;
        } else {
            this.fakeToolId = t;
        }
        if (99 == this.toolId) {
            this.toolLv = 1;
            this.arrti4Panel.active = !1;
        } else {
            var n = cc.pvz.PlayerData.getToolData(this.fakeToolId);
            if (0 == n.lv) {
                this.toolLv = 1;
            } else {
                this.toolLv = n.lv;
            }
        }
        var o = cc.JsonControl.getToolJson(this.toolId);
        this.nameLabel.string = o.name;
        this.gameToolLv = e + 1;
        cc.pvz.utils.useBundleAsset("actors", "kapi/hero" + this.toolId, sp.SkeletonData, function (t) {
            i.iconSpine.skeletonData = t;
            var e = i.gameToolLv;
            i.iconSpine.setAnimation(0, "stand" + e, !0);
        });
        this.lvLabel.string = "合成等级" + this.gameToolLv;
        this.toolJson = cc.JsonControl.getToolJson(this.fakeToolId);
        this.initAttributeInfo();
        cc.butler.resumeDirector(1);
    },
    initAttributeInfo: function () {
        if (99 == this.toolId) {
            var t = this.toolJson.attributetype1;
            cc.JsonControl.getToolAttriIcon(this.attrbibuteIcons[0], t);
            this.attrNameLabels[0].string = cc.pvz.GameConfig.ToolAttriNameList[t - 1];
            for (var e = 0; e < 3; e++) {
                this.attrNumLabels[e].string = this.getAttributeNums(e);
            }
        } else {
            for (var i = 0; i < this.attrbibuteIcons.length; i++) {
                var n = this.toolJson["attributetype" + (i + 1)];
                cc.JsonControl.getToolAttriIcon(this.attrbibuteIcons[i], n);
                this.attrNameLabels[i].string = cc.pvz.GameConfig.ToolAttriNameList[n - 1];
            }
            for (var o = 0; o < this.attrNumLabels.length; o++) {
                this.attrNumLabels[o].string = this.getAttributeNums(o);
            }
        }
    },
    getAttributeNums: function (t) {
        var e = "";
        switch (t) {
            case 0:
                e = "" + this.toolJson.Atk;
                break;
            case 1:
                e =
                    3 == this.toolId || 10 == this.toolId
                        ? this.toolJson.cdtxt[this.toolLv - 1] + "秒"
                        : this.toolJson.cdtxt + (8 == this.toolId || 6 == this.toolId ? "秒" : "");
                break;
            case 2:
            case 3:
                var i = 0,
                    n = this.toolJson["attributetype" + (t - 1)],
                    o = this.toolJson["attribute" + (t - 1)],
                    s = this.toolJson["fighttype" + (t - 1)];
                i = 1 == o.length ? o[0] : o[this.toolLv - 1];
                if (this.gameToolLv > 1 && "" != s) {
                    i *= this.toolJson["fightlvup" + (t - 1)][this.gameToolLv - 2] / 100;
                    if (9 == n) {
                        (10 * i) % 10 != 0 && (i = i.toFixed(1));
                    } else {
                        i = Math.floor(i);
                    }
                }
                e = i + (9 == n ? "%" : "");
        }
        return e;
    },
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
    }
});
