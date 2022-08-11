import {
  getDatabase,
  set,
  ref,
  push,
  child,
  get,
  update,
} from "firebase/database";

export default {
  actions: {
    async createCategory(context, { title, limit }) {
      try {
        const db = getDatabase();
        const uid = context.getters.getUid;
        const categoriesList = await ref(db, "users/" + uid + "/categories");
        const newCategory = await push(categoriesList);
        await set(newCategory, {
          title,
          limit,
        });
        return { title, limit, id: newCategory.key };
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },

    async fetchCategories(context) {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(
          child(dbRef, `users/${context.getters.getUid}/categories`)
        );
        const categoriesData = await snapshot.val();
        return categoriesData
          ? Object.keys(categoriesData).map((key) => ({
              ...categoriesData[key],
              id: key,
            }))
          : [];
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },

    async fetchCategoryById(context, id) {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(
          child(dbRef, `users/${context.getters.getUid}/categories/${id}`)
        );
        const categoryData = await snapshot.val();
        return categoryData ? { ...categoryData, id } : {};
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },

    async updateCategories(context, { title, limit, id }) {
      try {
        const dbRef = ref(getDatabase());
        const categoriesData = {
          title,
          limit,
        };
        const updates = {};
        updates[`users/${context.getters.getUid}/categories/${id}`] =
          categoriesData;
        await update(dbRef, updates);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
};
