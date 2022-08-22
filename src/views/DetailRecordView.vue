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
        <div class="col s12 m7 l5">
          <div class="card" :class="[record.typeColor]">
            <div class="card-content card-content-description white-text">
              <div class="description">
                <p>Описание: {{ record.description }}</p>
                <p>Сумма: {{ record.amount }}</p>
                <p>Категория: {{ record.title || "Доходы" }}</p>

                <small>{{ record.date }}</small>
              </div>
              <div class="actions">
                <ul>
                  <li>
                    <button class="transparent">
                      <i class="material-icons white-text">create</i>
                    </button>
                  </li>
                  <li>
                    <button @click="onDelete" class="transparent">
                      <i class="material-icons white-text">delete</i>
                    </button>
                  </li>
                </ul>
                <btn-loader v-if="isAction" />
              </div>
            </div>
            <div
              v-if="record.file"
              style="padding-top: 0"
              class="card-content white-text"
            >
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
      amount: null,
      isLoading: true,
      isAction: false,
    };
  },
  methods: {
    async onDelete() {
      this.isAction = true;
      try {
        await this.$store.dispatch("deleteRecordById", {
          id: this.$route.params.id,
          type: this.$route.query.type,
        });
        await this.$store.dispatch("updateInfo", {
          bill:
            this.record.type === "outcome"
              ? this.$store.getters.getInfo.bill + this.amount
              : this.$store.getters.getInfo.bill - this.amount,
        });
        this.$router.push({ name: "history" });
        this.$message("Запись удалена успешно");
      } catch (e) {
        console.log(e);
      } finally {
        this.isAction = false;
      }
    },
  },
  async mounted() {
    try {
      const record = await this.$store.dispatch("fetchRecordById", {
        id: this.$route.params.id,
        type: this.$route.query.type,
      });
      const category = await this.$store.dispatch(
        "fetchCategoryById",
        record.categoryId
      );
      this.amount = record.amount;
      this.record = {
        ...record,
        amount: currencyFilter(record.amount),
        title: category.title,
        typeColor: record.type === "income" ? "green" : "red",
        typeText: record.type === "income" ? "Доход" : "Расход",
        date: dateFormat(new Date(record.date), true),
      };
    } catch (e) {
      this.$store.commit("setError", e);
    }

    this.isLoading = false;
  },
};
</script>

<style scoped>
.card-content-image {
  padding-top: 0;
  width: 30%;
}

.actions ul {
  display: flex;
  gap: 10px;
}

button {
  cursor: pointer;
  border: none;
}

@media (min-width: 400px) {
  .card-content-description {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
}

@media (max-width: 1000px) {
  .card-content-image {
    width: 50%;
  }
}

@media (max-width: 400px) {
  .card-content-image {
    width: 100%;
  }
}
</style>
