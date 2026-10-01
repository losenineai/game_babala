var $prefabInfo = require("../../scripts/PrefabInfo");
cc.Class({
    extends: cc.Component,
    properties: {
        prefab: $prefabInfo
    },
    initBy: function (t) {
        var e = this;
        var i = 1;
        cc.pvz.runtimeData.stats.forEach(function (t) {
            i += t;
        });
        t.heroes
            .map(function (t) {
                return t;
            })
            .sort(function (t, e) {
                return cc.pvz.runtimeData.stats[e.info.id] - cc.pvz.runtimeData.stats[t.info.id];
            })
            .forEach(function (t) {
                if (3 != t.info.id && 7 != t.info.id && 11 != t.info.id) {
                    var n = cc.pvz.runtimeData.stats[t.info.id];
                    var o = t.info.json;
                    var s = e.prefab.addNode();
                    cc.pvz.utils.setSpriteFrame(
                        cc.find("quality", s).getComponent(cc.Sprite),
                        "uiImage",
                        "item/pz_" + o.quality
                    );
                    cc.pvz.utils.setSpriteFrame(
                        cc.find("icon", s).getComponent(cc.Sprite),
                        "uiImage",
                        "plant/wq/zw_" + t.info.id + "_" + (t.info.maxLv + 1)
                    );
                    cc.find("name", s).getComponent(cc.Label).string = o.name;
                    cc.find("num", s).getComponent(cc.Label).string = Math.round(n);
                    var c = n / i;
                    cc.find("num2", s).getComponent(cc.Label).string = (100 * c).toFixed(2) + "%";
                    cc.find("bar", s).getComponent(cc.ProgressBar).progress = c;
                }
            });
        this.timer = -1;
        if (cc.director.isPaused()) {
            this.prefab.root.getComponent(cc.Layout).updateLayout();
        }
    },
    onClickClose: function () {
        cc.popupManager.removePopup(this);
    }
});
