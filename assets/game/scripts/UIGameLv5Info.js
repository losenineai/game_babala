var i = [
    {
        id1: 2,
        id2: 8,
        id3: 102,
        lv1: 1
    },
    {
        id1: 5,
        id2: 1,
        id3: 105,
        lv1: 3
    },
    {
        id1: 9,
        id2: 10,
        id3: 109,
        lv1: 5
    },
    {
        id1: 12,
        id2: 4,
        id3: 112,
        lv1: 7
    },
    {
        id1: 13,
        id2: 6,
        id3: 113,
        lv1: 7
    }
];
cc.Class({
    extends: cc.Component,
    properties: {
        itemNode: cc.Node,
        unlockLine: cc.Node,
        heroJsonFile: cc.JsonAsset
    },
    initBy: function () {
        var t = this;
        this.unlockLine.zIndex = 2;
        this.itemNode.active = !0;
        var e = !1;
        i.forEach(function (i) {
            var n = cc.instantiate(t.itemNode);
            var o = t.heroJsonFile.json.find(function (t) {
                return t.id == i.id1;
            });
            var s = t.heroJsonFile.json.find(function (t) {
                return t.id == i.id2;
            });
            var c = t.heroJsonFile.json.find(function (t) {
                return t.id == i.id3;
            });
            var a = cc.find("q1", n).getComponent(cc.Sprite);
            var r = cc.find("i1", n).getComponent(cc.Sprite);
            var h = cc.find("q2", n).getComponent(cc.Sprite);
            var d = cc.find("i2", n).getComponent(cc.Sprite);
            cc.pvz.utils.setSpriteFrame(a, "uiImage", "item/pz_" + o.quality);
            cc.pvz.utils.setSpriteFrame(r, "uiImage", "plant/wq/zw_" + i.id1 + "_4");
            cc.pvz.utils.setSpriteFrame(h, "uiImage", "item/pz_" + s.quality);
            cc.pvz.utils.setSpriteFrame(d, "uiImage", "plant/wq/zw_" + i.id2 + "_4");
            cc.pvz.utils.setSpriteFrame(
                cc.find("i3", n).getComponent(cc.Sprite),
                "uiImage",
                "plant/wq/zw_" + i.id1 + "_5"
            );
            cc.find("name", n).getComponent(cc.Label).string = c.name;
            var u = cc.pvz.PlayerData.getToolData(i.id1).lv;
            var p = u >= i.lv1;
            var l = cc.pvz.PlayerData.getToolData(i.id2).lv >= 1;
            if (p) {
                cc.find("lock1", n).active = !1;
            } else {
                if (u >= 1) {
                    cc.find("lock1", n).getComponent(cc.Label).string = "等级" + i.lv1 + "解锁";
                } else {
                    cc.find("lock1", n).getComponent(cc.Label).string = cc.pvz.GameConfig.ToolLockTip.replace(
                        "$",
                        cc.pvz.GameConfig.ToolLockLevel[i.id1 - 1]
                    );
                }
                cc.JsonControl.setSpriteGray(a, !0);
                cc.JsonControl.setSpriteGray(r, !0);
                e = !0;
            }
            if (l) {
                cc.find("lock2", n).active = !1;
            } else {
                cc.find("lock2", n).getComponent(cc.Label).string = cc.pvz.GameConfig.ToolLockTip.replace(
                    "$",
                    cc.pvz.GameConfig.ToolLockLevel[i.id2 - 1]
                );
                cc.JsonControl.setSpriteGray(h, !0);
                cc.JsonControl.setSpriteGray(d, !0);
            }
            if (p && l) {
                n.zIndex = 1;
            } else {
                n.zIndex = 3;
            }
            n.parent = t.itemNode.parent;
        });
        this.unlockLine.active = e;
        this.itemNode.active = !1;
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
    }
});
