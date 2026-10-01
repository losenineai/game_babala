cc.Class({
    extends: cc.Component,
    properties: {
        buffIconList: [cc.Sprite],
        buffTipPanel: cc.Node,
        buffDescLabel: cc.RichText
    },
    onLoad: function () {
        this.buffDescLabel.enabled = !1;
    },
    onHideActBuffPanel: function () {
        this.node.active = !1;
    },
    onHideActBuffTip: function () {
        this.buffTipPanel.active = !1;
    },
    initActBuffInfo: function () {
        this.buffTipPanel.active = !1;
        this.ActLevelData = cc.pvz.PlayerData.getActLevelData();
        this.ActLevelBuffJson = cc.JsonControl.ActLevelBuffJson;
        for (var e = 0; e < 2; e++) {
            var t = this.ActLevelData.buffList[e];
            if (-1 == t) {
                t = this.getRandomBuff(0 == e);
                cc.pvz.PlayerData.updateActLevelBuff(e + 1, t);
            }
            var o = cc.JsonControl.getActBuffJson(t);
            cc.pvz.utils.setSpriteFrame(this.buffIconList[e], "uiImage", "tiaozhan/buff" + o.icon);
        }
    },
    getRandomBuff: function (e) {
        if (void 0 === e) {
            e = !0;
        }
        var t = [];
        for (var o = 0; o < this.ActLevelBuffJson.length; o++) {
            var a = this.ActLevelBuffJson[o];
            if (e) {
                if (a.id < 100) {
                    t.push(a.id);
                }
            } else {
                if (a.id > 100) {
                    t.push(a.id);
                }
            }
        }
        return t[cc.math.randomRangeInt(0, t.length)];
    },
    onClickBuff: function (e, t) {
        var o = parseInt(t);
        if (o != this.curBuffIndex) {
            this.curBuffIndex = o;
            var a = this.ActLevelData.buffList[o - 1];
            var n = cc.JsonControl.getActBuffJson(a);
            this.buffTipPanel.active = !0;
            this.buffDescLabel.string = n.desc;
            this.buffDescLabel.enabled = !0;
            this.buffTipPanel.position = cc.v2(
                this.buffIconList[o - 1].node.parent.position.x,
                this.buffTipPanel.position.y
            );
        } else {
            this.buffTipPanel.active = !this.buffTipPanel.active;
        }
    }
});
