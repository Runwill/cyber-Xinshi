// 应用版本配置
const APP_VERSION = "v0.5.1.250724";
const APP_NAME = "本穴世界";

// 身份字典 - 键名为身份名，值包含阵营信息、计数器配置和结算优先级
const charactersDict = {
    "赵昀": { faction: "南宋", class: "song" },
    "谢道清": { faction: "南宋", class: "song" },
    "史弥远": { faction: "南宋", class: "song" },
    "郑清之": { faction: "南宋", class: "song" },
    "史嵩之": { faction: "南宋", class: "song", settlements: [{ priority: 4, text: "史嵩之对一名玩家发动技能", nightRestriction: "any" }] },
    "贾似道": { faction: "南宋", class: "song", settlements: [{ priority: 5, text: "贾似道得知一个在场的武将身份和两名玩家", nightRestriction: "firstNight" }, { priority: 5, text: "贾似道打算两名玩家", nightRestriction: "any" }] },
    "魏了翁": { faction: "南宋", class: "song", settlements: [{ priority: 10, text: "魏了翁得知在场的一个身份", nightRestriction: "firstNight" }, { priority: 10, text: "魏了翁猜测玩家，若正确，得知另一个身份", nightRestriction: "notFirstNight" }] },
    "刘克庄": { faction: "南宋", class: "song", settlements: [{ priority: 10, text: "刘克庄得知白天被票出玩家的阵营（受蒲察官奴技能影响）", nightRestriction: "notFirstNight" }] },
    "吴潜": { faction: "南宋", class: "song", settlements: [{ priority: 10, text: "吴潜得知最近的存活玩家中是否有蒙古人", nightRestriction: "any" }] },
    "杜范": { faction: "南宋", class: "song", settlements: [{ priority: 10, text: "杜范", nightRestriction: "any" }] },
    "叶适": { faction: "南宋", class: "song", settlements: [{ priority: 10, text: "叶适查验一名玩家，得知是否是蒙古人", nightRestriction: "any" }] },
    "谢方叔": { faction: "南宋", class: "song", settlements: [{ priority: 10, text: "谢方叔", nightRestriction: "any" }] },
    "陈宜中": { faction: "南宋", class: "song" },
    "宋慈": { faction: "南宋", class: "song" },
    "文天祥": { faction: "南宋", class: "song" },
    "秦九韶": { faction: "南宋", class: "song", settlements: [{ priority: 10, text: "秦九韶得知开局时的文官武将数", nightRestriction: "firstNight" }, { priority: 10, text: "秦九韶得知入夜时的文官武将数", nightRestriction: "notFirstNight" }] },
    "高稼": { faction: "南宋", class: "song", settlements: [{ priority: 10, text: "高稼保护一名玩家", nightRestriction: "any" }] },
    "丁大全": { faction: "南宋", class: "song", settlements: [{ priority: 10, text: "丁大全对一名玩家发动技能", nightRestriction: "any" }] },
    "孟珙（荆阃）": { faction: "南宋", class: "song", counters: [-10, 5, 8], settlements: [{ priority: 6, text: "孟珙", nightRestriction: "any" }] },
    "赵葵（淮阃）": { faction: "南宋", class: "song", counters: [-8, 5, 8], settlements: [{ priority: 10, text: "赵葵", nightRestriction: "any" }] },
    "余玠（蜀阃）": { faction: "南宋", class: "song", counters: [-8, 5, 8], settlements: [{ priority: 10, text: "余玠", nightRestriction: "any" }] },
    "吕文德（荆阃）": { faction: "南宋", class: "song", counters: [-5, 5, 8], settlements: [{ priority: 10, text: "吕文德", nightRestriction: "any" }] },
    "陈韡（江阃）": { faction: "南宋", class: "song", counters: [-15, 5, 8], settlements: [{ priority: 13, text: "陈韡治疗一名玩家", nightRestriction: "firstNight" }, { priority: 13, text: "陈韡治疗一名其他玩家", nightRestriction: "notFirstNight" }] },
    "贾涉（淮阃）": { faction: "南宋", class: "song", counters: [-5, 5, 8] },
    "安丙（蜀阃）": { faction: "南宋", class: "song", counters: [-15, 5, 8], settlements: [{ priority: 12, text: "安丙", nightRestriction: "any" }] },
    "李曾伯（桂阃）": { faction: "南宋", class: "song", counters: [-8, 5, 8], settlements: [{ priority: 10, text: "李曾伯", nightRestriction: "any" }] },
    "李庭芝（淮阃）": { faction: "南宋", class: "song", counters: [-10, 5, 8], settlements: [{ priority: 7, text: "李庭芝", nightRestriction: "any" }] },
    "杨文（蜀阃）": { faction: "南宋", class: "song", counters: [-7, -5, -3, 5, 8], settlements: [{ priority: 8, text: "杨文", nightRestriction: "any" }] },
    "马光祖（江阃）": { faction: "南宋", class: "song", counters: [-8, 5, 8] },
    "张世杰（江阃）": { faction: "南宋", class: "song", settlements: [{ priority: 0, text: "张世杰得知张弘范位置", nightRestriction: "firstNight" }, { priority: 10, text: "张世杰屯田", nightRestriction: "any" }] },
    "夏贵（淮阃）": { faction: "南宋", class: "song", counters: [-10, 5, 8], settlements: [{ priority: 10, text: "夏贵", nightRestriction: "any" }] },
    "赵彦呐（蜀阃）": { faction: "南宋", class: "song", counters: [-8, 5, 8], settlements: [{ priority: 10, text: "赵彦呐", nightRestriction: "any" }] },
    "吕文焕（荆阃）": { faction: "南宋", class: "song", counters: [-10, 5, 8], settlements: [{ priority: 10, text: "吕文焕", nightRestriction: "any" }] },
    "完颜守绪": { faction: "外来者", class: "outsider" },
    "蒲察官奴": { faction: "外来者", class: "outsider" },
    "张天纲": { faction: "外来者", class: "outsider", settlements: [{ priority: 10, text: "张天纲追随一名其他玩家", nightRestriction: "any" }] },
    "武仙": { faction: "外来者", class: "outsider" },
    "李遵顼": { faction: "外来者", class: "outsider", settlements: [{ priority: 10, text: "李遵顼选择一名其他玩家", nightRestriction: "firstNight" }] },
    "高泰祥": { faction: "外来者", class: "outsider" },
    "蒲寿庚": { faction: "外来者", class: "outsider", counters: [-5, 5], settlements: [{ priority: 11, text: "蒲寿庚贪污", nightRestriction: "any" }] },
    "窝阔台": { faction: "蒙古", class: "mongolia", counters: [-3], settlements: [{ priority: 14, text: "窝阔台劫掠", nightRestriction: "notFirstNight" }] },
    "拖雷": { faction: "蒙古", class: "mongolia", counters: [-3], settlements: [{ priority: 14, text: "拖雷劫掠", nightRestriction: "notFirstNight" }] },
    "蒙哥": { faction: "蒙古", class: "mongolia" },
    "忽必烈": { faction: "蒙古", class: "mongolia", settlements: [{ priority: 3, text: "忽必烈议和一名玩家", nightRestriction: "any" }] },
    "伯颜": { faction: "蒙古", class: "mongolia", settlements: [{ priority: 11, text: "伯颜劝降", nightRestriction: "any" }] },
    "刘秉忠": { faction: "蒙古", class: "mongolia" },
    "塔察儿": { faction: "蒙古", class: "mongolia", settlements: [{ priority: 11, text: "塔察儿查验一名玩家", nightRestriction: "any" }] },
    "八思巴": { faction: "蒙古", class: "mongolia", settlements: [{ priority: 11, text: "八思巴对一名蒙古人发动技能", nightRestriction: "any" }] },
    "刘整": { faction: "蒙古", class: "mongolia", settlements: [{ priority: 11, text: "刘整得知最新的蒙古人位置", nightRestriction: "any" }] },
    "旭烈兀": { faction: "蒙古", class: "mongolia", settlements: [{ priority: 11, text: "旭烈兀西征", nightRestriction: "any" }] },
    "兀良合台": { faction: "蒙古", class: "mongolia", settlements: [{ priority: 11, text: "兀良合台斡腹", nightRestriction: "notFirstNight" }] },
    "张弘范": { faction: "蒙古", class: "mongolia", settlements: [{ priority: 0, text: "张弘范得知张世杰位置", nightRestriction: "firstNight" }] },
    "郝经": { faction: "蒙古", class: "mongolia"},
    "阔端": { faction: "蒙古", class: "mongolia", counters: [-1, -2, -3, -4, -5, -6], settlements: [{ priority: 9, text: "阔端投骰子", nightRestriction: "any" }, { priority: 14, text: "阔端劫掠", nightRestriction: "any" }] },
    "耶律楚材": { faction: "蒙古", class: "mongolia", settlements: [{ priority: 11, text: "耶律楚材询问一个身份，得知是否在场", nightRestriction: "any" }] },
    "李全": { faction: "第三方", class: "third", settlements: [{ priority: 1, text: "李全选择杨妙真", nightRestriction: "firstNight" }] },
    "范文虎": { faction: "第三方", class: "third" },
    "李璮": { faction: "第三方", class: "third", settlements: [{ priority: 10, text: "李璮寻兵两名其他玩家", nightRestriction: "firstNight" }, { priority: 10, text: "李璮寻兵一名玩家", nightRestriction: "notFirstNight" }] },
    "国用安": { faction: "第三方", class: "third" },
    "汪世显": { faction: "第三方", class: "third" },
    "丘处机": { faction: "第三方", class: "third" },
    "杨琏真迦": { faction: "第三方", class: "third", settlements: [{ priority: 2, text: "杨琏真迦盗墓一名其他玩家", nightRestriction: "firstNight" }] }
};

