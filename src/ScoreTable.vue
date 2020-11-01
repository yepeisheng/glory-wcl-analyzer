<template>
  <div>
    <v-list width="100%">
      <v-list-group v-for="score in scores" :key="score.id">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title
              >{{ score.name }} -
              {{ Math.round(score.totalScore * 10) / 10 }}</v-list-item-title
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
                  {{ Math.round(detail.score * 10) / 10 }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item
            v-for="subDetail in detail.subGroups"
            :key="`${score.id}-${subDetail.tableId}`"
            @click="$emit('openTable', subDetail.tableId)"
          >
            <v-list-item-content>
              <v-list-item-title
                >{{ subDetail.tableName }} -
                {{ Math.round(subDetail.score * 10) / 10 }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
  </div>
</template>
<script>
import { VList, VListGroup, VListItemContent, VListItem } from "vuetify/lib";
export default {
  name: "ScoreTable",
  components: {
    VList,
    VListGroup,
    VListItem,
    VListItemContent
  },
  props: {
    scores: {
      type: Array,
      required: true
    }
  }
};
</script>
