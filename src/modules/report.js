import { FIGHT_NAME } from "../apis";

const state = () => ({
  fights: {},
  friendlies: [],
  enemies: [],
  tableEntries: {}
});

const getters = {};

const mutations = {
  setFriendlies(state, protectionWarriors) {
    const protectionsIds = new Set(
      protectionWarriors
        .sort((e1, e2) => e2["total"] - e1["total"])
        .splice(0, 3)
        .map(e => e["id"])
    );
    state.friendlies = state.friendlies.map(f => ({
      ...f,
      type: protectionsIds.has(f["id"]) ? "Tank" : f["type"]
    }));
  },
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
    state.fights[FIGHT_NAME.BEFORE_FOUR] = {
      start_time: state.fights[FIGHT_NAME.THREE].end_time + 1,
      end_time: state.fights[FIGHT_NAME.FOUR].start_time - 1
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
      ...tableEntries.reduce((output, table) => {
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
