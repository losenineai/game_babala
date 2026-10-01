var $enemy = require("./Enemy");
cc.Class({
    extends: $enemy,
    properties: {
        groundNode: cc.Node
    },
    initBy: function (t, e, n, o) {
        $enemy.prototype.initBy.call(this, t, e, n, o);
        this.groundNode.parent = this.scene.ground;
        this.groundNode.position = this.node.position;
    },
    update: function (t) {
        $enemy.prototype.update.call(this, t);
        if (this.groundNode) {
            this.groundNode.position = this.node.position;
        }
    },
    hurtBy: function (t, e) {
        if (this.hp <= 0) {
            //
        } else {
            $enemy.prototype.hurtBy.call(this, t, e);
            if (this.hp <= 0 && this.groundNode) {
                this.groundNode.parent = null;
                this.groundNode = null;
            }
        }
    }
});
