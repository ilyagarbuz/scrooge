<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="v$.title.$model"
            :class="{ invalid: v$.title.$dirty && v$.title.$invalid }"
          />
          <label for="name">Название</label>
          <span
            v-if="v$.title.$dirty && v$.title.required.$invalid"
            class="helper-text invalid"
            >Введите название категории</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="v$.limit.$model"
            :class="{ invalid: v$.limit.$dirty && v$.limit.$invalid }"
          />
          <label for="limit">Лимит</label>
          <span
            v-if="v$.limit.$dirty && v$.limit.minValue.$invalid"
            class="helper-text invalid"
            >Минимальное значение {{ v$.limit.minValue.$params.min }}</span
          >
          <span
            v-else-if="v$.limit.$dirty && v$.limit.required.$invalid"
            class="helper-text invalid"
            >Поле не должно быть пустым</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import M from "materialize-css";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      title: "",
      limit: 1,
    };
  },
  validations() {
    return {
      title: { required },
      limit: { required, minValue: minValue(1) },
    };
  },
  methods: {
    async onSubmit() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }

      try {
        const category = await this.$store.dispatch("createCategory", {
          title: this.title,
          limit: this.limit,
        });

        this.title = "";
        this.limit = 1;
        this.v$.$reset();
        this.$message("Категория создана");
        this.$emit("created", category);
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    M.updateTextFields();
  },
};
</script>
