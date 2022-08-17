<template>
  <div class="col s12 m7 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">Курс валют</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Валюта</th>
              <th>Курс</th>
              <th v-if="$screen.width > 430">Дата</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cur in formatedCurrency" :key="cur.id">
              <td>{{ cur.abb }}</td>
              <td>{{ cur.rate }}</td>
              <td v-if="$screen.width > 430">{{ cur.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import dateFormat from "@/helpers/dateFormat";

export default {
  props: ["currency"],
  computed: {
    formatedCurrency() {
      const currencies = this.currency.map((cur) => {
        return {
          id: cur.Cur_ID,
          abb: cur.Cur_Abbreviation,
          rate: cur.Cur_OfficialRate,
          date: dateFormat(new Date(cur.Date), false),
        };
      });
      return currencies ? currencies : [];
    },
  },
};
</script>

<style scoped>
@media (max-width: 600px) {
  .bill-card {
    height: unset;
  }
}
</style>
