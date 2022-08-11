<template>
  <form class="card auth-card" @submit.prevent="onSubmit">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model="v$.form.email.$model"
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
          v-model="v$.form.password.$model"
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
          >Не менее {{ v$.form.password.minLength.$params.min }} символов</small
        >
      </div>
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model="v$.form.name.$model"
          :class="{
            invalid: v$.form.name.$dirty && v$.form.name.$errors.length,
          }"
        />
        <label for="name">Имя</label>
        <small
          class="helper-text invalid"
          v-if="v$.form.name.$dirty && v$.form.name.required.$invalid"
          >Введите имя</small
        >
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="v$.form.agree.$model" />
          <span>С правилами согласен</span>
          <small
            style="display: block"
            class="helper-text invalid"
            v-if="v$.form.agree.$dirty && v$.form.agree.checked.$invalid"
            >Согласитесь с правилами</small
          >
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Зарегистрироваться
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Уже есть аккаунт?
        <router-link :to="{ name: 'login' }">Войти!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { useMeta } from "vue-meta";

export default {
  setup() {
    useMeta({ title: "Регистрация" });
    return { v$: useVuelidate() };
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
        name: "",
        agree: false,
      },
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
        password: { required, minLength: minLength(6) },
        name: { required },
        agree: { checked: (v) => v },
      },
    };
  },
  methods: {
    async onSubmit() {
      if (this.v$.form.$invalid) {
        this.v$.$touch();
        return;
      }

      const formData = {
        email: this.form.email,
        password: this.form.password,
        name: this.form.name,
      };

      try {
        await this.$store.dispatch("register", formData);
        this.$router.push({ name: "home" });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
