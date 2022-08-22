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

      <div class="input-field">
        <input
          id="amount"
          type="number"
          step="0.01"
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

      <div class="file-field input-field">
        <div class="btn">
          <span class="input-file-btn"
            >Прикрепить файл
            <i class="large material-icons">attach_file</i></span
          >
          <input ref="file" type="file" id="file" @change="onFileChange" />
        </div>
        <div class="file-path-wrapper">
          <input
            ref="fileName"
            class="file-path"
            type="text"
            :class="{
              invalid: v$.typeFile.typeValid.$invalid,
              validate: !v$.typeFile.typeValid.$invalid,
            }"
          />
        </div>
        <span class="helper-text invalid" v-if="v$.typeFile.typeValid.$invalid"
          >Формат файла должен быть .jpg или .png</span
        >
      </div>

      <button
        class="btn waves-effect waves-light"
        :disabled="isSubmiting"
        type="submit"
      >
        Создать
        <i class="material-icons right">send</i>
      </button>
      <btn-loader v-if="isSubmiting" />
    </form>
  </div>
</template>

<script>
import M from "materialize-css";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { useMeta } from "vue-meta";

const typeValid = (value) => value === "image/jpeg";

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
      amount: 1,
      description: "",
      typeFile: "image/jpeg",
      isSubmiting: false,
    };
  },
  validations() {
    return {
      amount: { required, minValue: minValue(1) },
      description: { required },
      typeFile: { typeValid },
    };
  },
  computed: {
    canCreateRecord() {
      return this.$store.getters.getInfo.bill >= this.amount;
    },
  },
  methods: {
    onFileChange() {
      this.typeFile = this.$refs.file.files[0].type;
    },
    async onSubmit() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }
      if (this.canCreateRecord) {
        this.isSubmiting = true;
        try {
          const formData = {
            categoryId: this.currentCategory,
            type: "outcome",
            amount: this.amount,
            description: this.description,
            date: new Date().toJSON(),
            file: this.$refs.file.files[0] || false,
            fileName: this.$refs.file.files[0]
              ? this.$refs.file.files[0].name
              : false,
          };
          console.log(formData);
          await this.$store.dispatch("createRecord", {
            record: formData,
            type: formData.type,
          });
          const bill = this.$store.getters.getInfo.bill - this.amount;
          await this.$store.dispatch("updateInfo", { bill });
          this.v$.$reset();
          this.$refs.file.value = "";
          this.$refs.fileName.value = "";
          this.$refs.fileName.classList.remove("valid");
          this.amount = 1;
          this.description = "";
          this.$message("Запись успешно создана");
        } catch (e) {
          console.log(e);
          throw e;
        } finally {
          this.isSubmiting = false;
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

<style scoped>
@media (max-width: 600px) {
  .file-field {
    display: flex;
    flex-direction: column;
    max-width: max-content;
  }
}
</style>
