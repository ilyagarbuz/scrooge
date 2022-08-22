<template>
  <form class="card auth-card" @submit.prevent="onSubmit">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="v$.form.email.$model"
          :class="{
            invalid: v$.form.email.$dirty && v$.form.email.$errors.length,
          }"
        />
        <label for="email">Email</label>
        <small
          class="helper-text invalid"
          v-if="v$.form.email.$dirty && v$.form.email.required.$invalid"
          >Поле не должно быть пустым</small
        >
        <small
          class="helper-text invalid"
          v-else-if="v$.form.email.$dirty && v$.form.email.email.$invalid"
          >Введите корректный e-mail</small
        >
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model.trim="v$.form.password.$model"
          :class="{
            invalid: v$.form.password.$dirty && v$.form.password.$errors.length,
          }"
        />
        <label for="password">Пароль</label>
        <small
          class="helper-text invalid"
          v-if="v$.form.password.$dirty && v$.form.password.required.$invalid"
          >Поле не должно быть пустым</small
        >
        <small
          class="helper-text invalid"
          v-else-if="
            v$.form.password.$dirty && v$.form.password.minLength.$invalid
          "
        >
          Не менее {{ v$.form.password.minLength.$params.min }} символов</small
        >
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          :disabled="isLoadingButton"
          type="submit"
        >
          <span v-if="!isLoadingButton">
            Войти <i class="material-icons right login-icon">send</i></span
          >
          <btn-loader v-else />
        </button>
      </div>

      <p class="center">
        Нет аккаунта?
        <router-link :to="{ name: 'register' }">Зарегистрироваться</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import messaegs from "@/helpers/messages";
import { useMeta } from "vue-meta";

export default {
  setup() {
    useMeta({ title: "Вход" });
    return { v$: useVuelidate() };
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      isLoadingButton: false,
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
        password: { required, minLength: minLength(6) },
      },
    };
  },
  methods: {
    async onSubmit() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }

      this.isLoadingButton = true;

      const formData = {
        email: this.form.email,
        password: this.form.password,
      };

      try {
        await this.$store.dispatch("login", formData);
        this.$router.push({ name: "home" });
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoadingButton = false;
      }
    },
  },
  mounted() {
    if (messaegs[this.$route.query.message])
      this.$message(messaegs[this.$route.query.message]);
  },
};
</script>

<style scoped>
@media (max-width: 540px) {
  .login-icon {
    margin-right: 0;
  }
}
</style>
