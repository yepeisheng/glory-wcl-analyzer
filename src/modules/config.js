import Vue from "vue";
import { defaultFormulas } from "../constants/FormulaConstants";
import { defaultTables } from "../constants/TableConstants";

const state = () => ({
  tables: localStorage.getItem("gloryWCLSetting-tables")
    ? JSON.parse(localStorage.getItem("gloryWCLSetting-tables"))
    : defaultTables.slice(),
  allFormulas: localStorage.getItem("gloryWCLSetting-formulas")
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
  insertFormula(state, { classType, formula }) {
    state.allFormulas
      .find(f => f.classType === classType)
      ["formulas"].unshift(formula);
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.allFormulas)
    );
  },
  deleteFormula(state, { classType, formulaIdx }) {
    state.allFormulas
      .find(f => f.classType === classType)
      ["formulas"].splice(formulaIdx, 1);
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.allFormulas)
    );
  },
  resetFormula(state) {
    state.allFormulas = defaultFormulas.slice();
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.allFormulas)
    );
  },
  insertSubgroup(state, { classType, formulaIdx, newSubgroup }) {
    state.allFormulas
      .find(f => f.classType === classType)
      ["formulas"][formulaIdx].subGroups.unshift(newSubgroup);
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.allFormulas)
    );
  },
  updateSubgroup(state, { classType, formulaIdx, subgroupIdx, subgroup }) {
    Vue.set(
      state.allFormulas.find(f => f.classType === classType)["formulas"][
        formulaIdx
      ].subGroups,
      subgroupIdx,
      subgroup
    );
    localStorage.setItem(
      "gloryWCLSetting-formulas",
      JSON.stringify(state.allFormulas)
    );
  },
  deleteSubgroup(state, { classType, formulaIdx, subgroupIdx }) {
    state.allFormulas
      .find(f => f.classType === classType)
      ["formulas"][formulaIdx].subGroups.splice(subgroupIdx, 1);
    localStorage.setItem("gloryWCLSetting-formulas", state.allFormulas);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
