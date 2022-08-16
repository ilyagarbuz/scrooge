<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">Счет в валюте</span>

        <p class="currency-line">
          <span>{{ mainBill }} </span>
        </p>
        <p class="currency-line" v-for="bill in bills" :key="bill.id">
          <span>{{ bill.count }} </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import currencyFilter from "@/helpers/currency.filter";
export default {
  props: ["currency"],
  computed: {
    mainBill() {
      return currencyFilter(this.$store.getters.getInfo.bill);
    },
    bills() {
      return this.currency.map((cur) => {
        return {
          id: cur.Cur_ID,
          abb: cur.Cur_Abbreviation,
          count: currencyFilter(
            this.$store.getters.getInfo.bill / cur.Cur_OfficialRate,
            cur.Cur_Abbreviation
          ),
        };
      });
    },
  },
};
</script>

<style lang="css">
.currency-line {
  display: flow-root;
}
</style>
