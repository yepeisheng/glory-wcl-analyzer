<template>
  <v-card elevation="4" class="settings" width="100%">
    <v-toolbar>
      <v-toolbar-title>
        设置
      </v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tabs-slider color="primary" />
          <v-tab>表格</v-tab>
          <v-tab>考核公式</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <table-setting />
      </v-tab-item>
      <v-tab-item>
        <formula-setting />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import TableSetting from "./TableSetting";
import FormulaSetting from "./FormulaSetting";
import {
  VToolbar,
  VToolbarTitle,
  VCard,
  VTabs,
  VTabsSlider,
  VTab
} from "vuetify/lib";

export default {
  name: "Setting",
  components: {
    TableSetting,
    FormulaSetting,
    VToolbar,
    VToolbarTitle,
    VCard,
    VTabs,
    VTabsSlider,
    VTab
  },
  data: () => ({
    tab: 0
  })
};
</script>

<style lang="scss">
.settings {
  position: absolute;
  z-index: 2;
}
</style>
