import { COLUMN, FIGHT_NAME, TABLE_TYPE } from "../apis";

export const defaultTables = [
  {
    id: "DAMAGE",
    predefined: true,
    displayName: "全程伤害",
    tableName: TABLE_TYPE.DAMAGE,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [],
    customQuery: ""
  },
  {
    id: "TEAMMATE-DAMAGE",
    predefined: true,
    displayName: "队友误伤",
    tableName: TABLE_TYPE.DAMAGE_TAKEN,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [],
    customQuery: "hostility=1&sourceclass=Player&target=Player&by=target"
  },
  {
    id: "27-BUGS-WARRIOR",
    predefined: true,
    displayName: "27虫群嘲无敌",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.BEFORE_THREE,
    column: COLUMN.TOTAL,
    abilityIds: [1161, 3169],
    customQuery: ""
  },
  {
    id: "27-BUGS-MAGE",
    predefined: true,
    displayName: "27虫法师无敌",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.BEFORE_THREE,
    column: COLUMN.TOTAL,
    abilityIds: [3169],
    customQuery: ""
  },
  {
    id: "DETECT-MAGIC",
    predefined: true,
    displayName: "门口魔法侦测",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.BEFORE_ONE,
    column: COLUMN.TOTAL,
    abilityIds: [2855],
    customQuery: ""
  },
  {
    id: "27-BUGS-NAIL",
    predefined: true,
    displayName: "通道钉子",
    tableName: TABLE_TYPE.DAMAGE,
    fights: FIGHT_NAME.BEFORE_THREE,
    column: COLUMN.TOTAL,
    abilityIds: [17669]
  },
  {
    id: "BEE-ROOM-NAIL",
    predefined: true,
    displayName: "蜜蜂房钉子",
    tableName: TABLE_TYPE.DAMAGE,
    fights: FIGHT_NAME.BEFORE_SIX,
    column: COLUMN.TOTAL,
    abilityIds: [17669]
  },
  {
    id: "BOOM-BOX",
    predefined: true,
    displayName: "地精炸弹箱",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [23134]
  },
  {
    id: "AOE-TOTEM",
    predefined: true,
    displayName: "萨满AOE图腾",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [11315, 10587]
  },
  {
    id: "EARTH-TOTEM",
    predefined: true,
    displayName: "萨满大地战栗图腾",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [25361, 8143]
  },
  {
    id: "WIND-TOTEM",
    predefined: true,
    displayName: "萨满风怒图腾",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [10614, 25359]
  },
  {
    id: "BOSS-ONE-TOTEM",
    predefined: true,
    displayName: "老1根基图腾",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.ONE,
    column: COLUMN.TOTAL,
    abilityIds: [8177]
  },
  {
    id: "BEFORE-TWO-TOTEM",
    predefined: true,
    displayName: "三宝前根基图腾",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.BEFORE_TWO,
    column: COLUMN.TOTAL,
    abilityIds: [8177]
  },
  {
    id: "VIS-FROST-SHOCK",
    predefined: true,
    displayName: "小软冰霜震击",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.FIVE,
    column: COLUMN.TOTAL,
    abilityIds: [8056]
  },
  {
    id: "TRAP-ROOM-ACCELERATE",
    predefined: true,
    displayName: "陷阱房加速",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.BEFORE_FOUR,
    column: COLUMN.TOTAL,
    abilityIds: [9175, 14530],
    customQuery: ""
  },
  {
    id: "BEE-ROOM-POTION",
    predefined: true,
    displayName: "蜜蜂房自由",
    tableName: TABLE_TYPE.BUFFS,
    fights: FIGHT_NAME.BEFORE_SIX,
    column: COLUMN.BUFF_TOTAL,
    abilityIds: [6615],
    customQuery: ""
  },
  {
    id: "MANA-POISON",
    predefined: true,
    displayName: "全程大蓝符文",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [16666, 17531, 27869],
    customQuery: ""
  },
  {
    id: "DAMAGE-TAKEN",
    predefined: true,
    displayName: "全程承伤",
    tableName: TABLE_TYPE.DAMAGE_TAKEN,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [],
    customQuery: ""
  },
  {
    id: "HEALING",
    predefined: true,
    displayName: "全程治疗",
    tableName: TABLE_TYPE.HEALING,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [],
    customQuery: ""
  },
  {
    id: "CTHUN-HEALING",
    predefined: true,
    displayName: "克苏恩治疗",
    tableName: TABLE_TYPE.HEALING,
    fights: FIGHT_NAME.NINE,
    column: COLUMN.TOTAL,
    abilityIds: [],
    customQuery: ""
  },
  {
    id: "WORLD-BUFFS-MELEE",
    predefined: true,
    displayName: "世界BUFFS",
    tableName: TABLE_TYPE.BUFFS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.BUFF_TOTAL,
    abilityIds: [15366, 22888, 22818, 24425, 22817, 16609],
    customQuery: ""
  },
  {
    id: "WORLD-BUFFS-RANGE",
    predefined: true,
    displayName: "世界BUFFS",
    tableName: TABLE_TYPE.BUFFS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.BUFF_TOTAL,
    abilityIds: [15366, 22888, 22818, 24425, 22820, 16609],
    customQuery: ""
  },
  {
    id: "TRUE-SHOT-AURA",
    predefined: true,
    displayName: "强击光环",
    tableName: TABLE_TYPE.BUFFS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.BUFF_TOTAL,
    abilityIds: [20906]
  },
  {
    id: "DUMMY-TARGET",
    predefined: true,
    displayName: "高级活动假人",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [19805],
    customQuery: ""
  },
  {
    id: "SUNDERS",
    predefined: true,
    displayName: "破甲",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [11597],
    customQuery: ""
  },
  {
    id: "VIS",
    predefined: true,
    displayName: "维希度斯冰箭",
    tableName: TABLE_TYPE.DAMAGE,
    fights: FIGHT_NAME.FIVE,
    column: COLUMN.HIT,
    abilityIds: [13439, 205],
    customQuery: ""
  },
  {
    id: "petrification",
    predefined: true,
    displayName: "化石",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [17624],
    customQuery: ""
  },
  {
    id: "poison",
    predefined: true,
    displayName: "抗毒药剂",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [26677],
    customQuery: ""
  },
  {
    id: "death-wish-1",
    predefined: true,
    displayName: "老1前死愿+鲁莽",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.BEFORE_ONE,
    column: COLUMN.TOTAL,
    abilityIds: [12328, -1719],
    customQuery: ""
  },
  {
    id: "death-wish-2",
    predefined: true,
    displayName: "三宝前死愿",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.BEFORE_TWO,
    column: COLUMN.TOTAL,
    abilityIds: [12328],
    customQuery: ""
  },
  {
    id: "death-wish-3",
    predefined: true,
    displayName: "沙尔图拉死愿",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.THREE,
    column: COLUMN.TOTAL,
    abilityIds: [12328],
    customQuery: ""
  },
  {
    id: "death-wish-4",
    predefined: true,
    displayName: "哈霍兰死愿",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.SIX,
    column: COLUMN.TOTAL,
    abilityIds: [12328],
    customQuery: ""
  },
  {
    id: "death-wish-5",
    predefined: true,
    displayName: "奥罗死愿鲁莽",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.EIGHT,
    column: COLUMN.TOTAL,
    abilityIds: [12328, -1719],
    customQuery: ""
  },
  {
    id: "holy-nova",
    predefined: true,
    displayName: "全程神圣新星",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [27801],
    customQuery: ""
  },
  {
    id: "vis-shoot",
    predefined: true,
    displayName: "维希度斯魔杖",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.FIVE,
    column: COLUMN.TOTAL,
    abilityIds: [5019],
    customQuery: ""
  },
  {
    id: "DAMAGE-MIND-SLAYER",
    predefined: true,
    displayName: "战灵者伤害",
    tableName: TABLE_TYPE.DAMAGE,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [],
    customQuery: "target=209"
  },
  {
    id: "DAMAGE-CHAMPION",
    predefined: true,
    displayName: "勇士伤害",
    tableName: TABLE_TYPE.DAMAGE,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [],
    customQuery: "target=213"
  },
  {
    id: "VIS-ICY-BOLT",
    predefined: true,
    displayName: "小软冰箭",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.FIVE,
    column: COLUMN.TOTAL,
    abilityIds: [116]
  },
  {
    id: "FAERIE-FIRE",
    predefined: true,
    displayName: "精灵之火",
    tableName: TABLE_TYPE.DEBUFFS,
    fights: FIGHT_NAME.OVERALL,
    abilityIds: [9907],
    column: COLUMN.BUFF_UPTIME,
    customQuery: "hostility=1"
  },
  {
    id: "WARLOCK-CURSE",
    predefined: true,
    displayName: "术士诅咒",
    tableName: TABLE_TYPE.DEBUFFS,
    fights: FIGHT_NAME.OVERALL,
    abilityIds: [11717, 11722, 11708],
    column: COLUMN.BUFF_UPTIME,
    customQuery: "hostility=1"
  },
  {
    id: "IMPROVED-EXPOSE-ARMOR",
    predefined: true,
    displayName: "盗贼破甲",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [11198]
  }
];

export function filterEntriesById(tables, ids) {
  return Object.values(tables)
    .map(table => ({
      ...table,
      entries: table.entries.filter(e => ids.has(e.id))
    }))
    .reduce((output, table) => {
      output[table.tableId] = table;
      return output;
    }, {});
}
