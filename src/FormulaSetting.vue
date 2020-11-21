<template>
  <v-container fluid>
    <v-dialog v-model="formulaEditor" max-width="400" persistent>
      <v-card>
        <v-card-title>考核分组</v-card-title>
        <v-card-text>
          <v-text-field v-model="editFormula.displayName" label="计分组名称" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="saveFormula">确定</v-btn>
          <v-btn @click="formulaEditor = false">CLOSE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="subgroupEditor" max-width="400" persistent>
      <v-card>
        <v-card-title>考核点</v-card-title>
        <v-card-text>
          <div class="d-flex align-center">
            <span>表格相加</span>
            <v-btn class="ml-2" small @click="addTable">
              <v-icon> mdi-plus </v-icon>
            </v-btn>
          </div>
          <div class="d-flex mb-5">
            <div style="width:20px;">
              <v-divider vertical />
            </div>
            <div style="flex:1">
              <v-row v-for="(t, tableIdx) in editSubgroup.tableIds" :key="t.id">
                <v-col cols="2">
                  <v-text-field
                    v-model="t.amplifier"
                    dense
                    label="倍数"
                    :rules="[
                      () => !isNaN(parseInt(t.amplifier)) || '必须为整数'
                    ]"
                  />
                </v-col>
                <v-col cols="7">
                  <v-select v-model="t.id" dense :items="tableSelect" />
                </v-col>
                <v-col cols="1">
                  <v-btn color="accent" small @click="deleteTable(tableIdx)">
                    <v-icon> mdi-delete </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
          <v-select
            v-model="editSubgroup.type"
            label="算分方式"
            :items="typeSelect"
          />
          <v-text-field
            v-if="editSubgroup.type === FORMULA_TYPE.RELATIVE_TO_MAX"
            v-model="editSubgroup.max"
            label="预设最大值"
            :rules="[() => !isNaN(parseInt(editSubgroup.max)) || '必须为整数']"
          />
          <v-text-field
            v-if="editSubgroup.type === FORMULA_TYPE.RELATIVE_TO_MIN"
            v-model="editSubgroup.min"
            label="预设最小值"
            :rules="[() => !isNaN(parseInt(editSubgroup.min)) || '必须为整数']"
          />
          <v-switch v-model="editSubgroup.reverse" label="反向计分" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="saveSubgroup">确定</v-btn>
          <v-btn @click="subgroupEditor = false">CLOSE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col class="col-11">
        <v-tabs v-model="selectedClassIndex">
          <v-tabs-slider color="primary" />
          <v-tab v-for="c in classes" :key="c.code">
            <span :style="{ color: c.color }"> {{ c.display }} </span>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col class="col-1 d-flex align-center justify-end">
        <v-btn small @click="downloadFormulas">
          <v-icon>mdi-download</v-icon>
          XLSX
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="newFormula">
          <v-icon left> mdi-plus </v-icon>添加组</v-btn
        >
        <v-btn class="ml-2" @click="resetFormula">
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
                  />
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
                />
              </v-col>
              <v-col> 比重: {{ group.weight }} </v-col>
              <v-col class="d-flex justify-end">
                <v-btn
                  fab
                  small
                  color="accent"
                  @click="
                    deleteFormula({
                      classType: selectedClass,
                      formulaIdx: idx1
                    })
                  "
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
                        <th style="width:400px;">表格</th>
                        <th style="width:150px;">算分方式</th>
                        <th style="width:100px;">预设值</th>
                        <th style="width:100px;">反向计分</th>
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
                            sub.tableIds
                              .map(
                                t =>
                                  `${
                                    t.amplifier !== undefined
                                      ? "(" + t.amplifier + ")  x"
                                      : ""
                                  }${
                                    tables.find(table => table.id === t.id)
                                      .displayName
                                  }`
                              )
                              .join(" + ")
                          }}
                        </td>
                        <td>{{ FORMULA_TYPE_TEXT[sub.type] }}</td>
                        <td>{{ sub.max }}</td>
                        <td>{{ sub.reverse }}</td>
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
                                step="0.01"
                                color="primary"
                              />
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
                            @click="
                              deleteSubgroup({
                                classType: selectedClass,
                                formulaIdx: idx1,
                                subgroupIdx: idx2
                              })
                            "
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
</template>
<script>
import {
  VDivider,
  VSwitch,
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
import {
  FORMULA_TYPE,
  FORMULA_TYPE_TEXT
} from "./constants/formulas/FormulaConstants";
import { mapMutations, mapState } from "vuex";
import classes from "./constants/Classes";
import XLSX from "xlsx";
export default {
  name: "FormulaSetting",
  comments: {
    VDivider,
    VSwitch,
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
    classes,
    FORMULA_TYPE,
    selectedClassIndex: 4,
    formulaEditor: false,
    subgroupEditor: false,
    typeSelect: Object.values(FORMULA_TYPE).map(v => ({
      text: FORMULA_TYPE_TEXT[v],
      value: v
    })),
    FORMULA_TYPE_TEXT,
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
      tableIds: [{ id: "DAMAGE", amplifier: 1 }],
      weight: 1,
      type: FORMULA_TYPE.RELATIVE_TO_TOP
    },
    editFormulaMode: "edit",
    editSubgroupMode: "edit"
  }),
  computed: {
    ...mapState("config", ["tables", "allFormulas"]),
    tableSelect() {
      return this.tables.map(t => ({ text: t.displayName, value: t.id }));
    },
    selectedClass() {
      return this.classes[this.selectedClassIndex].code;
    },
    formulas() {
      const target = this.allFormulas.find(
        f => f.classType === this.selectedClass
      );
      return target["formulas"];
    }
  },
  methods: {
    ...mapMutations("config", [
      "insertFormula",
      "deleteFormula",
      "resetFormula",
      "insertSubgroup",
      "updateSubgroup",
      "deleteSubgroup"
    ]),
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
        tableIds: [{ id: "DAMAGE", amplifier: 1 }],
        weight: 1,
        type: FORMULA_TYPE.RELATIVE_TO_TOP
      };
      this.editSubgroupIdx.formulaIdx = formulaIdx;
      this.editSubgroupMode = "new";
      this.subgroupEditor = true;
    },
    addTable() {
      this.editSubgroup.tableIds.push({ id: "DAMAGE", amplifier: 1 });
    },
    deleteTable(idx) {
      this.editSubgroup.tableIds.splice(idx, 1);
    },
    saveFormula() {
      this.insertFormula({
        classType: this.selectedClass,
        formula: this.editFormula
      });
      this.formulaEditor = false;
    },
    saveSubgroup() {
      if (this.editSubgroupMode === "new") {
        this.insertSubgroup({
          classType: this.selectedClass,
          ...this.editSubgroupIdx,
          newSubgroup: {
            ...this.editSubgroup,
            max: parseInt(this.editSubgroup.max)
          }
        });
      } else if (this.editSubgroupMode === "edit") {
        this.updateSubgroup({
          classType: this.selectedClass,
          ...this.editSubgroupIdx,
          subgroup: {
            ...this.editSubgroup,
            max: parseInt(this.editSubgroup.max)
          }
        });
      }
      this.subgroupEditor = false;
    },
    downloadFormulas() {
      const filename = `哥老瑞考核公式.xlsx`;

      const sheets = this.allFormulas.map(formulasForClass => {
        const c = classes.find(c => c.code === formulasForClass.classType);
        const groups = formulasForClass.formulas.map(group => {
          const groupHeader = [`${group.weight * 100}%`, group.displayName];
          const subgroups = group.subGroups.map(subgroup => {
            const subgroupName = subgroup.tableIds
              .map(
                t =>
                  `${
                    t.amplifier !== undefined ? "(" + t.amplifier + ")  x" : ""
                  }${this.tables.find(table => table.id === t.id).displayName}`
              )
              .join(" + ");
            return ["", `${subgroup.weight * 100}%`, subgroupName];
          });
          return [groupHeader].concat(subgroups);
        });
        console.log(groups);
        return {
          sheetName: c.display,
          sheet: XLSX.utils.aoa_to_sheet([].concat(...groups))
        };
      });

      const wb = XLSX.utils.book_new();
      for (let i = 0; i < sheets.length; i++) {
        console.log(sheets[i]);
        XLSX.utils.book_append_sheet(
          wb,
          sheets[i]["sheet"],
          sheets[i]["sheetName"]
        );
      }
      XLSX.writeFile(wb, filename);
    }
  }
};
</script>
