<template>
  <div class="dep-pkg-list" v-if="depPkgList.length">
    <DepPkgItem v-for="item in depPkgList" :key="item.name" :item="item" />
  </div>
  <el-empty v-else description="暂无依赖包"></el-empty>
</template>
<script lang="ts" setup>
const { depPkgList } = useDepInfo();
</script>

<style lang="scss" scoped>
.dep-pkg-list {
  overflow: auto;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
