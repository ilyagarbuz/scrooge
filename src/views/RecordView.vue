<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>
    <app-loader v-if="isLoading" />
    <p v-else-if="!categories.length" class="center">
      Пока что у вас нет категорий.
      <router-link :to="{ name: 'categories' }"
        >Добавьте категорию.</router-link
      >
    </p>
    <form v-else class="form" @submit.prevent="onSubmit">
      <div class="input-field">
        <select ref="select" v-model="currentCategory">
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.title }}
          </option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="v$.amount.$model"
          :class="{ invalid: v$.amount.$dirty && v$.amount.$invalid }"
        />
        <label for="amount">Сумма</label>
        <span
          class="helper-text invalid"
          v-if="v$.amount.$dirty && v$.amount.required.$invalid"
          >Поле не должно быть пустым</span
        >
        <span
          class="helper-text invalid"
          v-else-if="v$.amount.$dirty && v$.amount.minValue.$invalid"
          >Минимальное значение{{ v$.amount.minValue.$params.min }}</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model.trim="v$.description.$model"
          :class="{ invalid: v$.description.$dirty && v$.description.$invalid }"
        />
        <label for="description">Описание</label>
        <span
          class="helper-text invalid"
          v-if="v$.description.$dirty && v$.description.required.$invalid"
          >Поле не должно быть пустым</span
        >
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import M from "materialize-css";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { useMeta } from "vue-meta";

export default {
  setup() {
    useMeta({ title: "Новая запись" });
    return { v$: useVuelidate() };
  },
  data() {
    return {
      categories: [],
      isLoading: true,
      select: null,
      currentCategory: null,
      type: "outcome",
      amount: 1,
      description: "",
    };
  },
  validations() {
    return {
      amount: { required, minValue: minValue(1) },
      description: { required },
    };
  },
  computed: {
    canCreateRecord() {
      if (this.type === "income") return true;
      return this.$store.getters.getInfo.bill >= this.amount;
    },
  },
  methods: {
    async onSubmit() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }

      if (this.canCreateRecord) {
        try {
          const formData = {
            categoryId: this.currentCategory,
            type: this.type,
            amount: this.amount,
            description: this.description,
            date: new Date().toJSON(),
          };
          await this.$store.dispatch("createRecord", formData);
          const bill =
            this.type === "income"
              ? this.$store.getters.getInfo.bill + this.amount
              : this.$store.getters.getInfo.bill - this.amount;
          await this.$store.dispatch("updateInfo", { bill });
          this.v$.$reset();
          this.amount = 1;
          this.description = "";
          this.$message("Запись успешно создана");
        } catch (e) {
          console.log(e);
          throw e;
        }
      } else {
        this.$message(
          `Недостаточно средств на счёте (${
            this.amount - this.$store.getters.getInfo.bill
          })`
        );
      }
    },
  },
  async mounted() {
    try {
      this.categories = await this.$store.dispatch("fetchCategories");
      this.isLoading = false;

      if (this.categories.length) {
        this.currentCategory = this.categories[0].id;
      }

      setTimeout(() => {
        this.select = M.FormSelect.init(this.$refs.select);
        M.updateTextFields();
      }, 0);
    } catch (e) {
      console.log(e);
    }
  },
  unmounted() {
    if (this.select && this.select.destroyed) {
      this.select.destroyed();
    }
  },
};
</script>
