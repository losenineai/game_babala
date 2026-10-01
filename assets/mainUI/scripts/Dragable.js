cc.Class({
    extends: cc.Component,
    properties: {
        dragingRoot: cc.Node,
        onDragBegan: cc.Component.EventHandler,
        onDragMoved: cc.Component.EventHandler,
        onDragEnded: cc.Component.EventHandler
    },
    start: function () {
        this.initRoot = this.node.parent;
        this.initPos = this.node.position;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClickBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onClickMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnded, this);
    },
    setNodePos: function (e) {
        this.node.position = this.node.parent.convertToNodeSpaceAR(e);
    },
    onClickBegan: function (e) {
        var t = e.getLocation();
        this.node.parent = this.dragingRoot;
        this.setNodePos(t);
        if (this.onDragBegan) {
            this.onDragBegan.emit([this, t]);
        }
    },
    onClickMoved: function (e) {
        var t = e.getLocation();
        this.setNodePos(t);
        if (this.onDragMoved) {
            this.onDragMoved.emit([this, t]);
        }
    },
    onClickEnded: function (e) {
        var t = e.getLocation();
        this.setNodePos(t);
        if (this.onDragEnded) {
            this.onDragEnded.emit([this, t]);
        }
        this.node.parent = this.initRoot;
        this.node.position = this.initPos;
    }
});
