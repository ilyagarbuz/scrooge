import { getDatabase, ref, child, get, update } from "firebase/database";

export default {
  state: {
    info: {},
  },
  getters: {
    getInfo: (s) => s.info,
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
    },
    clearInfo(state) {
      state.info = {};
    },
  },
  actions: {
    async fetchInfo(context) {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(
          child(dbRef, `users/${context.getters.getUid}/info`)
        );
        await context.commit("setInfo", snapshot.val());
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    async updateInfo(context, toUpdate) {
      try {
        const dbRef = ref(getDatabase());
        const updatedInfo = { ...context.getters.getInfo, ...toUpdate };
        const updates = {};
        updates[`users/${context.getters.getUid}/info`] = updatedInfo;
        await update(dbRef, updates);
        context.commit("setInfo", updatedInfo);
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },
  },
};
