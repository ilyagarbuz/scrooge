<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">Счет в валюте</span>

        <p class="currency-line">
          <span>{{ this.$store.getters.getInfo.bill }} </span
          ><span style="margin-right: 5px; font-size: 13px"> BYN</span>
        </p>
        <p class="currency-line" v-for="bill in bills" :key="bill.id">
          <span>{{ bill.count.toFixed(2) }} </span
          ><span style="margin-left: 5px; font-size: 13px">
            {{ bill.abb }}</span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currency"],
  computed: {
    bills() {
      return this.currency.map((cur) => {
        return {
          id: cur.Cur_ID,
          abb: cur.Cur_Abbreviation,
          count: this.$store.getters.getInfo.bill / cur.Cur_OfficialRate,
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
