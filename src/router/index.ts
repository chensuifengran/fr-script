import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routers";
import type { TourStepNames } from "../hooks/useTour";
let lastPath = "";

const router = createRouter({
  history: createWebHashHistory(), //hash模式
  routes,
});

router.beforeEach((to, _from, next) => {
  lastPath = to.path;
  next();
});

router.afterEach((_to, _from) => {
  const targetRouteName = router.currentRoute.value.name;
  const { currentTourName, firstTime, tourInfo, setfirstTime } = useTour();
  currentTourName.value = targetRouteName as TourStepNames;
  if (firstTime.value && firstTime.value[currentTourName.value]) {
    const isFirstTime = firstTime.value[currentTourName.value];
    if (isFirstTime && tourInfo[currentTourName.value].steps.length) {
      tourInfo[currentTourName.value].touring = true;
    }
    setfirstTime({
      ...firstTime.value,
      [currentTourName.value]: false,
    });
  }
});

export const goLastPath = () => {
  router.replace({
    path: lastPath,
  });
};
export default router;
