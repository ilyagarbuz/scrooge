<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('hide-sidebar')">
          <i
            class="material-icons black-text"
            :class="{ 'large-icon': $screen.width < 600 }"
            >dehaze</i
          >
        </a>
        <span v-if="$screen.width > 600" class="black-text">{{
          formatedDate
        }}</span>
      </div>

      <ul class="right">
        <li>
          <a
            class="dropdown-trigger black-text"
            href="#"
            data-target="dropdown"
            ref="dropdown"
          >
            <span v-if="$screen.width > 600">
              {{ userName }}
              <i class="material-icons right">arrow_drop_down</i>
            </span>
            <span v-else
              ><i class="material-icons right" style="font-size: 35px"
                >face</i
              ></span
            >
          </a>

          <ul id="dropdown" class="dropdown-content">
            <li>
              <router-link :to="{ name: 'profile' }" class="black-text">
                <i class="material-icons">account_circle</i>Профиль
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" @click.prevent="logout" class="black-text">
                <i class="material-icons">assignment_return</i>Выйти
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import M from "materialize-css";
import dateFormat from "@/helpers/dateFormat";
export default {
  data() {
    return {
      date: new Date(),
      dateInterval: null,
      dropdown: null,
    };
  },
  computed: {
    formatedDate() {
      return dateFormat(this.date, true);
    },
    userName() {
      return this.$store.getters.getInfo
        ? this.$store.getters.getInfo.name
        : "USER_NAME";
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login?message=logout");
      this.$store.commit("clearInfo");
    },
  },
  mounted() {
    this.dateInterval = setInterval(() => {
      this.date = new Date();
    }, 1000);
    this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: true,
    });
  },
  beforeUnmount() {
    clearInterval(this.dateInterval);
    if (this.dropdown && this.dropdown.destroy) this.dropdown.destroy();
  },
};
</script>

<style scoped>
@media (max-width: 600px) {
  nav ul a {
    padding: 0;
  }

  .dropdown-content li a {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dropdown-content li:not(:nth-child(2n)) {
    padding: 10px;
  }

  .dropdown-content li i {
    margin-right: 0;
  }
}
.large-icon {
  font-size: 35px;
}
</style>
