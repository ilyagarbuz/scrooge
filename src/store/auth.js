import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";

export default {
  state: {
    user: null,
  },
  getters: {
    getUid(state) {
      return state.user ? state.user.uid : "";
    },
  },
  mutations: {
    updateCurrentUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async login(context, { email, password }) {
      try {
        await context.dispatch("logout");
        const auth = getAuth();
        await setPersistence(auth, browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },
    async logout(context) {
      try {
        await signOut(getAuth());
        context.commit("clearInfo");
      } catch (e) {
        throw new Error(e);
      }
    },
    async register(context, { email, password, name }) {
      const db = getDatabase();
      const auth = getAuth();
      try {
        await context.dispatch("logout");
        await createUserWithEmailAndPassword(auth, email, password);
        const uid = await context.getters.getUid;
        await set(ref(db, "users/" + uid + "/info"), {
          locale: "ru-RU",
          bill: 0,
          name: name,
        });
      } catch (e) {
        context.commit("setError", e);
        throw e;
      }
    },
  },
};
