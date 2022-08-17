<template>
  <div>
    <AppLoader v-if="isLoading" />
    <div v-else class="app-main-layout">
      <app-navbar @hide-sidebar="toogleSidebar" />

      <app-sidebar @hide-sidebar="toogleSidebar" v-model="isSidebarOpen" />

      <main
        class="app-content"
        :class="{ full: !isSidebarOpen || $screen.width < 1180 }"
      >
        <div class="app-page">
          <router-view></router-view>
        </div>
      </main>

      <div class="fixed-action-btn" v-tooltip.left="'Создать новую запись'">
        <router-link
          class="btn-floating btn-large blue"
          :to="{ name: 'record' }"
        >
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AppNavbar from "@/components/app/AppNavbar.vue";
import AppSidebar from "@/components/app/AppSidebar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import messages from "@/helpers/messages";

export default {
  components: {
    AppNavbar,
    AppSidebar,
  },
  data() {
    return {
      isLoading: true,
      isSidebarOpen: true,
    };
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
  },
  methods: {
    toogleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
  watch: {
    error(fbError) {
      console.log(fbError.code);
      this.$error(messages[fbError.code] || "Что-то пошло не так");
    },
  },
  mounted() {
    if (this.$screen.width < 1180) this.toogleSidebar();
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        this.$store.commit("updateCurrentUser", user);

        if (
          !this.$store.getters.getInfo ||
          !Object.keys(this.$store.getters.getInfo).length
        ) {
          await this.$store.dispatch("fetchInfo");
        }

        this.isLoading = false;
      } else {
        this.$router.push("/login?message=login");
      }
    });
  },
};
</script>
