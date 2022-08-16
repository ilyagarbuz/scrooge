<template>
  <app-loader v-if="isLoading" />

  <p v-else-if="!record" class="center">Такой записи не существует.</p>

  <div v-else>
    <div>
      <div class="breadcrumb-wrap">
        <router-link :to="{ name: 'history' }" class="breadcrumb"
          >История</router-link
        >
        <a class="breadcrumb"> {{ record.typeText }} </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="[record.typeColor]">
            <div class="card-content white-text">
              <p>Описание: {{ record.description }}</p>
              <p>Сумма: {{ record.amount }}</p>
              <p>Категория: {{ record.title || "Доходы" }}</p>

              <small>{{ record.date }}</small>
            </div>
            <div v-if="record.file" class="card-content white-text">
              <img class="card-content-image" :src="record.file" alt="bill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppLoader from "@/components/app/AppLoader.vue";
import dateFormat from "@/helpers/dateFormat";
import { useMeta } from "vue-meta";
import currencyFilter from "@/helpers/currency.filter";

export default {
  setup() {
    useMeta({ title: "Запись" });
  },
  components: { AppLoader },
  data() {
    return {
      record: null,
      isLoading: true,
    };
  },
  async mounted() {
    const record = await this.$store.dispatch("fetchRecordById", {
      id: this.$route.params.id,
      type: this.$route.query.type,
    });
    const category = await this.$store.dispatch(
      "fetchCategoryById",
      record.categoryId
    );
    this.record = {
      ...record,
      amount: currencyFilter(record.amount),
      title: category.title,
      typeColor: record.type === "income" ? "green" : "red",
      typeText: record.type === "income" ? "Доход" : "Расход",
      date: dateFormat(new Date(record.date), true),
    };

    this.isLoading = false;
  },
};
</script>

<style scoped>
.card-content-image {
  width: 100%;
}
</style>
