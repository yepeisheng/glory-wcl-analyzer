<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-settings-box</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container v-show="openSetting" fluid> </v-container>
      <v-container fluid>
        <v-row>
          <v-col class="col-2">
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
        <template v-if="false && !loading && !sundersCalculating">
          <v-row class="pa-2"> 一共{{ enemiesTotal.length }}只怪 </v-row>
          <v-row class="pa-2">
            <v-col class="col-4">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        最高破甲数
                      </th>
                      <th class="text-left">
                        怪的数量
                      </th>
                      <th class="text-left">
                        平均时间
                      </th>
                      <th class="text-left">
                        最快时间
                      </th>
                      <th class="text-left">
                        最慢时间
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        4
                      </td>
                      <td>
                        {{ enemiesWith4Sunders.length }}
                      </td>
                      <td>
                        {{ fourSundersAvg }}
                      </td>
                      <td>
                        {{ fourSundersMin }}
                      </td>
                      <td>
                        {{ fourSundersMax }}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        5
                      </td>
                      <td>
                        {{ enemiesWithFullSunders.length }}
                      </td>
                      <td>
                        {{ fullSundersAvg }}
                      </td>
                      <td>
                        {{ fullSundersMin }}
                      </td>
                      <td>
                        {{ fullSundersMax }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col class="col-4">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        有效破甲(所有破甲，效率%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="friendly in sortedFriendlies" :key="friendly.id">
                      <td>{{ friendly.name }}</td>
                      <td>
                        {{
                          `${friendly.effectiveSunders}(${
                            friendly.allSunders
                          }, ${Math.round(
                            (friendly.effectiveSunders / friendly.allSunders) *
                              100
                          )}%)`
                        }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-main>

    <v-footer app>
      {{ tables.length }}
      {{ footer }}
    </v-footer>
  </v-app>
</template>

<script>
import {
  VAppBar,
  VSpacer,
  VToolbarTitle,
  VContainer,
  VMain,
  VFooter,
  VTextField,
  VBtn,
  VIcon,
  VSimpleTable
} from "vuetify/lib";
import { fetchOverallDamage, fetchReport, fetchSunderArmor } from "./apis";
import { mapState } from "vuex";

export default {
  name: "AppBack",
  components: {
    VAppBar,
    VSpacer,
    VToolbarTitle,
    VContainer,
    VMain,
    VFooter,
    VTextField,
    VBtn,
    VIcon,
    VSimpleTable
  },
  data: () => {
    return {
      loading: false,
      title: "Classic WCL Analyzer",
      footer: "Powered by To God be the Glory",
      reportId: "apz2cHtjXKBvYR8r",
      friendlies: [],
      enemies: [],
      enemiesTotal: [],
      enemiesWithFullSunders: [],
      enemiesWith4Sunders: [],
      fights: [],
      sunders: [],
      sundersCalculating: false,
      overallDamage: []
    };
  },
  computed: {
    ...mapState("config", ["tables"]),
    overallStartTime() {
      return this.fights.length > 0 ? this.fights[0]["start_time"] : 0;
    },
    overallEndTime() {
      return this.fights.length > 0
        ? this.fights[this.fights.length - 1]["end_time"]
        : 0;
    },
    sortedFriendlies() {
      return this.friendlies
        .filter(f => f !== null && f.type === "Warrior")
        .sort((f1, f2) => f2.effectiveSunders - f1.effectiveSunders);
    },
    boss1() {
      return this.enemies.find(e => e.name === "预言者斯克拉姆");
    },
    enemiesMapping() {
      return this.enemies
        .map(e => ({
          ...e,
          instancesTotal: e.fights
            .map(f => f.instances)
            .reduce((a, b) => a + b, 0)
        }))
        .map(e => ({
          ...e,
          instances: Array(e.instancesTotal)
            .fill(0)
            .map(() => ({
              name: e.name,
              sunders: [],
              firstSunder: 0
            }))
        }))
        .reduce((data, e) => {
          data[e.id] = e;
          return data;
        }, {});
    },
    fullSundersAvg() {
      console.log(
        this.enemiesWithFullSunders.map(e => ({
          ...e,
          sunderTook: e.sunders[4] - e.firstSunder
        }))
      );
      return (
        this.enemiesWithFullSunders
          .map(e => e.sunders[4] - e.firstSunder)
          .reduce((a, b) => a + b, 0) / this.enemiesWithFullSunders.length
      );
    },
    fullSundersMax() {
      return (
        Math.round(
          this.enemiesWithFullSunders
            .map(e => e.sunders[4] - e.firstSunder)
            .reduce((a, b) => (a > b ? a : b), 0) / 100
        ) / 10
      );
    },
    fullSundersMin() {
      return (
        Math.round(
          this.enemiesWithFullSunders
            .map(e => e.sunders[4] - e.firstSunder)
            .reduce((a, b) => (a < b ? a : b), Number.MAX_SAFE_INTEGER) / 100
        ) / 10
      );
    },
    fourSundersAvg() {
      return (
        this.enemiesWith4Sunders
          .map(e => e.sunders[3] - e.firstSunder)
          .reduce((a, b) => a + b, 0) / this.enemiesWith4Sunders.length
      );
    },
    fourSundersMax() {
      return (
        Math.round(
          this.enemiesWith4Sunders
            .map(e => e.sunders[3] - e.firstSunder)
            .reduce((a, b) => (a > b ? a : b), 0) / 100
        ) / 10
      );
    },
    fourSundersMin() {
      return (
        Math.round(
          this.enemiesWith4Sunders
            .map(e => e.sunders[3] - e.firstSunder)
            .reduce((a, b) => (a < b ? a : b), Number.MAX_SAFE_INTEGER) / 100
        ) / 10
      );
    }
  },
  watch: {
    sunders() {
      this.sundersCalculating = true;
      for (let i = 0; i < this.sunders.length; i++) {
        const sunder = this.sunders[i];
        const time = sunder["timestamp"];
        const friendlyId = sunder["sourceID"];
        let enemyId = sunder["targetID"];
        let enemyInstanceId = sunder["targetInstance"] || 1;

        if (this.enemiesMapping[enemyId] === undefined) {
          const fight = sunder["fight"];
          const boss1Fight = this.boss1.fights[0].id;
          if (fight === boss1Fight) {
            enemyId = this.boss1.id;
            enemyInstanceId = 1;
          }
        }

        const enemyInstance = this.enemiesMapping[enemyId].instances[
          enemyInstanceId - 1
        ];
        if (enemyInstance.sunders.length === 0) {
          enemyInstance.firstSunder = time;
        }

        if (
          time - enemyInstance.firstSunder < 3000 ||
          enemyInstance.sunders.length < 5 ||
          enemyId === this.boss1.id
        ) {
          enemyInstance.sunders.push(time);
          this.friendlies[friendlyId].effectiveSunders++;
        }
        this.friendlies[friendlyId].allSunders++;
        this.friendlies[friendlyId].effective =
          this.friendlies[friendlyId].effectiveSunders /
          this.friendlies[friendlyId].allSunders;
      }

      this.enemiesTotal = [].concat(
        ...Object.values(this.enemiesMapping).map(e => e.instances)
      );
      this.enemiesWithFullSunders = this.enemiesTotal.filter(
        e => e.sunders.length === 5
      );
      this.enemiesWith4Sunders = this.enemiesTotal.filter(
        e => e.sunders.length === 4
      );
      this.sundersCalculating = false;
    }
  },
  methods: {
    initData() {
      this.friendlies = [];
      this.overallDamage = [];
    },
    async fetchReport() {
      this.initData();
      this.loading = true;
      const report = await fetchReport(this.reportId);
      const friendliesMax = report.friendlies.reduce(
        (a, b) => (a > b ? a : b),
        0
      );
      this.friendlies = Array(friendliesMax + 1).fill(null);
      for (let i = 0; i < report.friendlies.length; i++) {
        const f = report.friendlies[i];
        this.friendlies[f.id] = {
          ...f,
          effectiveSunders: 0,
          allSunders: 0,
          effective: 0
        };
      }
      this.enemies = report.enemies.concat(report["enemyPets"]);
      this.fights = report.fights;
      this.overallDamage = await fetchOverallDamage(
        this.reportId,
        this.overallStartTime,
        this.overallEndTime
      );
      this.sunders = await fetchSunderArmor(
        this.reportId,
        this.overallStartTime,
        this.overallEndTime
      );
      this.loading = false;
    }
  }
};
</script>

<style lang="scss"></style>
