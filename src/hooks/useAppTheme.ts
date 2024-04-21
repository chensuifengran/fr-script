const borderRadius = ref("10px");
const appOpacity = ref(1);
const isDark = useDark({});
const appTransform = ref('none');
const borderColor = computed(() => {
  return isDark.value ? "#ffffff33" : "#00000033" ;
});
export const useAppTheme = () => {
  return {
    borderRadius,
    appOpacity,
    borderColor,
    appTransform
  };
};
