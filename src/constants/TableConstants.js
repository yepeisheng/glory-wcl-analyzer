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
    id: "27-BUGS",
    predefined: true,
    displayName: "27虫",
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.BEFORE_THREE,
    column: COLUMN.TOTAL,
    abilityIds: [1161, 3169],
    customQuery: ""
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
    tableName: TABLE_TYPE.CASTS,
    fights: FIGHT_NAME.BEFORE_SIX,
    column: COLUMN.TOTAL,
    abilityIds: [6615],
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
    displayName: "全程自疗",
    tableName: TABLE_TYPE.HEALING,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.TOTAL,
    abilityIds: [],
    customQuery: ""
  },
  {
    id: "WORLD-BUFFS",
    predefined: true,
    displayName: "世界BUFFS",
    tableName: TABLE_TYPE.BUFFS,
    fights: FIGHT_NAME.OVERALL,
    column: COLUMN.BUFF_TOTAL,
    abilityIds: [15366, 22888, 22818, 24425, 22817, 16609],
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
