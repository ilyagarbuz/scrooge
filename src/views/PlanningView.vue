<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>
        {{ $store.getters.getInfo.bill }}
        <span style="margin-right: 5px; font-size: 13px"> BYN</span>
      </h4>
    </div>

    <app-loader v-if="isLoading" />

    <p v-else-if="!categories.length" class="center">
      Пока что у вас нет категорий.
      <router-link :to="{ name: 'categories' }"
        >Добавьте категорию.</router-link
      >
    </p>

    <section v-else>
      <div v-for="category in planningCategories" :key="category.id">
        <p>
          <strong>{{ category.title }}:</strong>
          {{ category.spend }} из {{ category.limit }}
        </p>
        <div class="progress" v-tooltip="category.tooltip">
          <div
            class="determinate"
            :class="[category.progressColor]"
            :style="{ width: category.progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";

export default {
  setup() {
    useMeta({ title: "Планирование" });
  },
  data() {
    return {
      isLoading: true,
      records: [],
      categories: [],
      planningCategories: [],
    };
  },

  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    this.categories = await this.$store.dispatch("fetchCategories");
    this.planningCategories = this.categories.map((cat) => {
      const spend = this.records
        .filter((rec) => rec.categoryId === cat.id)
        .filter((rec) => rec.type === "outcome")
        .reduce((total, record) => {
          return total + record.amount;
        }, 0);

      const percent = (100 * spend) / cat.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor =
        percent < 60 ? "green" : percent < 100 ? "yellow" : "red";

      const residual = cat.limit - spend;
      const tooltip = `${
        residual < 0 ? "Превышение на" : "Осталось"
      } ${Math.abs(residual)}`;
      return {
        ...cat,
        spend,
        progressPercent,
        progressColor,
        tooltip,
      };
    });
    this.isLoading = false;
  },
};
</script>