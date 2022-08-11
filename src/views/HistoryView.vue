<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <!-- <canvas></canvas> -->
      <pie-chart :chartData="chartData" :chartOptions="chartOptions" />
    </div>

    <app-loader v-if="isLoading" />

    <p v-else-if="!records.length" class="center">
      Нет истории записей.
      <router-link :to="{ name: 'record' }">Добавьте запись.</router-link>
    </p>

    <section v-else>
      <history-table :records="currentItems" />

      <paginate
        v-model="page"
        :page-count="pagesCount"
        :click-handler="onPaginate"
        :prev-text="'Назад'"
        :next-text="'Вперед'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/history/HistoryTable.vue";
import PieChart from "@/components/PieChart.vue";
import dateFormat from "@/helpers/dateFormat";
import pagination from "@/mixins/pagination.mixin";
import { useMeta } from "vue-meta";

export default {
  setup() {
    useMeta({ title: "История записей" });
  },
  components: {
    HistoryTable,
    PieChart,
  },
  mixins: [pagination],
  data() {
    return {
      records: [],
      isLoading: true,
      chartData: {},
      chartOptions: {},
    };
  },
  async mounted() {
    const categories = await this.$store.dispatch("fetchCategories");
    const records = await this.$store.dispatch("fetchRecords");
    this.records = records.map((record) => {
      return {
        ...record,
        title: categories.find((cat) => cat.id === record.categoryId).title,
        typeText: record.type === "income" ? "Доход" : "Расход",
        typeColor: record.type === "income" ? "green" : "red",
        date: dateFormat(new Date(record.date), true),
      };
    });

    this.chartData = {
      labels: categories.map((cat) => cat.title),
      datasets: [
        {
          backgroundColor: [
            "#41B883",
            "#E46651",
            "#00D8FF",
            "#DD1B16",
            "#DD1B20",
            "#00D3FF",
          ],
          data: categories.map((cat) =>
            this.records.reduce((total, r) => {
              if (r.categoryId === cat.id && r.type === "outcome") {
                total = total + r.amount;
              }
              return total;
            }, 0)
          ),
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    this.setupPagination(this.records);

    this.isLoading = false;
  },
};
</script>

<style>
.page-link {
  cursor: pointer;
}
</style>
