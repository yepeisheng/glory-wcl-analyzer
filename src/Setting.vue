<template>
  <v-card elevation="4" class="settings" width="100%">
    <v-toolbar>
      <v-toolbar-title>
        设置
      </v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab>表格</v-tab>
          <v-tab>分数公式</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-container fluid>
          <v-dialog v-model="tableEditor" max-width="400" persistent>
            <v-card>
              <v-card-title>表格</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="editTable.displayName"
                  label="表格名称"
                ></v-text-field>
                <v-select
                  v-model="editTable.tableName"
                  label="表格类型"
                  :items="tableTypeSelect"
                ></v-select>
                <v-select
                  v-model="editTable.fights"
                  label="战斗"
                  :items="fightSelect"
                ></v-select>
                <v-select
                  v-model="editTable.column"
                  label="表格列"
                  :items="columnSelect"
                ></v-select>
                <v-text-field
                  v-model="editTable.abilityIds"
                  label="法术ID"
                  :rules="[
                    () =>
                      editTable.abilityIds.length === 0 ||
                      editTable.abilityIds
                        .split(',')
                        .every(i => !isNaN(parseInt(i))) ||
                      '必须为以,隔开的数字'
                  ]"
                ></v-text-field>
                <v-text-field
                  v-model="editTable.customQuery"
                  label="自定义参数"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="saveTable">确定</v-btn>
                <v-btn @click="tableEditor = false">CLOSE</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-row>
            <v-col>
              <v-btn @click="newTable">
                <v-icon left>
                  mdi-plus
                </v-icon>
                添加表格</v-btn
              >
              <v-btn class="ml-2" @click="resetTable">
                <v-icon left>
                  mdi-refresh
                </v-icon>
                重置</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-simple-table fixed-header>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">表格名字</th>
                      <th class="text-left">表格类型</th>
                      <th class="text-left">战斗</th>
                      <th class="text-left">表格列</th>
                      <th class="text-left">法术ID</th>
                      <th class="text-left">自定义参数</th>
                      <th style="width:170px;" class="text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="table in tables" :key="table.id">
                      <td class="text-left">
                        {{ table.displayName }}
                      </td>
                      <td class="text-left">
                        {{ table.tableName }}
                      </td>
                      <td class="text-left">
                        {{ table.fights }}
                      </td>
                      <td class="text-left">
                        {{ COLUMN_TEXT[table.column] }}
                      </td>
                      <td class="text-left">
                        {{
                          table.abilityIds !== undefined
                            ? table.abilityIds.join(", ")
                            : ""
                        }}
                      </td>
                      <td class="text-left">
                        {{ table.customQuery }}
                      </td>
                      <td>
                        <v-btn @click="edit(table)">修改</v-btn>
                        <v-btn
                          v-if="!table.predefined"
                          color="accent"
                          class="ml-2"
                          @click="deleteTable(table.id)"
                          >删除</v-btn
                        >
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container fluid>
          <v-dialog v-model="formulaEditor" max-width="400" persistent>
            <v-card>
              <v-card-title>计分组</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="editFormula.displayName"
                  label="计分组名称"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="saveFormula">确定</v-btn>
                <v-btn @click="formulaEditor = false">CLOSE</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="subgroupEditor" max-width="400" persistent>
            <v-card>
              <v-card-title>计分</v-card-title>
              <v-card-text>
                <v-select
                  v-model="editSubgroup.tableId"
                  label="表格"
                  :items="tableSelect"
                ></v-select>
                <v-select
                  v-model="editSubgroup.type"
                  label="计分方式"
                  :items="typeSelect"
                ></v-select>
                <v-text-field
                  v-model="editSubgroup.max"
                  label="预设值"
                  :rules="[
                    () => !isNaN(parseInt(editSubgroup.max)) || '必须为正整数'
                  ]"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="saveSubgroup">确定</v-btn>
                <v-btn @click="subgroupEditor = false">CLOSE</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-row>
            <v-col>
              <v-btn @click="newFormula">
                <v-icon left> mdi-plus </v-icon>添加组</v-btn
              >
              <v-btn class="ml-2" @click="resetTable">
                <v-icon left> mdi-refresh </v-icon>重置</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card
                v-for="(group, idx1) in formulas"
                :key="idx1"
                elevation="3"
                class="mb-2"
              >
                <v-card-title class="text--primary">
                  <v-row>
                    <v-col class="col-1 d-flex align-center">
                      <template v-if="!group.edit">
                        {{ group.displayName }}
                        <v-btn icon @click="group.edit = true">
                          <v-icon>
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <template v-else>
                        <v-text-field
                          v-model="group.displayName"
                          hide-details
                          dense
                        ></v-text-field>
                        <v-btn icon @click="group.edit = false"
                          ><v-icon>mdi-check</v-icon></v-btn
                        >
                      </template>
                    </v-col>
                    <v-col class="col-2 py-0 align-center d-flex">
                      <v-slider
                        v-model="group.weight"
                        dense
                        hide-details
                        min="-1"
                        max="1"
                        step="0.05"
                        color="primary"
                      ></v-slider>
                    </v-col>
                    <v-col> 比重: {{ group.weight }} </v-col>
                    <v-col class="d-flex justify-end">
                      <v-btn
                        fab
                        small
                        color="accent"
                        @click="deleteFormula(idx1)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-btn @click="newSubgroup(idx1)">
                        <v-icon left> mdi-plus </v-icon>添加计分</v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th style="width:300px;">表格</th>
                              <th style="width:300px;">算分方式</th>
                              <th style="width:300px;">预设值</th>
                              <th>比重</th>
                              <th style="width:170px;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(sub, idx2) in group.subGroups"
                              :key="`${idx1}_${idx2}`"
                            >
                              <td>
                                {{
                                  tables.find(t => t.id === sub.tableId)
                                    .displayName
                                }}
                              </td>
                              <td>{{ FORMULA_TYPE_TEXT[sub.type] }}</td>
                              <td>{{ sub.max }}</td>
                              <td>
                                <v-row>
                                  <v-col class="col-1 d-flex align-center">{{
                                    sub.weight
                                  }}</v-col>
                                  <v-col>
                                    <v-slider
                                      v-model="sub.weight"
                                      dense
                                      hide-details
                                      min="-1"
                                      max="1"
                                      step="0.05"
                                      color="primary"
                                    ></v-slider>
                                  </v-col>
                                </v-row>
                              </td>
                              <td>
                                <v-btn @click="openEditSubgroup(idx1, idx2)"
                                  >修改</v-btn
                                >
                                <v-btn
                                  color="accent"
                                  class="ml-2"
                                  @click="deleteSubgroup(idx1, idx2)"
                                  >删除</v-btn
                                >
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
import { mapState, mapMutations } from "vuex";
import { TABLE_TYPE, FIGHT_NAME, COLUMN, COLUMN_TEXT } from "./apis";
import { FORMULA_TYPE, FORMULA_TYPE_TEXT } from "./modules/config";
import {
  VSlider,
  VIcon,
  VContainer,
  VToolbar,
  VToolbarTitle,
  VCard,
  VCardTitle,
  VCardActions,
  VCardText,
  VSimpleTable,
  VSelect,
  VDialog,
  VTabs,
  VTabsSlider,
  VTab,
  VSpacer
} from "vuetify/lib";

