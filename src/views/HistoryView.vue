<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <app-loader v-if="isLoading" />

    <p v-else-if="!records.length" class="center">
      Нет истории записей.
      <router-link :to="{ name: 'record' }">Добавьте запись.</router-link>
    </p>

    <section v-else>
      <div class="page-subtitle">
        <h4>Статистика расходов</h4>
      </div>
      <div class="history-chart">
        <!-- <canvas></canvas> -->
        <pie-chart :chartData="chartData" :chartOptions="chartOptions" />
      </div>

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
    const recordsOutcome = await this.$store.dispatch(
      "fetchRecords",
      "outcome"
    );
    this.records = recordsOutcome.map((record) => {
      return {
        ...record,
        title: categories.find((cat) => cat.id === record.categoryId).title,
        typeText: "Расход",
        typeColor: "red",
        date: dateFormat(new Date(record.date), true),
      };
    });
    const recordsIncome = await this.$store.dispatch("fetchRecords", "income");
    this.records = this.records.concat(
      recordsIncome.map((record) => {
        return {
          ...record,
          typeText: "Доход",
          typeColor: "green",
          date: dateFormat(new Date(record.date), true),
        };
      })
    );

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

<style scoped>
.page-link {
  cursor: pointer;
}
.page-subtitle {
  text-align: center;
}
.page-subtitle h4 {
  font-size: 1.5em;
}

.history-chart {
  margin-bottom: 60px;
}
</style>
