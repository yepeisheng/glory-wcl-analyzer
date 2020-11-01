import { fetchTable, summaryEntries, FIGHT_NAME } from "../apis";

const state = () => ({
  fights: {},
  friendlies: [],
  enemies: [],
  tableEntries: {}
});

const getters = {};

const mutations = {
  setReport(state, report) {
    state.friendlies = [];
    state.fights = {};
    for (let i = 0; i < report.friendlies.length; i++) {
      const f = report.friendlies[i];
      state.friendlies[f.id] = f;
    }
    state.fights[FIGHT_NAME.OVERALL] = {
      start_time: report.fights[0]["start_time"],
      end_time: report.fights[report.fights.length - 1]["end_time"]
    };
    const fightNames = new Set(Object.values(FIGHT_NAME));
    report.fights.forEach(fight => {
      const name = fightNames.has(fight.name)
        ? fight.name
        : `${fight.name}-${fight.id}`;
      state.fights[name] = fight;
    });
    state.fights[FIGHT_NAME.BEFORE_ONE] = {
      start_time: state.fights[FIGHT_NAME.OVERALL].start_time + 1,
      end_time: state.fights[FIGHT_NAME.ONE].start_time - 1
    };
    state.fights[FIGHT_NAME.BEFORE_TWO] = {
      start_time: state.fights[FIGHT_NAME.ONE].end_time + 1,
      end_time: state.fights[FIGHT_NAME.TWO].start_time - 1
    };
    state.fights[FIGHT_NAME.BEFORE_THREE] = {
      start_time: state.fights[FIGHT_NAME.TWO].end_time + 1,
      end_time: state.fights[FIGHT_NAME.THREE].start_time - 1
    };
    state.fights[FIGHT_NAME.BEFORE_SIX] = {
      start_time: state.fights[FIGHT_NAME.FIVE].end_time + 1,
      end_time: state.fights[FIGHT_NAME.SIX].start_time - 1
    };
    state.fights[FIGHT_NAME.BEFORE_SEVEN] = {
      start_time: state.fights[FIGHT_NAME.SIX].end_time + 1,
      end_time: state.fights[FIGHT_NAME.SEVEN].start_time - 1
    };
    state.fights[FIGHT_NAME.BEFORE_EIGHT] = {
      start_time: state.fights[FIGHT_NAME.SEVEN].end_time + 1,
      end_time: state.fights[FIGHT_NAME.EIGHT].start_time - 1
    };
  },
  setTableEntries(state, tableEntries) {
    state.tableEntries = {
      ...state.tableEntries,
      ...tableEntries
        .map(table => {
          const filteredEntries = table.entries.filter(
            e => e.type === "Warrior"
          );
          filteredEntries.sort((e1, e2) => e2.total - e1.total);
          return {
            ...table,
            entries: filteredEntries,
            TOP: filteredEntries
              .map(e => e.total)
              .reduce((e1, e2) => (e2 > e1 ? e2 : e1), 0),
            AVG:
              filteredEntries.map(e => e.total).reduce((e1, e2) => e1 + e2, 0) /
              table.entries.length,
            TOTAL: filteredEntries
              .map(e => e.total)
              .reduce((e1, e2) => e1 + e2, 0)
          };
        })
        .reduce((output, table) => {
          output[table.tableId] = table;
          return output;
        }, {})
    };
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
