/**
 * 为true时显示侧边栏
 */
const isMainWindow = ref(true);
/**
 * 侧边栏菜单key,侧边栏中的路由跳转可通过改变menuKey来切换显示
 */
const menuKey = ref(1);
export const useAppLayout = () => {
  return {
    isMainWindow,
    menuKey
  }
};