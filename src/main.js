import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createMetaManager } from "vue-meta";
import Paginate from "vuejs-paginate-next";
import messagePlugin from "./helpers/message.plugin";
import { initializeApp } from "firebase/app";
import AppLoader from "@/components/app/AppLoader";
import tooltipDirective from "./directives/tooltip.directive";
import "materialize-css/dist/js/materialize";
import "./registerServiceWorker";

const firebaseConfig = {
  apiKey: "AIzaSyA3JG8sJ5918wQRbScUYhag_Bhc8G8yLr0",
  authDomain: "finance-control-crm.firebaseapp.com",
  projectId: "finance-control-crm",
  storageBucket: "finance-control-crm.appspot.com",
  messagingSenderId: "587079249653",
  appId: "1:587079249653:web:c6285c58791709d51edfbc",
  databaseURL:
    "https://finance-control-crm-default-rtdb.europe-west1.firebasedatabase.app",
};

initializeApp(firebaseConfig);

createApp(App)
  .use(store)
  .use(router)
  .use(messagePlugin)
  .use(createMetaManager())
  .directive("tooltip", tooltipDirective)
  .component("AppLoader", AppLoader)
  .component("Paginate", Paginate)
  .mount("#app");
