<template>
  <div class="install-dep" ref="contentRef">
    <div class="content">
      <div class="info" v-if="!selectedDeps.length && installInfo.installed">
        <div>
          安装成功：<el-tag type="success" size="small">{{ installInfo.success }}</el-tag>
        </div>
        <div>
          安装失败：<el-tag type="danger" size="small">{{ installInfo.fail }}</el-tag>
        </div>
        <div v-if="installInfo.failLabel.length">安装失败的依赖名：</div>
        <el-tag v-for="f in installInfo.failLabel" :key="f" type="info">{{ f }}</el-tag>
      </div>
      <div v-else-if="!selectedDeps.length && !installInfo.installed">
        <el-empty description="暂无安装任务"></el-empty>
      </div>
      <div v-if="selectedDeps.length">安装任务队列：</div>
      <el-tag
        v-for="tag in selectedDeps"
        :key="tag.path"
        class="dep-tag"
        closable
        type="info"
        @close="removeDep(tag.path)"
      >
        {{ tag.label }}
      </el-tag>
    </div>
    <div class="btns" v-loading="installInfo.loading" element-loading-text="安装中">
      <el-button class="clear-btn" @click="clear" v-if="selectedDeps.length"
        >清空列表</el-button
      >
      <el-button class="select-btn" @click="selectDeps">选择本地依赖文件</el-button>
      <el-button
        class="install-btn"
        @click="install"
        type="primary"
        :disabled="!selectedDeps.length"
        >安装{{ selectedDeps.length ? `(${selectedDeps.length})` : "" }}</el-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
const selectedDeps = ref<
  {
    label: string;
    path: string;
  }[]
>([]);
const contentRef = ref<HTMLElement>();
const { allLibsName } = useDepInfo();
const contentMaxHeight = ref("auto");
const installInfo = reactive({
  success: 0,
  fail: 0,
  failLabel: <string[]>[],
  installed: false,
  loading: false,
});
//当组件出现在页面上时，计算content的最大高度
onMounted(async () => {
  await nextTick();
  const { height } = contentRef.value!.getBoundingClientRect();
  contentMaxHeight.value = `${height}px`;
});
const clear = () => {
  selectedDeps.value = [];
};
const selectDeps = async () => {
  const paths = (await pathUtils.selectFile(true)) as string[] | undefined;

  if (paths) {
    const currentVal = selectedDeps.value.map((item) => item.path);
    const res = [...new Set([...currentVal, ...paths])]
      .map((path) => {
        return {
          path,
          label: path.split("\\")[path.split("\\").length - 1],
        };
      })
      .filter((item) => {
        const isOk = allLibsName.value.find((lib) => {
          const libNames = lib.split("->");
          return libNames.find((l) => {
            return l.includes(item.label);
          });
        });
        return isOk;
      });
    if (selectedDeps.value.length + paths.length !== res.length) {
      ElNotification({
        title: "提示",
        message: "所选的部分依赖已在列表中或者无效，已自动过滤",
        type: "warning",
        position: "bottom-right",
      });
    }
    //如果新加入的依赖存在base_dep_pkg.7z则判断是否存在simple_dep_pkg.7z，若存在则删除simple_dep_pkg.7z
    const baseDep = res.find((item) => item.label.includes("base_dep_pkg.7z"));
    if (baseDep) {
      const simpleDep = res.find((item) => item.label.includes("simple_dep_pkg.7z"));
      if (simpleDep) {
        res.splice(res.indexOf(simpleDep), 1);
        ElNotification({
          title: "提示",
          message: "已选择普通版依赖包，已将精简版依赖包移除。",
          type: "info",
          position: "bottom-right",
        });
      }
    }
    selectedDeps.value = res;
  }
};
const removeDep = (tag: string) => {
  selectedDeps.value = selectedDeps.value.filter((item) => item.path !== tag);
};
const install = async () => {
  installInfo.loading = true;
  const failResult: string[] = [];
  installInfo.success = 0;
  installInfo.fail = 0;
  installInfo.failLabel = [];
  const copyArr = selectedDeps.value.slice(0);
  for (let i = 0; i < copyArr.length; i++) {
    const dep = selectedDeps.value.pop();
    if (dep) {
      const res = await libUtil.installDep(dep);
      if (!res) {
        failResult.push(dep.label);
        installInfo.fail++;
      } else {
        installInfo.success++;
      }
    }
  }
  installInfo.failLabel = failResult;
  installInfo.installed = true;
  ElNotification({
    title: "提示",
    message: "安装完成",
    type: "success",
    position: "bottom-right",
  });
  //更新依赖信息
  await libUtil.checkDepUpdate();
  installInfo.loading = false;
  const t = setTimeout(() => {
    installInfo.installed = false;
    clearTimeout(t);
  }, 10000);
};
</script>

<style lang="scss" scoped>
.install-dep {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  .btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    height: 100%;
    position: relative;
    animation: all 1s;

    .select-btn {
      width: 100%;
      height: 100px;
      text-wrap: wrap;
      margin: 0;
      margin-top: 5px;
    }
    .clear-btn {
      width: 100%;
      height: 50px;
      text-wrap: wrap;
      margin: 0;
    }
    .install-btn {
      width: 100%;
      flex: 1;
      text-wrap: wrap;
      margin: 0;
      margin-top: 5px;
    }
  }
  .content {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    max-height: v-bind(contentMaxHeight);
    margin-right: 10px;
    box-sizing: border-box;
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: start;
      font-size: 20px;
      justify-content: end;
    }
    .dep-tag {
      flex-shrink: 1;
      min-height: 24px;
      margin-bottom: 2px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      &:hover {
        border: 1px solid var(--el-color-primary);
      }
    }
  }
}
</style>
