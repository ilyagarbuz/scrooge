<template>
  <div class="page-subtitle">
    <h4>История счёта</h4>
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Сумма</th>
        <th v-if="$screen.width > 400">Дата</th>
        <th v-if="$screen.width > 680">Категория</th>
        <th v-if="$screen.width > 680">Тип</th>
        <th>Открыть</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, index) in formatedRecords" :key="record.id">
        <td>{{ index + 1 }}</td>
        <td v-if="record.type === 'outcome'">- {{ record.amount }}</td>
        <td v-else>+ {{ record.amount }}</td>
        <td v-if="$screen.width > 400">{{ record.date }}</td>
        <td v-if="$screen.width > 680">{{ record.title }}</td>
        <td v-if="$screen.width > 680">
          <span class="white-text badge" :class="[record.typeColor]">{{
            record.typeText
          }}</span>
        </td>
        <td>
          <button
            class="btn-small btn"
            @click="
              $router.push({
                name: 'detail-record',
                params: { id: record.id },
                query: { type: record.type },
              })
            "
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import currencyFilter from "@/helpers/currency.filter";
export default {
  props: ["records"],
  computed: {
    formatedRecords() {
      return this.records.map((rec) => {
        return {
          ...rec,
          amount: currencyFilter(rec.amount),
        };
      });
    },
  },
};
</script>

<style scoped>
.page-subtitle {
  text-align: center;
}
.page-subtitle h4 {
  font-size: 1.5em;
}

@media (max-width: 400px) {
  td,
  th {
    text-align: center;
  }
}
</style>
