import { useDark } from "@vueuse/core";

const borderRadius = ref("10px");
const appOpacity = ref(1);
const isDark = useDark();
/**
 * 全局变换，目前用于悬浮窗口自动吸附的动画切换
 */
const appTransform = ref('none');
/**
 * 边框颜色
 */
const borderColor = computed(() => {
  return isDark.value ? "#ffffff33" : "#00000033" ;
});
/**
 * 侧边栏背景
 */
const appAsideBgColor = computed(() => {
  return isDark.value ? "#272727" : "#f6f6f6";
});
/**
 * 主题背景
 */
const appBackground = computed(() => {
  return isDark.value ? "#000" : "#fff";
});
/**
 * 相反的主题背景颜色
 */
const oppositeBgColor = computed(() => {
  if (appAsideBgColor?.value) {
    return appAsideBgColor.value === "#272727" ? "#f6f6f6" : "#272727";
  } else {
    return "#f6f6f6";
  }
});
/**
 * 相反主题背景颜色，a通道值为33
 */
const oppositeBgColorOpacity33 = computed(() => {
  if (appAsideBgColor?.value) {
    return appAsideBgColor.value === "#272727" ? "#f6f6f633" : "#27272733";
  } else {
    return "#f6f6f633";
  }
});
export const useAppTheme = () => {
  return {
    borderRadius,
    appOpacity,
    borderColor,
    appTransform,
    isDark,
    appAsideBgColor,
    appBackground,
    oppositeBgColor,
    oppositeBgColorOpacity33
  };
};
