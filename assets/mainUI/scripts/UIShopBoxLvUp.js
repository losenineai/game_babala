cc.Class({
    extends: cc.Component,
    properties: {
        lvLabel: cc.Label,
        boxPanel1: cc.Node,
        boxPanel2: cc.Node,
        boxLabels1: [cc.Label],
        boxLabels2: [cc.Label],
        closeBtn: cc.Node
    },
    initBy: function (e, t) {
        var i = this;
        this.closeBtn.active = !1;
        this.boxLv = e;
        this.shopBoxJson = t;
        this.lvLabel.string = "" + this.boxLv;
        this.boxLvJson = this.shopBoxJson[this.boxLv - 1];
        this.onBoxRewardShow(1, this.boxPanel1, this.boxLabels1);
        this.onBoxRewardShow(2, this.boxPanel2, this.boxLabels2);
        this.scheduleOnce(function () {
            cc.pvz.utils.fadeInBtn(i.closeBtn);
        }, 1);
    },
    onBoxRewardShow: function (e, t, i) {
        var o = this.boxLvJson["show" + e];
        var a = Math.floor(o.length / 2);
        var c = 0;
        for (var s = 0; s < t.childrenCount; s++) {
            if (s < a) {
                (t.children[s].active = !0), (i[s].string = "+" + o[c + 1]);
            } else {
                t.children[s].active = !1;
            }
            c += 2;
        }
    },
    onCloseUI: function () {
        cc.popupManager.removePopup(this);
    }
});
