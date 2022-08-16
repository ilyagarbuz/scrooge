<template>
  <div class="page-subtitle">
    <h4>История счёта</h4>
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Сумма</th>
        <th>Дата</th>
        <th>Категория</th>
        <th>Тип</th>
        <th>Открыть</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, index) in formatedRecords" :key="record.id">
        <td>{{ index + 1 }}</td>
        <td>{{ record.amount }}</td>
        <td>{{ record.date }}</td>
        <td>{{ record.title }}</td>
        <td>
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
</style>
