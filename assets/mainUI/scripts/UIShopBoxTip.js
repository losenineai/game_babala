cc.Class({
    extends: cc.Component,
    properties: {
        leftBtn: cc.Node,
        rightBtn: cc.Node,
        leftClose: cc.Node,
        rightClose: cc.Node,
        lvLabel: cc.Label,
        boxPanel1: cc.Node,
        boxPanel2: cc.Node,
        boxLabels1: [cc.Label],
        boxLabels2: [cc.Label]
    },
    initBy: function (e, t) {
        this.boxLv = e;
        this.shopBoxJson = t;
        this.MaxBoxLv = this.shopBoxJson.length;
        this.lvLabel.string = "Lv." + this.boxLv;
        this.leftClose.active = 1 == this.boxLv;
        this.rightClose.active = this.boxLv == this.MaxBoxLv;
        this.boxLvJson = this.shopBoxJson[this.boxLv - 1];
        this.onBoxRewardShow(1, this.boxPanel1, this.boxLabels1);
        this.onBoxRewardShow(2, this.boxPanel2, this.boxLabels2);
    },
    onClickPage: function (e, t) {
        if (parseInt(t) < 0) {
            if (1 == this.boxLv) {
                return;
            }
            this.boxLv--;
        } else {
            if (this.boxLv == this.MaxBoxLv) {
                return;
            }
            this.boxLv++;
        }
        this.lvLabel.string = "Lv." + this.boxLv;
        this.leftClose.active = 1 == this.boxLv;
        this.rightClose.active = this.boxLv == this.MaxBoxLv;
        this.boxLvJson = this.shopBoxJson[this.boxLv - 1];
        this.onBoxRewardShow(1, this.boxPanel1, this.boxLabels1);
        this.onBoxRewardShow(2, this.boxPanel2, this.boxLabels2);
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
