<template>
  <div class="grey darken-1 empty-layout">
    <router-view></router-view>
  </div>
</template>

<script>
import messages from "@/helpers/messages";

export default {
  computed: {
    error() {
      return this.$store.getters.error;
    },
  },
  watch: {
    error(fbError) {
      console.log(fbError.code);
      this.$error(messages[fbError.code] || "Что-то пошло не так");
    },
  },
};
</script>

<style scoped>
@media (max-width: 540px) {
  .auth-card {
    width: 320px;
  }
}
</style>
