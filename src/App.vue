<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="openSetting = !openSetting">
        <v-icon>mdi-settings-box</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-dialog v-model="openTable" max-width="1000">
          <wcl-table :table="table"></wcl-table>
        </v-dialog>
        <v-slide-y-transition>
          <setting v-show="openSetting"></setting>
        </v-slide-y-transition>
        <v-row v-show="!openSetting">
          <v-col class="col-5 offset-3">
            <v-text-field
              v-model="reportId"
              :loading="loading"
              :disabled="loading"
              label="wcl report id"
            ></v-text-field>
          </v-col>
          <v-col align-self="center">
            <v-btn :disabled="loading" @click="fetchReport">Fetch</v-btn>
          </v-col>
        </v-row>
        <v-row v-show="!openSetting">
          <v-col class="col-6 offset-3">
            <score-table
              :scores="scores"
              @openTable="openTablePanel"
            ></score-table>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer app>
      {{ footer }}
    </v-footer>
  </v-app>
</template>

<script>
import {
  VAppBar,
  VSpacer,
  VToolbarTitle,
  VSlideYTransition,
  VContainer,
  VMain,
  VFooter,
  VTextField,
  VBtn,
  VIcon
} from "vuetify/lib";
import { mapState, mapMutations } from "vuex";
import {
  fetchReport,
  fetchTable,
  summaryEntries,
  summaryForWorldBuffs
} from "./apis";
import { FORMULA_TYPE } from "./modules/config";
import Setting from "./Setting";
import ScoreTable from "./ScoreTable";
import WclTable from "./WclTable";

export default {
  name: "App",
  components: {
    ScoreTable,
    VAppBar,
    VSpacer,
    VSlideYTransition,
    VToolbarTitle,
    VContainer,
    VMain,
    VFooter,
    VTextField,
    VBtn,
    Setting,
    WclTable,
    VIcon
  },
  data: () => {
    return {
      openSetting: false,
      openTable: false,
      table: {},
      loading: false,
      title: "Classic WCL Analyzer",
      footer: "Powered by To God be the Glory",
      reportId: "apz2cHtjXKBvYR8r",
      scores: []
    };
  },
  computed: {
    ...mapState("config", ["tables", "formulas"]),
    ...mapState("report", ["friendlies", "fights", "tableEntries"])
  },
  watch: {},
  methods: {
    ...mapMutations("report", ["setReport", "setTableEntries"]),
    openTablePanel(tableId) {
      this.openTable = true;
      this.table = this.tableEntries[tableId];
    },
    async fetchReport() {
      this.loading = true;
      const report = await fetchReport(this.reportId);
      this.setReport(report);
      const tableSet = new Set(
        [].concat(...this.formulas.map(g => g.subGroups)).map(sb => sb.tableId)
      );
      await this.fetchTables(Array.from(tableSet));
      await this.calcScores(
        this.friendlies.filter(f => f.type === "Warrior"),
        this.tableEntries
      );
      this.loading = false;
    },
    async fetchTables(tableIds) {
      const tableEntries = await Promise.all(
        tableIds.map(async tableId => {
          const table = this.tables.find(t => t.id === tableId);
          const fight = this.fights[table.fights];
          if (table.abilityIds.length > 0) {
            const allData = await Promise.all(
              table.abilityIds.map(abilityId =>
                fetchTable(
                  this.reportId,
                  table.tableName,
                  fight["start_time"],
                  fight["end_time"],
                  table.column,
                  { abilityId, customQuery: table.customQuery }
                )
              )
            );
            return {
              tableId,
              tableName: table.displayName,
              entries:
                tableId === "WORLD-BUFFS"
                  ? summaryForWorldBuffs(allData)
                  : summaryEntries(allData)
            };
          } else {
            const data = await fetchTable(
              this.reportId,
              table.tableName,
              fight["start_time"],
              fight["end_time"],
              table.column,
              { customQuery: table.customQuery }
            );
            return { tableId, tableName: table.displayName, entries: data };
          }
        })
      );
      this.setTableEntries(tableEntries);
    },
    async calcScores(friendlies, tableEntries) {
      this.scores = [];
      const groupsTotalWeight = this.formulas.reduce(
        (total, group) => (group.weight > 0 ? total + group.weight : total),
        0
      );
      const weightNormalized = this.formulas.map(g => {
        const subGroupsTotalWeight = g.subGroups.reduce(
          (total, sub) => (sub.weight > 0 ? total + sub.weight : total),
          0
        );
        return {
          ...g,
          weight: g.weight / groupsTotalWeight,
          subGroups: g.subGroups.map(sub => ({
            ...sub,
            weight: sub.weight / subGroupsTotalWeight
          }))
        };
      });
      const scores = friendlies.map(f => {
        const calGroup = weightNormalized.map(group => {
          const calcSubGroups = group.subGroups.map(sub => ({
            ...sub,
            tableName: tableEntries[sub.tableId].tableName,
            score: (() => {
              const table = tableEntries[sub.tableId];
              const friendEntry = table.entries.find(e => e.id === f.id);
              const friendTotal =
                friendEntry === undefined ? 0 : friendEntry.total;
              switch (sub.type) {
                case FORMULA_TYPE.RELATIVE_TO_MAX:
                  return friendTotal / sub.max;
                case FORMULA_TYPE.RELATIVE_TO_TOP:
                  return friendTotal / table.TOP;
                case FORMULA_TYPE.RELATIVE_TO_AVG:
                  return friendTotal / table.AVG;
                case FORMULA_TYPE.RELATIVE_TO_TOTAL:
                  return friendTotal / table.TOTAL;
                case FORMULA_TYPE.UNITARY:
                  return friendTotal > 0 ? 1 : 0;
              }
            })()
          }));

          return {
            ...group,
            score: calcSubGroups.reduce(
              (score, sub) => score + sub.weight * sub.score,
              0
            ),
            subGroups: calcSubGroups
          };
        });
        return {
          ...f,
          totalScore: calGroup.reduce(
            (total, group) => total + group.weight * group.score,
            0
          ),
          detailScore: calGroup
        };
      });
      this.scores = scores.sort((s1, s2) => s2.totalScore - s1.totalScore);
    }
  }
};
</script>
<style lang="scss"></style>
