cc.Class({
    extends: cc.Component,
    properties: {
        coinLabel: cc.Label,
        diamondLabel: cc.Label,
        rankLabel: cc.Label,
        boxJsonFile: cc.JsonAsset
    },
    initBy: function (e, t) {
        var n = this.getBoxIDByRank(e);
        var c = this.boxJsonFile.json.find(function (e) {
            return e.ID == n;
        });
        this.coinLabel.string = "x" + c.reward[1];
        this.diamondLabel.string = "x" + c.reward[3];
        this.rankLabel.string = e + 1;
        cc.player.rankWeek = cc.pvz.utils.getStartOfWeek();
        cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["金币"], c.reward[1]);
        cc.pvz.PlayerData.changeItemNum(cc.pvz.GameConfig.ItemType["钻石"], c.reward[3]);
        this.closeCb = t;
    },
    getBoxIDByRank: function (e) {
        var t = e + 1;
        for (var n = 0; n < this.boxJsonFile.json.length; n++) {
            var c = this.boxJsonFile.json[n];
            if (t >= c.rank1 && t <= c.rank2) {
                return c.ID;
            }
        }
        return this.boxJsonFile.json[this.boxJsonFile.json.length - 1].ID;
    },
    onClickClose: function () {
        this.closeCb();
        cc.popupManager.showEffectFly(
            cc.pvz.GameConfig.ItemType["金币"],
            cc.MainControl.getItemEffectPos(cc.pvz.GameConfig.ItemType["金币"]),
            1
        );
        cc.popupManager.showEffectFly(
            cc.pvz.GameConfig.ItemType["钻石"],
            cc.MainControl.getItemEffectPos(cc.pvz.GameConfig.ItemType["钻石"]),
            2
        );
        cc.MainControl.updateItemInfo();
        cc.popupManager.removePopup(this);
    }
});
