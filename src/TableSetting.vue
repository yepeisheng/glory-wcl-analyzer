<template>
  <v-container fluid>
    <v-dialog v-model="tableEditor" max-width="400" persistent>
      <v-card>
        <v-card-title>表格</v-card-title>
        <v-card-text>
          <v-text-field v-model="editTable.displayName" label="表格名称" />
          <v-select
            v-model="editTable.tableName"
            label="表格类型"
            :items="tableTypeSelect"
          />
          <v-select
            v-model="editTable.fights"
            label="战斗"
            :items="fightSelect"
          />
          <v-select
            v-model="editTable.column"
            label="表格列"
            :items="columnSelect"
          />
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
          />
          <v-text-field v-model="editTable.customQuery" label="自定义参数" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
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
</template>
<script>
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
import { mapMutations, mapState } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { COLUMN, COLUMN_TEXT, FIGHT_NAME, TABLE_TYPE } from "./apis";

export default {
  name: "TableSetting",
  comments: {
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
  },
  data: () => ({
    tableEditor: false,
    tableTypeSelect: Object.values(TABLE_TYPE).map(v => ({
      text: v,
      value: v
    })),
    fightSelect: Object.values(FIGHT_NAME).map(v => ({ text: v, value: v })),
    COLUMN_TEXT,
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
    editTableMode: "edit"
  }),
  computed: {
    ...mapState("config", ["tables"])
  },
  methods: {
    ...mapMutations("config", [
      "insertTable",
      "updateTable",
      "deleteTable",
      "resetTable"
    ]),
    edit(table) {
      this.editTable = Object.assign({}, table, {
        abilityIds:
          table.abilityIds !== undefined ? table.abilityIds.join(",") : ""
      });
      this.editTableMode = "edit";
      this.tableEditor = true;
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
