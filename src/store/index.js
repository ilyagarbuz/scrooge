import { createStore } from "vuex";
import auth from "./auth";
import info from "./info";
import category from "./category";
import record from "./record";

export default createStore({
  state: {
    error: null,
  },
  getters: {
    error(state) {
      return state.error;
    },
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {},
  modules: {
    auth,
    info,
    category,
    record,
  },
});
