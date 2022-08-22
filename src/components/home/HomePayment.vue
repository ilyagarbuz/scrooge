<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Пополнить счёт</h4>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="v$.title.$model"
            :class="{ invalid: v$.title.$dirty && v$.title.$invalid }"
          />
          <label for="name">Источник дохода</label>
          <span
            v-if="v$.title.$dirty && v$.title.required.$invalid"
            class="helper-text invalid"
            >Поле не должно быть пустым</span
          >
        </div>

        <div class="input-field">
          <input
            id="amount"
            type="number"
            v-model.number="v$.amount.$model"
            :class="{ invalid: v$.amount.$dirty && v$.amount.$invalid }"
          />
          <label for="amount">Сумма пополнения</label>
          <span
            v-if="v$.amount.$dirty && v$.amount.minValue.$invalid"
            class="helper-text invalid"
            >Минимальное значение {{ v$.amount.minValue.$params.min }}</span
          >
          <span
            v-else-if="v$.amount.$dirty && v$.amount.required.$invalid"
            class="helper-text invalid"
            >Поле не должно быть пустым</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          <span>
            Пополнить
            <i class="material-icons right">send</i>
          </span>
        </button>
        <btn-loader v-if="isSubmiting"></btn-loader>
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
      amount: 1,
      isSubmiting: false,
    };
  },
  validations() {
    return {
      title: { required },
      amount: { required, minValue: minValue(1) },
    };
  },
  methods: {
    async onSubmit() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }

      this.isSubmiting = true;

      try {
        await this.$store.dispatch("updateInfo", {
          bill: this.$store.getters.getInfo.bill + this.amount,
        });

        const formData = {
          title: this.title,
          type: "income",
          amount: this.amount,
          description: this.title,
          date: new Date().toJSON(),
        };
        await this.$store.dispatch("createRecord", {
          record: formData,
          type: formData.type,
        });

        this.title = "";
        this.amount = 1;
        this.v$.$reset();
        this.$message("Счёт пополнен");
      } catch (e) {
        console.log(e);
      } finally {
        this.isSubmiting = false;
      }
    },
  },
  mounted() {
    M.updateTextFields();
  },
};
</script>