export default {
  name: "Setting",
  components: {
    VSlider,
    VIcon,
    VContainer,
    VToolbar,
    VToolbarTitle,
    VSimpleTable,
    VCard,
    VCardTitle,
    VCardActions,
    VCardText,
    VDialog,
    VSelect,
    VTabs,
    VTabsSlider,
    VTab,
    VSpacer
  },
  data: () => ({
    tab: 0,
    tableEditor: false,
    formulaEditor: false,
    subgroupEditor: false,
    tableTypeSelect: Object.values(TABLE_TYPE).map(v => ({
      text: v,
      value: v
    })),
    fightSelect: Object.values(FIGHT_NAME).map(v => ({ text: v, value: v })),
    typeSelect: Object.values(FORMULA_TYPE).map(v => ({
      text: FORMULA_TYPE_TEXT[v],
      value: v
    })),
    COLUMN_TEXT,
    FORMULA_TYPE_TEXT,
    columnSelect: Object.values(COLUMN).map(v => ({
      text: COLUMN_TEXT[v],
      value: v
    })),
    editTable: {
      predefined: false,
      displayName: "",
      tableName: TABLE_TYPE.DAMAGE_TAKEN,
      fights: FIGHT_NAME.OVERALL,
      column: COLUMN.TOTAL,
      abilityIds: [],
      customQuery: ""
    },
    editFormula: {
      displayName: "",
      edit: false,
      weight: 1,
      subGroups: []
    },
    editSubgroupIdx: {
      formulaIdx: -1,
      subgroupIdx: -1
    },
    editSubgroup: {
      tableId: "DAMAGE",
      weight: 1,
      type: FORMULA_TYPE.RELATIVE_TO_TOP
    },
    editFormulaMode: "edit",
    editSubgroupMode: "edit",
    editTableMode: "edit"
  }),
  computed: {
    ...mapState("config", ["tables", "formulas"]),
    tableSelect() {
      return this.tables.map(t => ({ text: t.displayName, value: t.id }));
    }
  },
  methods: {
    ...mapMutations("config", [
      "insertTable",
      "updateTable",
      "deleteTable",
      "resetTable",
      "insertFormula",
      "deleteFormula",
      "resetFormula",
      "insertSubgroup",
      "updateSubgroup",
      "deleteSubgroup"
    ]),
    edit(table) {
      this.editTable = Object.assign({}, table, {
        abilityIds:
          table.abilityIds !== undefined ? table.abilityIds.join(",") : ""
      });
      this.editTableMode = "edit";
      this.tableEditor = true;
    },
    openEditSubgroup(formulaIdx, subgroupIdx) {
      this.editSubgroup = Object.assign(
        {},
        this.formulas[formulaIdx].subGroups[subgroupIdx]
      );
      this.editSubgroupIdx = {
        formulaIdx,
        subgroupIdx
      };
      this.editSubgroupMode = "edit";
      this.subgroupEditor = true;
    },
    newTable() {
      this.editTable = {
        id: uuidv4(),
        predefined: false,
        displayName: "",
        tableName: TABLE_TYPE.DAMAGE_TAKEN,
        fights: FIGHT_NAME.OVERALL,
        column: COLUMN.TOTAL,
        abilityIds: "",
        customQuery: ""
      };
      this.editTableMode = "new";
      this.tableEditor = true;
    },
    newFormula() {
      this.editFormula = {
        displayName: "",
        edit: false,
        weight: 1,
        subGroups: []
      };
      this.editFormulaMode = "new";
      this.formulaEditor = true;
    },
    newSubgroup(formulaIdx) {
      this.editSubgroup = {
        tableId: "DAMAGE",
        weight: 1,
        type: FORMULA_TYPE.RELATIVE_TO_TOP
      };
      this.editSubgroupIdx.formulaIdx = formulaIdx;
      this.editSubgroupMode = "new";
      this.subgroupEditor = true;
    },
    saveFormula() {
      this.insertFormula(this.editFormula);
      this.formulaEditor = false;
    },
    saveSubgroup() {
      if (this.editSubgroupMode === "new") {
        this.insertSubgroup({
          ...this.editSubgroupIdx,
          subgroup: {
            ...this.editSubgroup,
            max: parseInt(this.editSubgroup.max)
          }
        });
      } else if (this.editSubgroupMode === "edit") {
        this.updateSubgroup({
          ...this.editSubgroupIdx,
          subgroup: {
            ...this.editSubgroup,
            max: parseInt(this.editSubgroup.max)
          }
        });
      }
      this.subgroupEditor = false;
      console.log(this.formulas);
    },
    saveTable() {
      if (this.editTableMode === "new") {
        this.insertTable({
          ...this.editTable,
          abilityIds: this.editTable.abilityIds.split(",")
        });
      } else if (this.editTableMode === "edit") {
        this.updateTable({
          ...this.editTable,
          abilityIds: this.editTable.abilityIds.split(",")
        });
      }
      this.tableEditor = false;
    }
  }
};
</script>

<style lang="scss">
.settings {
  position: absolute;
  z-index: 2;
}
</style>
