cc.Class({
    extends: cc.Component,
    properties: {
        fromLabel: cc.Label,
        toLabel: cc.Label
    },
    initBy: function (e, t) {
        this.fromLabel.string = e;
        this.toLabel.string = t;
    }
});
