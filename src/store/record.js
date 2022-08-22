import { getDatabase, ref, push, child, get, remove } from "firebase/database";
import {
  getStorage,
  ref as stRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default {
  actions: {
    async createRecord(context, { record, type }) {
      const db = getDatabase();
      const uid = context.getters.getUid;
      try {
        if (record.file) {
          const storage = getStorage();
          const storageRef = stRef(
            storage,
            "users/" + uid + `/${record.file.name}`
          );
          await uploadBytes(storageRef, record.file);
          record = {
            ...record,
            file: await getDownloadURL(
              stRef(storage, "users/" + uid + `/${record.file.name}`)
            ),
            fileName: record.file.name,
          };
        }
        await push(ref(db, "users/" + uid + `/records/${type}`), record);
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },

    async fetchRecords(context, type) {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(
          child(dbRef, `users/${context.getters.getUid}/records/${type}`)
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
    async fetchRecordById(context, { id, type }) {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(
          child(dbRef, `users/${context.getters.getUid}/records/${type}/${id}`)
        );
        const recordData = await snapshot.val();
        return recordData ? { ...recordData, id } : {};
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },
    async deleteRecordById(context, { id, type }) {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(
          child(dbRef, `users/${context.getters.getUid}/records/${type}/${id}`)
        );
        if (snapshot.exists()) {
          const loadRecord = await snapshot.val();
          if (loadRecord.file) {
            const fileRef = stRef(
              getStorage(),
              `users/${context.getters.getUid}/${loadRecord.fileName}`
            );

            await deleteObject(fileRef);
          }
          await remove(
            ref(
              getDatabase(),
              `users/${context.getters.getUid}/records/${type}/${id}`
            )
          );
        } else {
          throw new Error();
        }
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },
  },
};
