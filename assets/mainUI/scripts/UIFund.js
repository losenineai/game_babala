var $prefabInfo = require("../../scripts/PrefabInfo");
cc.Class({
    extends: cc.Component,
    properties: {
        rowPrefab: $prefabInfo,
        fundsJsonFile: cc.JsonAsset,
        scorll: cc.ScrollView,
        barRoot: cc.Node,
        lineRoot: cc.Node,
        coinLabel: cc.Label,
        diamondLabel: cc.Label,
        panel: cc.Node
    },
    onLoad: function () {
        this.barRoot.zIndex = cc.macro.MIN_ZINDEX;
        this.lineRoot.parent.zIndex = cc.macro.MAX_ZINDEX;
    },
    updateItemInfo: function () {
        var e = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["金币"]);
        this.coinLabel.string = cc.pvz.utils.formatItemNum(e);
        var t = cc.pvz.PlayerData.getItemNum(cc.pvz.GameConfig.ItemType["钻石"]);
        this.diamondLabel.string = cc.pvz.utils.formatItemNum(t);
    },
    initBy: function () {
        var e = this;
        this.panel.scale = this.node.width / 720;
        this.scorll.node.height = this.scorll.node.height / this.panel.scale;
        this.roots = [];
        var t = this.fundsJsonFile.json.length;
        this.fundsJsonFile.json.forEach(function (i, o) {
            if (cc.player.level <= i.need && o < t) {
                t = o;
            }
            var a = new cc.Node();
            a.height = e.rowPrefab.prefab.height;
            a.parent = e.rowPrefab.root;
            e.roots[o] = a;
        });
        this.fillItems(0, 7);
        this.rowPrefab.root.height = this.fundsJsonFile.json.length * this.rowPrefab.prefab.height;
        this.barRoot.y = (0.5 - t) * this.rowPrefab.prefab.height;
        this.lineRoot.y = (this.fundsJsonFile.json.length - t) * this.rowPrefab.prefab.height;
        this.updateItemInfo();
        cc.pvz.TAUtils.trackAdUIShow(cc.pvz.GameConfig.AdType["基金"]);
    },
    fillItems: function (e, t) {
        var i = this;
        var o = Math.min(t, this.fundsJsonFile.json.length);
        var a = function () {
            var e = i.fundsJsonFile.json[c];
            var t = cc.player.level <= e.need;
            var o = i.rowPrefab.addNodeTo(i.roots[c]);
            cc.find("name", o).getComponent(cc.Label).string = e.need + "关";
            ["item", "itemAd", "itemAd2"].forEach(function (i, a) {
                var c = e["reward" + (a + 1)];
                var s = cc.find(i, o);
                s.getComponent("RewardItem").initRewardItem(
                    {
                        itemId: c[0],
                        count: c[1],
                        toolId: -1
                    },
                    !1
                );
                var n = !t && cc.pvz.PlayerData.hasFundGet(e.ID, a);
                cc.find("lock", s).active = t;
                cc.find("open", s).active = !t && !n;
                cc.find("finish", s).active = !t && n;
                s.getComponent(cc.Button).clickEvents[0].customEventData = e.ID + "," + a;
            });
        };
        var c = e;
        for (var s = o; c < s; c++) {
            a();
        }
        this.beginIndex = e;
        this.endIndex = o;
    },
    onScrollEvent: function (e) {
        var t = Math.floor(e.content.y / this.rowPrefab.prefab.height) + 7;
        if (this.endIndex < t && this.endIndex < this.fundsJsonFile.json.length) {
            this.fillItems(this.endIndex, this.endIndex + 1);
        }
    },
    onClickGetFund: function (e, t) {
        var i = this;
        var o = t.split(",");
        var a = parseInt(o[0]);
        var c = parseInt(o[1]);
        if (!cc.pvz.PlayerData.hasFundGet(a, c)) {
            var s = function () {
                cc.pvz.PlayerData.setFundGetted(a, c);
                var t = e.target.getComponent("RewardItem");
                cc.find("open", t.node).active = !1;
                cc.find("finish", t.node).active = !0;
                cc.popupManager.popup(
                    "mainUI",
                    "getrewardUI",
                    "UIReward",
                    {
                        ad: !0,
                        scale: !1
                    },
                    [
                        {
                            itemId: t.itemId,
                            count: t.count,
                            toolId: -1
                        }
                    ],
                    cc.pvz.GameConfig.UIFromType["基金"],
                    function () {
                        i.updateItemInfo();
                        cc.MainControl.updateItemInfo();
                    },
                    function (e) {
                        if (e === cc.pvz.GameConfig.ItemType["钻石"]) {
                            return i.diamondLabel.node.convertToWorldSpaceAR(cc.v2());
                        } else {
                            return i.coinLabel.node.convertToWorldSpaceAR(cc.v2());
                        }
                    }
                );
            };
            if (c > 0) {
                cc.pvz.AdUtils.showAdRewardVideo(cc.pvz.GameConfig.AdType["基金"], function (e) {
                    if (e) {
                        s();
                    }
                });
            } else {
                s();
            }
        }
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
        cc.RedControl.refreshAllRedTip();
    }
});
