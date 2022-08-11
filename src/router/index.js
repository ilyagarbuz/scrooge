import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    meta: {
      layout: "empty",
    },
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/categories",
    name: "categories",
    meta: {
      layout: "main",
      auth: true,
    },
    component: () => import("@/views/CategoriesView.vue"),
  },
  {
    path: "/detail-record/:id",
    name: "detail-record",
    meta: {
      layout: "main",
      auth: true,
    },
    component: () => import("@/views/DetailRecordView.vue"),
  },
  {
    path: "/history",
    name: "history",
    meta: {
      layout: "main",
      auth: true,
    },
    component: () => import("@/views/HistoryView.vue"),
  },
  {
    path: "/",
    name: "home",
    meta: {
      layout: "main",
      auth: true,
    },
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/planning",
    name: "planning",
    meta: {
      layout: "main",
      auth: true,
    },
    component: () => import("@/views/PlanningView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    meta: {
      layout: "main",
      auth: true,
    },
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    path: "/record",
    name: "record",
    meta: {
      layout: "main",
      auth: true,
    },
    component: () => import("@/views/RecordView.vue"),
  },
  {
    path: "/register",
    name: "register",
    meta: {
      layout: "empty",
    },
    component: () => import("@/views/RegisterView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
