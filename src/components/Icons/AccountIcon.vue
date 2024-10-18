<template>
  <el-icon v-if="!isLogin" :size="size"><span i-mdi-account></span></el-icon>
  <el-avatar v-else :size="18">
    <el-text size="small">{{ showName }}</el-text>
  </el-avatar>
</template>
<script lang="ts" setup>
defineProps({
  size: {
    type: String,
    default: "large",
  },
});
const { isLogin, username } = useAccount();
const showName = computed(() => {
  return username.value[0]?.toUpperCase() || "";
});
</script>

<style lang="scss" scoped></style>
