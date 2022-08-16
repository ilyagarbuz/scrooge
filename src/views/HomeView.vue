<template>
  <div>
    <div class="page-title">
      <h3>Счет</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <AppLoader v-if="isLoading" />

    <div v-else class="div">
      <div class="row">
        <home-bill :currency="currency" />

        <home-currency :currency="currency" />
      </div>

      <div class="row">
        <home-payment />
      </div>
    </div>
  </div>
</template>

<script>
import HomeBill from "@/components/home/HomeBill.vue";
import HomeCurrency from "@/components/home/HomeCurrency.vue";
import HomePayment from "@/components/home/HomePayment.vue";
import { useMeta } from "vue-meta";

export default {
  setup() {
    useMeta({ title: "Счёт" });
  },
  components: {
    HomeBill,
    HomeCurrency,
    HomePayment,
  },
  data() {
    return {
      isLoading: true,
      currency: null,
    };
  },
  methods: {
    async fetchCurrency() {
      const response = await fetch(
        "https://www.nbrb.by/api/exrates/rates?periodicity=0"
      );

      const data = await response.json();
      this.currency = data.filter(
        (cur) => cur.Cur_ID === 431 || cur.Cur_ID === 451
      );
    },

    async refresh() {
      this.isLoading = true;
      await this.fetchCurrency();
      this.isLoading = false;
    },
  },
  async mounted() {
    await this.fetchCurrency();
    this.isLoading = false;
  },
};
</script>
