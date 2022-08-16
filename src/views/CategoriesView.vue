<template>
  <div>
    <div class="page-title">
      <h3>Категории расходов</h3>
    </div>
    <section>
      <app-loader v-if="isLoading" />
      <div class="row" v-else>
        <category-create @created="addNewCategory" />

        <category-edit
          v-if="categories.length"
          @updated="updateCategory"
          :categories="categories"
          :key="categories.length + updateCount"
        />
        <p v-else class="center">Категорий пока нет.</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from "@/components/categories/CategoryCreate.vue";
import CategoryEdit from "@/components/categories/CategoryEdit.vue";
import { useMeta } from "vue-meta";

export default {
  setup() {
    useMeta({ title: "Категории" });
  },
  components: {
    CategoryCreate,
    CategoryEdit,
  },
  data() {
    return {
      categories: [],
      isLoading: true,
      updateCount: 0,
    };
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
    },
    updateCategory(categoryData) {
      const idx = this.categories.findIndex((c) => c.id === categoryData.id);
      this.categories[idx].title = categoryData.title;
      this.categories[idx].limit = categoryData.limit;
      this.updateCount++;
    },
  },

  async mounted() {
    try {
      this.categories = await this.$store.dispatch("fetchCategories");
      this.isLoading = false;
    } catch (e) {
      console.log(e);
    }
  },
};
</script>
