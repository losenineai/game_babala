cc.Class({
    extends: cc.Component,
    properties: {
        top123Nodes: [cc.Node],
        rank1234Nodes: [cc.Node],
        emptyTip: cc.Node,
        rankMeNode: cc.Node,
        boxJsonFile: cc.JsonAsset,
        boxPopupRoot: cc.Node
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
    fillRankNode: function (e, t) {
        var n = -1 != t.rank;
        var c = null;
        if (e) {
            c = this.rankMeNode;
            t.uInfo = t.info;
        } else {
            if (t.rank < 3) {
                c = this.rank1234Nodes[t.rank];
            } else {
                (c = cc.instantiate(this.rank1234Nodes[3])).parent = this.rank1234Nodes[3].parent;
            }
        }
        var o;
        if (t.uInfo.name && "NONAME" != t.uInfo.name) {
            o = t.uInfo.name;
        } else {
            o = "用户" + t.uInfo.uid;
        }
        if (n) {
            cc.find("ranknum", c).getComponent(cc.Label).string = t.rank + 1;
        } else {
            cc.find("ranknum", c).getComponent(cc.Label).string = "无";
        }
        cc.find("name", c).getComponent(cc.Label).string = o;
        cc.find("wavenum", c).getComponent(cc.Label).string = t.uInfo.score + "波";
        var i = cc.find("icon", c).getComponent(cc.Sprite);
        if (t.uInfo.avatarUrl && t.uInfo.avatarUrl.length > 0) {
            cc.assetManager.loadRemote(
                t.uInfo.avatarUrl,
                {
                    ext: ".jpg"
                },
                function (e, t) {
                    var n = new cc.SpriteFrame();
                    n.setTexture(t);
                    i.spriteFrame = n;
                }
            );
        }
        var a = cc.find("box", c).getComponent(cc.Sprite);
        if (n) {
            var r = this.getBoxIDByRank(t.rank);
            cc.pvz.utils.setSpriteFrame(a, "rank", "img/bx" + r);
            a.getComponent(cc.Button).clickEvents[0].customEventData = r;
        } else {
            a.node.active = !1;
        }
        if (n && t.rank < 3) {
            var s = this.top123Nodes[t.rank];
            cc.find("name", s).getComponent(cc.Label).string = o;
            cc.find("wavenum", s).getComponent(cc.Label).string = t.uInfo.score + "波";
            var p;
            if (t.uInfo.exInfo.length > 0) {
                p = t.uInfo.exInfo;
            } else {
                p = "1";
            }
            cc.pvz.utils.useBundleAsset("actors", "kapi/hero" + p, sp.SkeletonData, function (e) {
                var t = cc.find("spine", s).getComponent(sp.Skeleton);
                t.skeletonData = e;
                t.setAnimation(0, "stand1", !0);
            });
            s.active = !0;
        }
        c.active = !0;
    },
    initBy: function (e) {
        var t = this;
        this.uiNode = e;
        this.top123Nodes.forEach(function (e) {
            return (e.active = !1);
        });
        this.rank1234Nodes.forEach(function (e) {
            return (e.active = !1);
        });
        this.emptyTip.active = !0;
        this.boxPopupRoot.active = !1;
        this.pageCount = 0;
        cc.pvz.cloud.rankList(0, function (e, n) {
            if (e && n.length > 0) {
                n.forEach(function (e) {
                    t.fillRankNode(!1, e);
                });
                t.pageCount = 1;
                t.emptyTip.active = !1;
            }
        });
        this.updateMyRank();
    },
    updateMyRank: function () {
        var e = this;
        cc.pvz.cloud.myRank(function (t, n) {
            if (t) {
                if (-1 != n.rank && n.rank < cc.tmpRank) {
                    e.showRankUp(cc.tmpRank + 1, n.rank + 1);
                }
                cc.tmpRank = n.rank;
                cc.tmpScore = n.info.score;
                e.fillRankNode(!0, n);
            }
        });
    },
    showFinish: function () {
        this.uiNode.active = !1;
    },
    onScrollEvent: function (e, t) {
        var n = this;
        if (t != cc.ScrollView.EventType.SCROLL_BEGAN) {
            if (t == cc.ScrollView.EventType.SCROLL_TO_BOTTOM && this.pageCount < 5) {
                if (this.isFetching) {
                    return;
                }
                this.isFetching = !0;
                cc.pvz.cloud.rankList(20 * this.pageCount, function (e, t) {
                    n.isFetching = !1;
                    if (e && t.length > 0) {
                        t.forEach(function (e) {
                            n.fillRankNode(!1, e);
                        });
                        n.pageCount++;
                    }
                });
            }
        } else {
            this.hideBoxPopup();
        }
    },
    showRankUp: function (e, t) {
        var n = this;
        cc.pvz.utils.useBundleAsset("rank", "RankUpEffect", cc.Prefab, function (c) {
            var o = cc.instantiate(c);
            o.getComponent("UIRankUpEffect").initBy(e, t);
            o.parent = n.node;
        });
    },
    onClickClose: function () {
        this.uiNode.active = !0;
        cc.popupManager.removePopup(this);
    },
    onClickAuthorize: function () {
        var e = this;
        cc.popupManager.popup(
            "rank",
            "shouquanUI",
            "UIAuthorize",
            {
                ad: !1,
                scale: !1
            },
            function (t) {
                if (t) {
                    e.updateMyRank();
                }
            }
        );
    },
    onClickShare: function () {
        var e;
        if (cc.tmpRank >= 0) {
            e = "我获得了第" + (cc.tmpRank + 1) + "名，你也来试试吧";
        } else {
            e = "无尽排位赛，你也来试试吧";
        }
        cc.pvz.TAUtils.shareCurrent(e, function () {
            cc.popupManager.showToast("分享成功");
        });
    },
    onClickBox: function (e, t) {
        var n = parseInt(t);
        var c = this.boxJsonFile.json.find(function (e) {
            return e.ID == n;
        });
        cc.find("num1", this.boxPopupRoot).getComponent(cc.Label).string = "x" + c.reward[1];
        cc.find("num2", this.boxPopupRoot).getComponent(cc.Label).string = "x" + c.reward[3];
        var o = e.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var i = this.boxPopupRoot.parent.convertToNodeSpaceAR(o);
        this.boxPopupRoot.position = i;
        this.boxPopupRoot.active = !0;
    },
    onClickBg: function () {
        this.hideBoxPopup();
    },
    hideBoxPopup: function () {
        this.boxPopupRoot.active = !1;
    },
    onClickUpload: function () {
        cc.pvz.cloud.uploadScore(13, function () {});
        cc.pvz.cloud.myRank(function () {});
        cc.pvz.cloud.rankList(0, function () {});
        cc.pvz.cloud.rankList(20, function () {});
    }
});
