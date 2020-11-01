<template>
  <v-card elevation="4" class="settings" width="100%" height="100%">
    <v-toolbar>
      <v-toolbar-title>
        {{ table.tableName }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container fluid>
      <v-simple-table fixed-header height="500px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">名字</th>
              <th class="text-left">百分条</th>
              <th class="text-left">数值</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in table.entries" :key="entry.id">
              <td>{{ entry.name }}</td>
              <td style="width: 600px;">
                <div
                  class="primary"
                  style="height:25px;"
                  :style="{ width: `${(entry.total / table.TOP) * 580}px` }"
                ></div>
              </td>
              <td>{{ entry.total }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </v-card>
</template>
<script>
import {
  VContainer,
  VToolbar,
  VToolbarTitle,
  VCard,
  VSimpleTable
} from "vuetify/lib";

export default {
  name: "WclTable",
  components: {
    VContainer,
    VToolbar,
    VToolbarTitle,
    VSimpleTable,
    VCard
  },
  props: {
    table: {
      type: Object,
      required: true
    }
  },
  methods: {}
};
</script>

<style lang="scss"></style>
