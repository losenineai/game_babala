var o = {
    ItemType: cc.Enum({
        银币: 1,
        金币: 2,
        钻石: 3,
        体力: 4,
        随机绿色碎片: 5,
        随机蓝色碎片: 6,
        随机紫色碎片: 7,
        固定碎片: 8,
        荣誉: 9,
        日常任务积分: 50,
        周常任务积分: 51
    }),
    AdType: cc.Enum({
        体力购买: 0,
        商店钻石: 1,
        商店金币: 2,
        商店宝箱: 3,
        商店刷新: 4,
        关卡扫荡: 5,
        关卡结算: 6,
        双倍速度: 7,
        广告格子: 8,
        死亡复活: 9,
        道具不足: 10,
        额外挑战: 11,
        试用植物: 12,
        刷新2级: 13,
        阳光: 14,
        buff刷新: 15,
        buff全部: 16,
        双倍签到: 17,
        基金: 18,
        刷新广告格子: 19,
        无尽火力: 20
    }),
    UIFromType: cc.Enum({
        主界面: 0,
        关卡宝箱: 1,
        每日商店: 2,
        金币商店: 3,
        宝箱商店: 4,
        挑战副本: 5,
        道具不足: 6,
        签到: 7,
        分享奖励: 8,
        成就: 9,
        日常任务: 10,
        周常任务: 11,
        基金: 12,
        抓球球: 13,
        排位赛: 14
    }),
    MissionType: cc.Enum({
        登录1次: 1,
        挑战主线章节1次: 2,
        升级任意装备1次: 3,
        每日商店购买n次物品: 4,
        高级宝箱抽取装备n次: 5,
        扫荡关卡n次: 6,
        参与挑战关卡n次: 7,
        购买体力n次: 8,
        观看广告n次: 9,
        通关主线副本n次: 10,
        击败僵尸n个: 11,
        击败首领n个: 12,
        通关挑战关卡n次: 13,
        通过主线章节n: 14,
        装备最高等级达到n: 15,
        装备总等级n: 16,
        累计获得金币: 17,
        累计消耗钻石: 18,
        参与无尽挑战赛N次: 19
    }),
    ActType: cc.Enum({
        挑战副本: 0
    }),
    RewardData: cc.Class({
        name: "RewardData",
        properties: {
            itemId: cc.Integer,
            count: cc.Integer,
            toolId: cc.Integer
        }
    }),
    MaxPower: 20,
    CdPowerTime: 720,
    PowerBuyTip: "今日剩余$次",
    LevelFinishTip: "已通关",
    LevelMaxWaveTip: "最高记录：第$波",
    LevelLockTip: "通关第$章后解锁",
    LevelBoxTip: "第$波",
    MaxLevel: 30,
    BattlePower: 5,
    PowerBuyPrices: [30, 30, 30],
    MaxToolCount: 12,
    ToolLockLevel: [0, 0, 0, 0, 0, 0, 2, 3, 4, 5, 6, 7],
    Quality2Tools: [1, 2, 3, 8],
    Quality3Tools: [4, 5, 6, 10],
    Quality4Tools: [7, 9, 11, 12],
    MaxToolLv: 16,
    ToolAttriNameList: ["目标", "冷却", "攻击", "射程", "血量", "叠甲", "回血", "钱币", "叠甲", "充能"],
    ToolLockTip: "通关关卡$解锁",
    ToolSkinTip: "合成$阶",
    ShopTimesType: cc.Enum({
        商店刷新: 0,
        钻石免费: 1,
        金币免费: 2
    }),
    ShopBoxCD: [3600, 86400],
    ShopBoxPrice: [30, 200],
    BoxTipNames: [
        "<outline color=black width=2.5><color=#0FFF00>普通</outline>",
        "<outline color=black width=2.5><color=#00D1FF>高级</outline>",
        "<outline color=black width=2.5><color=#FF33F3>稀有</outline>"
    ],
    MaxActLevelScore: 1e4,
    MaxShareTimes: 10,
    AdBuyTooldCounts: [50, 10, 1],
    ShareTitileList: ["卡皮巴拉~~go go go！"],
    ShareIDList: ["aaM7i9PiSKuTLDzHg66UYg=="],
    ShareUrlList: [
        "https://mmocgame.qpic.cn/wechatgame/C7yIVibiba7k6HgAJffl3XSadxOJ0cMLaXbbVyTcliavyxyM9OmxmLghQ3mNGUV1S1s/0"
    ],
    OpenSysLv: [8, 4],
    ArrayPlaceOpLv: [2, 4]
};
if (cc.pvz) {
    //
} else {
    cc.pvz = {};
}
cc.pvz.GameConfig = o;
module.exports = o;
