cc.Class({
    extends: cc.Component,
    properties: {
        onEnter: cc.Component.EventHandler,
        onStay: cc.Component.EventHandler,
        onExit: cc.Component.EventHandler
    },
    onCollisionEnter: function (t, e) {
        if (this.onEnter) {
            this.onEnter.emit([t, e]);
        }
    },
    onCollisionStay: function (t, e) {
        if (this.onStay) {
            this.onStay.emit([t, e]);
        }
    },
    onCollisionExit: function (t, e) {
        if (this.onExit) {
            this.onExit.emit([t, e]);
        }
    }
});
