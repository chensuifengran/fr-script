import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routers";
let lastPath = "";

const router = createRouter({
  history: createWebHashHistory(), //hash模式
  routes,
});

router.beforeEach((_to, from, next) => {
  // to and from are both route objects. must call `next`.
  lastPath = from.path;
  next();
});
export const goLastPath = () => {
  router.replace({
    path: lastPath,
  });
};
export default router;
