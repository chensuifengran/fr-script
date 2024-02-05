import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routers";
let lastPath = "";

const router = createRouter({
  history: createWebHashHistory(), //hash模式
  routes,
});

router.beforeEach((to, _from, next) => {
  lastPath = to.path;
  next();
});
export const goLastPath = () => {
  router.replace({
    path: lastPath,
  });
};
export default router;
