<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Редактировать</h4>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="input-field">
          <select ref="select" v-model="currentCategory">
            <option
              v-for="category of categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.title }}
            </option>
          </select>
          <label>Выберите категорию</label>
        </div>

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
          Обновить
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
  props: ["categories"],
  data() {
    return {
      select: null,
      title: "",
      limit: 1,
      currentCategory: null,
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
      try {
        const categoriesData = {
          title: this.title,
          limit: this.limit,
          id: this.currentCategory,
        };
        await this.$store.dispatch("updateCategories", categoriesData);
        this.$emit("updated", categoriesData);
        this.$message("Категория успешно обновлена");
      } catch (e) {
        console.log(e);
      }
    },
  },
  watch: {
    currentCategory() {
      const { title, limit } = this.categories.find(
        (c) => c.id === this.currentCategory
      );

      this.title = title;
      this.limit = limit;
    },
  },
  created() {
    this.currentCategory = this.categories[0].id;
    this.limit = this.categories[0].limit;
    this.title = this.categories[0].title;
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select);
    M.updateTextFields();
  },
  unmounted() {
    if (this.select && this.select.destroyed) {
      this.select.destroyed();
    }
  },
};
</script>
