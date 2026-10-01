cc.Class({
    extends: cc.Component,
    properties: {
        powerLabel: cc.Label,
        powerTimeLabel: cc.Label
    },
    updatePowerInfo: function () {
        this.lastTime = 0;
        var e = 0;
        var t = cc.pvz.PlayerData.getPowerDate();
        if (t > 0) {
            var o = Math.abs(Date.now() - t) / 1e3;
            e = parseInt(o / cc.pvz.GameConfig.CdPowerTime);
        }
        if (e > 0 && !cc.pvz.PlayerData.isMaxPower()) {
            cc.pvz.PlayerData.addPower(e);
        }
        var a = cc.pvz.PlayerData.getPower();
        var n = cc.pvz.PlayerData.getMaxPower();
        this.powerLabel.string = a + "/" + n;
        this.isMaxPower = cc.pvz.PlayerData.isMaxPower();
        this.powerTimeLabel.node.active = !this.isMaxPower;
        if (!this.isMaxPower) {
            if (t < 0) {
                cc.player.powerDate = Date.now() + 1e3 * cc.pvz.GameConfig.CdPowerTime;
                t = cc.player.powerDate;
            }
            var i = Math.abs(Date.now() - t) / 1e3;
            this.lastTime = parseInt(i) - e * cc.pvz.GameConfig.CdPowerTime;
            this.powerTimeLabel.string = cc.pvz.utils.formatSeconds2(this.lastTime);
            this.schedule(this.onRefreshTime, 1);
        }
    },
    onRefreshTime: function () {
        this.lastTime--;
        if (0 == this.lastTime) {
            if (cc.pvz.PlayerData.isMaxPower()) {
                //
            } else {
                cc.pvz.PlayerData.addPower(1);
            }
            var e = cc.pvz.PlayerData.getPower();
            var t = cc.pvz.PlayerData.getMaxPower();
            this.powerLabel.string = e + "/" + t;
            this.isMaxPower = cc.pvz.PlayerData.isMaxPower();
            if (this.isMaxPower) {
                this.powerTimeLabel.node.active = !1;
                return void this.unschedule(this.onRefreshTime, this);
            }
            this.lastTime = cc.pvz.GameConfig.CdPowerTime;
        }
        this.powerTimeLabel.string = cc.pvz.utils.formatSeconds2(this.lastTime);
    },
    checkPowerShow: function () {
        var e = cc.pvz.PlayerData.getPower();
        var t = cc.pvz.PlayerData.getMaxPower();
        this.powerLabel.string = e + "/" + t;
        if (e >= t) {
            this.powerTimeLabel.node.active = !1;
            return void this.unscheduleAllCallbacks();
        }
        if (this.powerTimeLabel.node.active) {
            //
        } else {
            this.lastTime = cc.pvz.GameConfig.CdPowerTime;
            this.powerTimeLabel.node.active = !0;
            this.powerTimeLabel.string = cc.pvz.utils.formatSeconds2(this.lastTime);
            this.schedule(this.onRefreshTime, 1);
        }
    }
});
