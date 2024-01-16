<template>
  <div class="dep-drewer">
    <el-tabs v-model="activeDrewerName" class="tabs">
      <el-tab-pane label="缺失依赖下载" name="lackDepDownload">
        <el-tabs tab-position="left">
          <el-tab-pane :label="`精简版(${lackDependence[0]?.length || 0})`">
            <LackItem
              v-for="item in lackDependence[0]"
              :key="0 + item.name"
              :item="item"
            />
          </el-tab-pane>
          <el-tab-pane :label="`基础版(${lackDependence[1]?.length || 0})`">
            <LackItem
              v-for="item in lackDependence[1]"
              :key="1 + item.name"
              :item="item"
            />
          </el-tab-pane>
          <el-tab-pane :label="`完整版(${lackDependence[2]?.length || 0})`">
            <LackItem
              v-for="item in lackDependence[2]"
              :key="2 + item.name"
              :item="item"
            />
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="完整依赖下载" name="depPackageDownload"
        ><FullDepDownload v-if="activeDrewerName === 'depPackageDownload'"
      /></el-tab-pane>
      <el-tab-pane label="依赖安装" name="install"
        ><InstallDep v-if="activeDrewerName === 'install'"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
const { lackDependence, activeDrewerName } = useDepInfo();
</script>

<style lang="scss" scoped>
.dep-drewer,
.tabs {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
<style lang="scss">
.tabs {
  .el-tabs__content {
    flex: 1;
    position: relative;
    .el-tab-pane {
      height: 100%;
      width: 100%;
      position: relative;
    }
  }
}
</style>
