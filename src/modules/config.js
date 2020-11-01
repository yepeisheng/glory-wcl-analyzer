import { FIGHT_NAME, TABLE_TYPE, COLUMN } from "../apis";
import Vue from "vue";

const defaultTables = [
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

export const FORMULA_TYPE = {
  RELATIVE_TO_TOP: "to_top",
  RELATIVE_TO_MAX: "to_max",
  RELATIVE_TO_AVG: "to_avg",
  RELATIVE_TO_TOTAL: "to_total",
  UNITARY: "unitary"
};

export const FORMULA_TYPE_TEXT = {
  to_top: "相对于第一名",
  to_max: "相对于预设值",
  to_avg: "相对于平均",
  to_total: "相对于总数",
  unitary: "转换成0或1"
};

const defaultFormulas = [
  {
    displayName: "熟练度",
    edit: false,
    weight: 0.5,
    subGroups: [
      {
        tableId: "DAMAGE",
        weight: 1,
        type: FORMULA_TYPE.RELATIVE_TO_TOP
      },
      {
        tableId: "TEAMMATE-DAMAGE",
        weight: -0.2,
        type: FORMULA_TYPE.RELATIVE_TO_MAX,
        max: 3000
      },
      {
        tableId: "HEALING",
        type: FORMULA_TYPE.RELATIVE_TO_TOP,
        weight: 0.1
      },
      {
        tableId: "SUNDERS",
        weight: 0.3,
        type: FORMULA_TYPE.RELATIVE_TO_TOP
      }
    ]
  },
  {
    displayName: "战术",
    edit: false,
    weight: 0.5,
    subGroups: [
      {
        tableId: "DUMMY-TARGET",
        weight: 0.25,
        type: FORMULA_TYPE.RELATIVE_TO_MAX,
        max: 3
      },
      {
        tableId: "VIS",
        weight: 0.25,
        type: FORMULA_TYPE.RELATIVE_TO_AVG
      },
      {
        tableId: "death-wish-1",
        weight: 0.25,
        type: FORMULA_TYPE.RELATIVE_TO_MAX,
        max: 2
      },
      {
        tableId: "death-wish-2",
        weight: 0.25,
        type: FORMULA_TYPE.RELATIVE_TO_MAX,
        max: 1
      },
      {
        tableId: "death-wish-3",
        weight: 0.25,
        type: FORMULA_TYPE.RELATIVE_TO_MAX,
        max: 1
      },
      {
        tableId: "death-wish-4",
        weight: 0.25,
        type: FORMULA_TYPE.RELATIVE_TO_MAX,
        max: 1
      },
      {
        tableId: "death-wish-5",
        weight: 0.25,
        type: FORMULA_TYPE.RELATIVE_TO_MAX,
        max: 2
      }
    ]
  },
  {
    displayName: "投入",
    edit: false,
    weight: 0.5,
    subGroups: [
      {
        tableId: "WORLD-BUFFS",
        type: FORMULA_TYPE.RELATIVE_TO_MAX,
        max: 6,
        weight: 1
      },
      {
        tableId: "petrification",
        type: FORMULA_TYPE.RELATIVE_TO_TOP,
        weight: 1
      },
      {
        tableId: "poison",
        type: FORMULA_TYPE.RELATIVE_TO_AVG,
        weight: 1
      }
    ]
  }
];

const state = () => ({
  tables: localStorage.getItem("gloryWCLSetting-tables")
    ? JSON.parse(localStorage.getItem("gloryWCLSetting-tables"))
    : defaultTables.slice(),
  formulas: localStorage.getItem("gloryWCLSetting-formulas")
    ? JSON.parse(localStorage.getItem("gloryWCLSetting-formulas"))
    : defaultFormulas.slice()
});

const getters = {};

const actions = {};

const mutations = {
  updateTable(state, table) {
    const oldTableIndex = state.tables.findIndex(t => t.id === table.id);
    Vue.set(state.tables, oldTableIndex, table);
    localStorage.setItem(
      "gloryWCLSetting-tables",
      JSON.stringify(state.tables)
    );
  },
  insertTable(state, table) {
    state.tables.push(table);
    localStorage.setItem(
      "gloryWCLSetting-tables",
      JSON.stringify(state.tables)
    );
  },
  deleteTable(state, tableId) {
    const oldTableIndex = state.tables.findIndex(t => t.id === tableId);
    state.tables.splice(oldTableIndex, 1);
    localStorage.setItem(
      "gloryWCLSetting-tables",
      JSON.stringify(state.tables)
    );
  },
  resetTable(state) {
    state.tables = defaultTables.slice();
    localStorage.setItem(
      "gloryWCLSetting-tables",
      JSON.stringify(state.tables)
    );
  },
  insertFormula(state, formula) {
    state.formulas.unshift(formula);
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.formulas)
    );
  },
  deleteFormula(state, formulaIdx) {
    state.formulas.splice(formulaIdx, 1);
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.formulas)
    );
  },
  resetFormula(state) {
    state.formulas = defaultFormulas.slice();
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.formulas)
    );
  },
  insertSubgroup(state, { formulaIdx, newSubgroup }) {
    console.log(formulaIdx)
    state.formulas[formulaIdx].subGroups.unshift(newSubgroup);
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.formulas)
    );
  },
  updateSubgroup(state, { formulaIdx, subgroupIdx, subgroup }) {
    Vue.set(state.formulas[formulaIdx].subGroups, subgroupIdx, subgroup);
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.formulas)
    );
  },
  deleteSubgroup(state, { formulaIdx, subgroupIdx }) {
    state.formulas[formulaIdx].subGroups.splice(subgroupIdx, 1);
    localStorage.setItem("gloryWCLSetting-formulas", state.formulas.slice());
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
