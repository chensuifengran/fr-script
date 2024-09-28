/**
 * 为true时显示侧边栏
 */
const isMainWindow = ref(true);
/**
 * 侧边栏菜单key,侧边栏中的路由跳转可通过改变menuKey来切换显示
 */
const menuKey = ref(1);
const appWidth = ref(IS_PLAYGROUND_ENV ? "960px" : "100%");
const appHeight = ref(IS_PLAYGROUND_ENV ? "600px" : "100%");
const unmaximizeSize = () => {
  if (!IS_PLAYGROUND_ENV) {
    console.warn("此方法只能在playground环境下使用");
    return;
  }
  appWidth.value = "960px";
  appHeight.value = "600px";
};
const maximizeSize = () => {
  if (!IS_PLAYGROUND_ENV) {
    console.warn("此方法只能在playground环境下使用");
    return;
  }
  appWidth.value = "100%";
  appHeight.value = "100%";
};
export const useAppLayout = () => {
  return {
    isMainWindow,
    menuKey,
    appWidth,
    appHeight,
    unmaximizeSize,
    maximizeSize,
  };
};
