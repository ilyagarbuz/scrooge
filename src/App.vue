<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | Scrooge` : `Scrooge`
    }}</template>
  </metainfo>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { useMeta } from "vue-meta";
export default {
  setup() {
    useMeta({
      title: "",
      htmlAttrs: { lang: "ru", amp: true },
    });
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || "empty") + "-layout";
    },
  },
  components: {
    EmptyLayout,
    MainLayout,
  },
};
</script>

<style lang="scss">
@import "~materialize-css/dist/css/materialize.min.css";
@import "assets/index.css";

.input-file-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.progress {
  margin: 0.5rem 0;
}

@media (max-width: 450px) {
  .app-page {
    padding: 1.5em 1em;
  }
}
</style>