// 生成nameGroups的函数
function generateNameGroups(charactersDict) {
    const factions = {};
    
    // 按阵营分组
    for (const [characterName, characterInfo] of Object.entries(charactersDict)) {
        const faction = characterInfo.faction;
        if (!factions[faction]) {
            factions[faction] = {
                title: faction,
                class: characterInfo.class,
                names: []
            };
        }
        factions[faction].names.push(characterName);
    }
    
    // 按指定顺序返回阵营数组
    const factionOrder = ["南宋", "外来者", "蒙古", "第三方"];
    return factionOrder.map(faction => factions[faction]).filter(Boolean);
}

// 从字典中生成nameGroups
const nameGroups = generateNameGroups(charactersDict);

// 合并所有角色名用于初始化
const nameList = Object.keys(charactersDict);

// 从字典中生成身份计数字典
const roleCounterDict = {};
for (const [characterName, characterInfo] of Object.entries(charactersDict)) {
    if (characterInfo.counters) {
        roleCounterDict[characterName] = characterInfo.counters;
    }
}

// 从身份字典生成结算优先级列表
function generateSettlementPriority(charactersDict) {
    const priorityMap = new Map();
    
    // 收集所有角色的结算优先级、文本和夜晚限制
    for (const [characterName, characterInfo] of Object.entries(charactersDict)) {
        if (characterInfo.settlements) {
            for (const settlement of characterInfo.settlements) {
                const priority = settlement.priority;
                if (!priorityMap.has(priority)) {
                    priorityMap.set(priority, []);
                }
                priorityMap.get(priority).push({
                    character: characterName,
                    text: settlement.text,
                    nightRestriction: settlement.nightRestriction || "any"
                });
            }
        }
    }
    
    // 在优先级5中始终添加"蒙古刀人"结算
    if (!priorityMap.has(10)) {
        priorityMap.set(10, []);
    }
    priorityMap.get(10).push({
        character: "蒙古刀人",
        text: "蒙古刀人",
        nightRestriction: "any",
        isFixedSettlement: true // 标记为固定结算项
    });
    
    // 按优先级数值排序并返回数组
    const sortedPriorities = Array.from(priorityMap.keys()).sort((a, b) => a - b);
    return sortedPriorities.map(priority => priorityMap.get(priority));
}

// 生成结算优先级列表，每个子数组表示同一优先级的角色
const settlementPriority = generateSettlementPriority(charactersDict);
