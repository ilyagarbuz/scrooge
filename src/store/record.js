import { getDatabase, ref, push, child, get } from "firebase/database";

export default {
  actions: {
    async createRecord(context, record) {
      try {
        const db = getDatabase();
        const uid = context.getters.getUid;
        return await push(ref(db, "users/" + uid + "/records"), record);
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },

    async fetchRecords(context) {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(
          child(dbRef, `users/${context.getters.getUid}/records`)
        );
        const recordsData = await snapshot.val();
        return recordsData
          ? Object.keys(recordsData).map((key) => ({
              ...recordsData[key],
              id: key,
            }))
          : [];
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },
    async fetchRecordById(context, id) {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(
          child(dbRef, `users/${context.getters.getUid}/records/${id}`)
        );
        const recordData = await snapshot.val();
        return recordData ? { ...recordData, id } : {};
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },
  },
};
