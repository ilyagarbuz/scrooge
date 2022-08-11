<template>
  <div>
    <div class="page-title">
      <h3>Профиль</h3>
    </div>

    <form class="form" @submit.prevent="onSubmit">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="v$.name.$model"
          :class="{ invalid: v$.name.$dirty && v$.name.$invalid }"
        />
        <label for="description">Имя</label>
        <span
          class="helper-text invalid"
          v-if="v$.name.$dirty && v$.name.$invalid"
          >Введите имя</span
        >
      </div>

      <!-- <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale" />
          <span class="lever"></span>
          Русский
        </label>
      </div> -->

      <button class="btn waves-effect waves-light" type="submit">
        Обновить
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import M from "materialize-css";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useMeta } from "vue-meta";

export default {
  setup() {
    useMeta({ title: "Профиль" });
    return { v$: useVuelidate() };
  },
  data() {
    return {
      name: this.$store.getters.getInfo.name,
      isRuLocale: this.$store.getters.getInfo.locale === "ru-RU",
    };
  },
  validations() {
    return {
      name: { required },
    };
  },
  methods: {
    async onSubmit() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }

      try {
        await this.$store.dispatch("updateInfo", {
          name: this.name,
          locale: this.isLocale ? "ru-RU" : "en-US",
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    setTimeout(() => {
      M.updateTextFields();
    });
  },
};
</script>
