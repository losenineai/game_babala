var a = cc._decorator;
var n = a.ccclass;
var i = a.property;
var c = (function (e) {
    function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        t.soundEffects = [];
        t.bgms = [];
        return t;
    }
    var o;
    __extends(t, e);
    o = t;
    t.prototype.start = function () {
        o.SoundEffects = [];
        o.Bgms = [];
        for (var e = 0; e < this.soundEffects.length; e++) {
            o.SoundEffects.push(this.soundEffects[e]);
        }
        for (e = 0; e < this.bgms.length; e++) {
            o.Bgms.push(this.bgms[e]);
        }
        o.effPlayTime = {};
    };
    t.playBgm = function (e) {
        cc.butler.playMusic(o.Bgms[e]);
    };
    t.playEffect = function (e) {
        if (e) {
            cc.butler.playEffect(o.SoundEffects[e]);
        }
    };
    t.playEffect2 = function (e) {
        if (!o.effPlayTime[e] || Date.now() - o.effPlayTime[e] > 100) {
            cc.butler.playEffect(o.SoundEffects[e]);
            o.effPlayTime[e] = Date.now();
        }
    };
    t.SoundEffects = [];
    t.Bgms = [];
    t.effPlayTime = {};
    __decorate([i(cc.AudioClip)], t.prototype, "soundEffects", void 0);
    __decorate([i(cc.AudioClip)], t.prototype, "bgms", void 0);
    return (o = __decorate([n], t));
})(cc.Component);
exports.default = c;
