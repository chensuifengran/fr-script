<template>
  <div class="dep-drewer">
    <el-tabs v-model="activeDrewerName" class="tabs" @tab-change="handleTabChange">
      <el-tab-pane label="缺失依赖下载" name="lackDepDownload" v-loading="contentLoading">
        <el-tabs
          tab-position="left"
          v-if="
            lackDependence &&
            (lackDependence[0]?.length ||
              lackDependence[1]?.length ||
              lackDependence[2]?.length)
          "
        >
          <el-tab-pane :label="`精简版(${lackDependence[0]?.length || 0})`">
            <template v-if="lackDependence[0].length">
              <LackItem
                v-for="item in lackDependence[0]"
                :key="0 + item.name"
                :item="item"
              />
            </template>
            <el-empty
              v-else
              description="依赖满足精简版要求，没有缺失依赖项。"
            ></el-empty>
          </el-tab-pane>
          <el-tab-pane :label="`基础版(${lackDependence[1]?.length || 0})`">
            <template v-if="lackDependence[1].length">
              <LackItem
                v-for="item in lackDependence[1]"
                :key="1 + item.name"
                :item="item"
              />
            </template>
            <el-empty
              v-else
              description="依赖满足基础版要求，没有缺失依赖项。"
            ></el-empty>
          </el-tab-pane>
          <el-tab-pane :label="`完整版(${lackDependence[2]?.length || 0})`">
            <template v-if="lackDependence[2].length">
              <LackItem
                v-for="item in lackDependence[2]"
                :key="2 + item.name"
                :item="item"
              />
            </template>
            <el-empty
              v-else
              description="依赖满足完整版要求，没有缺失依赖项。"
            ></el-empty>
          </el-tab-pane>
        </el-tabs>
        <el-empty v-else description="没有缺失依赖项。" />
      </el-tab-pane>
      <el-tab-pane label="依赖包下载" name="depPackageDownload"
        ><DepPkgDownload
          v-if="activeDrewerName === 'depPackageDownload'"
          v-loading="contentLoading"
      /></el-tab-pane>
      <el-tab-pane label="可更新依赖" name="haveUpdateDep" v-loading="contentLoading">
        <template v-if="needUpdateDepList.length">
          <LackItem
            v-for="item in needUpdateDepList"
            :key="item.name"
            :item="item"
            :currentVersion="item.currentVersion"
          />
        </template>
        <el-empty v-else description="暂无依赖需要更新，所有依赖皆为最新版。"></el-empty>
      </el-tab-pane>
      <el-tab-pane label="依赖安装" name="install"
        ><InstallDep v-if="activeDrewerName === 'install'"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
const {
  lackDependence,
  activeDrewerName,
  needUpdateDepList,
  contentLoading,
} = useDepInfo();
const handleTabChange = async (name: string | number) => {
  if (name !== "install") {
    contentLoading.value = true;
    await libUtil.checkDepUpdate();
    contentLoading.value = false;
  }
};
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
