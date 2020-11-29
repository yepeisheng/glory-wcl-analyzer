<template>
  <div>
    <template v-if="scores.length > 0">
      <v-data-table
        dense
        class="elevation-1"
        :headers="headers"
        :items="items"
        :items-per-page="20"
        hide-default-footer
      />
    </template>
    <v-list width="100%" class="mt-5">
      <v-list-group v-for="score in scores" :key="score.id">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title
              >{{ score.name }} -
              {{ Math.round(score.totalScore * 100) / 100 }}</v-list-item-title
            >
          </v-list-item-content>
        </template>
        <v-list-group
          v-for="(detail, idx) in score.detailScore"
          :key="`${score.id}-${idx}`"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  >{{ detail.displayName }} -
                  {{ Math.round(detail.score * 100) / 100 }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item
            v-for="(subDetail, subIdx) in detail.subGroups"
            :key="`${score.id}-${subIdx}`"
            @click="$emit('openTable', subDetail.subgroupTable)"
          >
            <v-list-item-content>
              <v-list-item-title
                >{{ subDetail.tableName }} -
                {{ Math.round(subDetail.score * 100) / 100 }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
  </div>
</template>
<script>
import {
  VDataTable,
  VList,
  VListGroup,
  VListItem,
  VListItemContent,
  VListItemTitle
} from "vuetify/lib";
import { convertHeaders, convertItems } from "./utils";
import XLSX from "xlsx";
export default {
  name: "ScoreTable",
  components: {
    VDataTable,
    VList,
    VListGroup,
    VListItem,
    VListItemContent,
    VListItemTitle
  },
  props: {
    scores: {
      type: Array,
      required: true
    },
    reportId: {
      type: String,
      required: true
    },
    classType: {
      type: String,
      required: true
    }
  },
  computed: {
    headers() {
      return convertHeaders(this.scores);
    },
    items() {
      return convertItems(this.scores);
    }
  },
  methods: {
    download() {
      const filename = `${this.reportId}.xlsx`;

      const headersData = this.headers.map(h => h.text);

      const itemData = this.items.map(i => this.headers.map(h => i[h.value]));
      const data = [headersData].concat(itemData);
      var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(data);

      const layers = [];
      let curLayer = null;
      for (let i = 2; i < this.headers.length; i++) {
        const header = this.headers[i];
        if (header.value.indexOf("group") === 0) {
          curLayer = {
            idx: i,
            weight: header.weight,
            subLayers: []
          };
          layers.push(curLayer);
        } else if (header.value.indexOf("sub") === 0) {
          curLayer.subLayers.push({
            idx: i,
            weight: header.weight
          });
        }
      }

      const totalFormula = layers
        .map(l => `${String.fromCharCode(65 + l.idx)}{playerIdx}*${l.weight}`)
        .join("+");
      const roundTotalFormula = `ROUND(${totalFormula},3)`;
      const layerFormula = layers.map(l => {
        const formula = l.subLayers
          .map(
            sl => `${String.fromCharCode(65 + sl.idx)}{playerIdx}*${sl.weight}`
          )
          .join("+");
        return {
          idx: l.idx,
          formula: `ROUND(${formula},3)`
        };
      });
      this.items.map((i, playerIdx) => {
        const totalCell = `B${playerIdx + 2}`;
        ws[totalCell] = {
          f: roundTotalFormula.replaceAll("{playerIdx}", playerIdx + 2)
        };
        layerFormula.forEach(l => {
          const layerCell = `${String.fromCharCode(65 + l.idx)}${playerIdx +
            2}`;
          ws[layerCell] = {
            f: l.formula.replaceAll("{playerIdx}", playerIdx + 2)
          };
        });
      });

      /* add worksheet to workbook */
      XLSX.utils.book_append_sheet(wb, ws, this.classType);
      /* write workbook */
      XLSX.writeFile(wb, filename);
    }
  }
};
</script>
