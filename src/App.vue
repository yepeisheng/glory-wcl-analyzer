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
        <template v-if="!openSetting && scores.length > 0">
          <v-row>
            <v-tabs v-model="selectedClassIndex">
              <v-tabs-slider color="primary" />
              <v-tab v-for="c in classes" :key="c.code">
                <span :style="{ color: c.color }"> {{ c.display }} </span>
              </v-tab>
            </v-tabs>
          </v-row>
          <v-row>
            <v-col>
              <score-table
                :scores="scores.find(s => s.classType === selectedClass).scores"
                :report-id="reportId"
                :class-type="selectedClass"
                @openTable="openTablePanel"
              ></score-table>
            </v-col>
          </v-row>
        </template>
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
  fetchTable_ORIGIN,
  FIGHT_NAME,
  summaryEntries,
  summaryForDebuffs,
  summaryForWorldBuffs,
  TABLE_TYPE,
  COLUMN
} from "./apis";
import {
  FORMULA_TYPE,
  normalizeWeight
} from "./constants/formulas/FormulaConstants";
import Setting from "./Setting";
import ScoreTable from "./ScoreTable";
import WclTable from "./WclTable";
import classes from "./constants/Classes";
import { filterEntriesById } from "./constants/TableConstants";

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
      reportId: "AKpLva4YtC6ndmFx",
      selectedClassIndex: 0,
      classes,
      scores: []
    };
  },
  computed: {
    ...mapState("config", ["tables", "allFormulas"]),
    ...mapState("report", [
      "friendlies",
      "fights",
      "tableEntries",
      "rawReport"
    ]),
    selectedClass() {
      return this.classes[this.selectedClassIndex].code;
    }
  },
  watch: {
    openSetting() {
      // this.save();
    }
  },
  methods: {
    ...mapMutations("report", [
      "setReport",
      "setTableEntries",
      "setFriendlies"
    ]),
    ...mapMutations("config", ["save"]),
    openTablePanel(tableEntries) {
      this.openTable = true;
      this.table = tableEntries;
    },
    async fetchReport() {
      this.loading = true;
      const report = await fetchReport(this.reportId);
      this.setReport(report);

      const protectionWarriors = await fetchTable(
        this.reportId,
        TABLE_TYPE.DAMAGE_TAKEN,
        this.fights[FIGHT_NAME.OVERALL].start_time,
        this.fights[FIGHT_NAME.OVERALL].end_time,
        COLUMN.TOTAL,
        { abilityId: "1" }
      );

      const recklessCurse = await fetchTable(
        this.reportId,
        TABLE_TYPE.CASTS,
        this.fights[FIGHT_NAME.OVERALL].start_time,
        this.fights[FIGHT_NAME.OVERALL].end_time,
        COLUMN.TOTAL,
        { abilityId: "11717" }
      );

      const weaknessCurse = await fetchTable(
        this.reportId,
        TABLE_TYPE.CASTS,
        this.fights[FIGHT_NAME.OVERALL].start_time,
        this.fights[FIGHT_NAME.OVERALL].end_time,
        COLUMN.TOTAL,
        { abilityId: "11708" }
      );

      const elementalCurse = await fetchTable(
        this.reportId,
        TABLE_TYPE.CASTS,
        this.fights[FIGHT_NAME.OVERALL].start_time,
        this.fights[FIGHT_NAME.OVERALL].end_time,
        COLUMN.TOTAL,
        { abilityId: "11722" }
      );

      this.setFriendlies({
        protectionWarriors,
        recklessCurse,
        elementalCurse,
        weaknessCurse
      });
      const tableSet = new Set(
        [].concat(
          ...[]
            .concat(
              ...[]
                .concat(...this.allFormulas.map(f => f.formulas))
                .map(g => g.subGroups)
            )
            .map(sb => sb.tableIds.map(t => t.id))
        )
      );
      await this.fetchTables(Array.from(tableSet));
      await this.calcScores();
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
                tableId === "WORLD-BUFFS-MELEE" ||
                tableId === "WORLD-BUFFS-RANGE"
                  ? summaryForWorldBuffs(allData)
                  : table.tableName === TABLE_TYPE.DEBUFFS
                  ? summaryForDebuffs(
                      table.abilityIds,
                      allData,
                      this.rawReport["fights"]
                    )
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
    async calcScores() {
      this.scores = this.allFormulas.map(formulasForClass => {
        const classType = formulasForClass.classType;
        const formulas = formulasForClass.formulas;

        const weightNormalized = normalizeWeight(formulas);
        const filteredFriendlies = this.friendlies.filter(
          f => f.type === classType
        );
        const filteredTable = filterEntriesById(
          this.tableEntries,
          new Set(filteredFriendlies.map(f => f.id))
        );
        const tableCalculated = weightNormalized.map(group => ({
          ...group,
          subGroups: group.subGroups.map(sub => {
            const summedTable = {};
            for (let i = 0; i < sub.tableIds.length; i++) {
              const tableConfig = sub.tableIds[i];
              const tableEntries =
                sub.specialFormula === undefined
                  ? filteredTable[tableConfig.id].entries
                  : this.tableEntries[tableConfig.id].entries;
              tableEntries.reduce((out, e) => {
                if (out[e.id] === undefined) {
                  out[e.id] = e;
                  out[e.id]["total"] = e["total"] * tableConfig["amplifier"];
                } else {
                  out[e.id]["total"] =
                    out[e.id]["total"] + e["total"] * tableConfig["amplifier"];
                }
                return out;
              }, summedTable);
            }
            const subgroupTableEntries = Object.values(summedTable).sort(
              (e1, e2) => e2.total - e1.total
            );
            const tableName = sub.tableIds
              .map(
                t =>
                  `${
                    t.amplifier !== undefined ? "(" + t.amplifier + ")  x" : ""
                  }${this.tables.find(table => table.id === t.id).displayName}`
              )
              .join(" + ");
            const TOTAL = subgroupTableEntries
              .map(e => e.total)
              .reduce((e1, e2) => e1 + e2, 0);
            const AVG = TOTAL / subgroupTableEntries.entries.length;
            const TOP = subgroupTableEntries
              .map(e => e.total)
              .reduce((e1, e2) => (e2 > e1 ? e2 : e1), 0);
            return {
              ...sub,
              subgroupTable: {
                entries: subgroupTableEntries,
                tableName,
                TOTAL,
                AVG,
                TOP
              }
            };
          })
        }));

        const scores = filteredFriendlies.map(f => {
          const calGroup = tableCalculated.map(group => {
            const calcSubGroups = group.subGroups.map(sub => ({
              ...sub,
              tableName: sub.subgroupTable.tableName,
              score: (() => {
                if (sub.specialFormula !== undefined) {
                  const table = sub.subgroupTable;
                  const debuffIds = [];
                  if (f.isRecklessCurseWarlock) {
                    debuffIds.push(11717);
                  }
                  if (f.isElementalCurseWarlock) {
                    debuffIds.push(11722);
                  }
                  if (f.isWeaknessCurseWarlock) {
                    debuffIds.push(11708);
                  }
                  if (f.isFaerieFire) {
                    debuffIds.push(9907);
                  }
                  const debuffIdSet = new Set(debuffIds);
                  const debuffTotal = table.entries
                    .filter(e => debuffIdSet.has(e.id))
                    .map(e => e.total)
                    .reduce((t1, t2) => t1 + t2, 0);
                  const score = debuffTotal;
                  return score;
                } else {
                  const table = sub.subgroupTable;
                  const friendEntry = table.entries.find(e => e.id === f.id);
                  const friendTotal =
                    friendEntry === undefined ? 0 : friendEntry.total;
                  let score = 0;
                  if (
                    sub.checkShamanInRangeTeam &&
                    friendTotal < sub.inRangeTeamThreshold
                  ) {
                    score = 0.5;
                  } else {
                    switch (sub.type) {
                      case FORMULA_TYPE.RELATIVE_TO_MAX:
                        score = Math.min(friendTotal, sub.max) / sub.max;
                        break;
                      case FORMULA_TYPE.RELATIVE_TO_MIN:
                        score = friendTotal >= sub.min ? 1 : 0;
                        break;
                      case FORMULA_TYPE.RELATIVE_TO_TOP:
                        score = friendTotal / table.TOP;
                        break;
                      case FORMULA_TYPE.RELATIVE_TO_AVG:
                        score = friendTotal / table.AVG;
                        break;
                      case FORMULA_TYPE.RELATIVE_TO_TOTAL:
                        score = friendTotal / table.TOTAL;
                        break;
                      case FORMULA_TYPE.UNITARY:
                        score = friendTotal > 0 ? 1 : 0;
                        break;
                    }
                  }
                  return sub.reverse ? 1 - score : score;
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
        scores.sort((s1, s2) => s2.totalScore - s1.totalScore);

        return {
          classType,
          scores
        };
      });
    }
  }
};
</script>
<style lang="scss"></style>
