<template>
  <div class="tab-control-lists">
    <a
      class="tab-item"
      @click="onChTab(tabitem.tabName)"
      href="javascript:void(false)"
      v-for="tabitem in tabLists"
      :key="tabitem.tabName"
      :class="{ activeTabClass: active == tabitem.tabName }"
    >
      {{ tabitem.tabStr }}
    </a>
  </div>
</template>

<script>
export default {
  name: "tabControlCpn",
  props: {
    tabLists: {
      type: Array,
      default() {
        return [];
      },
    },
    active: {
      type: String,
      default() {
        return "talk";
      },
    },
  },
  methods: {
    onChTab(type) {
      this.$emit("chtab", type);
    },
  },
};
</script>

<style scoped>
.tab-control-lists {
  display: flex;
  text-align: center;
}

.tab-control-lists a.tab-item {
  flex: 1;

  margin: 0.4em;
  padding: 0.4em;
}

.tab-control-lists a.tab-item:first-child {
  margin-right: 0;
}
.tab-control-lists a.activeTabClass {
  color: #000;
  border-bottom: 1px solid red;
}
</style>