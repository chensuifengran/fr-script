<template>
  <div
    class="container-root"
    w-full
    h-full
    pos-relative
    p-0
    box-border
    overflow-hidden
    flex
    p-5px
    flex-col
  >
    <div
      h-40px
      flex
      flex-row
      justify-between
      flex-items-center
      w-full
      p-5px
      box-border
      border-rd-10px
    >
      <el-segmented
        v-model="currentTab"
        :options="tabOption"
        ml-1
        @change="tabChangeHandle"
      />
      <div flex flex-row justify-end flex-items-center>
        <el-text tag="b" v-show="currentTab === '管理API'">{{
          isChanged ? "*" : ""
        }}</el-text>
        <el-tree-select
          size="small"
          v-show="currentTab === '管理API'"
          @click="checkSave"
          w-300px
          mr-10px
          v-model="targetApi"
          :data="apiDataList"
          :filter-node-method="filterNodeMethod"
          clearable
          placeholder="请选择API"
          filterable
          default-expand-all
        >
          <template #default="{ data: { label, children, enabled } }">
            <div flex flex-items-center flex-row>
              {{ label
              }}<el-tag v-if="children" ml-1 size="small">namespace</el-tag
              ><el-tag size="small" type="danger" v-if="!enabled" ml-1
                >已禁用</el-tag
              >
            </div>
          </template>
        </el-tree-select>
        <el-button-group ml-1 v-show="currentTab === '管理API'" size="small">
          <el-button type="danger" @click="delApi">删除API</el-button>
          <el-button @click="reset(true)" :disabled="!isChanged"
            >恢复修改前</el-button
          >
          <el-button type="primary" @click="save" :disabled="!isChanged"
            >保存修改</el-button
          >
        </el-button-group>
        <el-button-group ml-1 v-show="currentTab === '创建API'" size="small">
          <el-button @click="resetCreate">清空内容</el-button>
          <el-button type="primary" @click="createApi">保存新建</el-button>
        </el-button-group>
      </div>
    </div>
    <div
      flex
      w-full
      class="content-container"
      :style="{
        flexDirection: anchorModel === 'horizontal' ? 'column' : 'row',
      }"
    >
      <el-segmented
        v-model="linkTarget"
        :options="anchorLinks"
        v-if="anchorModel === 'horizontal'"
        size="small"
        :block="true"
      >
        <template #default="{ item }">
          <template v-if="typeof item === 'object'">
            <div @click="scrollTo(item.value as string)">
              {{ item.label }}
            </div>
          </template>
        </template>
      </el-segmented>
      <div overflow-y-scroll overflow-x-hidden ref="scrollRef" flex-1>
        <invokes-manager-form
          ref="IMFRef_manager"
          v-model="localForm.manager"
          :scope-list="scopeList"
          v-show="currentTab === '管理API' && targetApi"
          :anchor-model="anchorModel"
          anchor-id-prefix="manager"
        />
        <el-empty
          v-show="currentTab === '管理API' && !targetApi"
          description="请选择一个API进行管理"
        />
        <invokes-manager-form
          ref="IMFRef"
          v-model="localForm.create"
          :scope-list="scopeList"
          v-show="currentTab === '创建API'"
          :anchor-model="anchorModel"
          anchor-id-prefix="create"
        />
      </div>
      <div v-if="anchorModel === 'vertical'" w-120px ml-5 flex-col mt-10>
        <el-text tag="b">表单项</el-text>
        <div
          class="link-item"
          @click="scrollTo(l.value)"
          :class="{
            active: linkTarget === l.value,
          }"
          link
          v-for="l in anchorLinks"
          :key="l.value"
        >
          {{ l.label }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nanoid } from "nanoid";
import { SelectOption } from "../utils/dataStructure";
import { InvokeTemplateOptions } from "../utils/invokeTemplate";
import { appWindow } from "@tauri-apps/api/window";
const linkTarget = ref("");
const IMFRef = ref<any>();
const IMFRef_manager = ref<any>();
type ExtraProperties = {
  enabled?: boolean;
  disabled?: boolean;
  id: string;
  fullPath: string;
  scope?: string;
  testModule?: TestModuleType;
};
const tabOption = ["管理API", "创建API"];
const currentTab = ref<"管理API" | "创建API">("管理API");
const scrollRef = ref<HTMLElement | null>(null);
const { appBackground } = useAppTheme();
const targetApi = ref("");
let beforeLocalForm: string = "";
const localForm = ref<{
  manager: Required<InvokeTemplateOptions>;
  create: Required<InvokeTemplateOptions>;
}>({
  manager: defaultInvokeTemplateOptions(),
  create: defaultInvokeTemplateOptions(),
});
const scopeList = reactive<
  {
    label: string;
    value: string;
  }[]
>([]);
let targetApiPath = "";

watch(targetApi, () => {
  const target = apiDataList.value
    .map((a) => {
      if (a.children) {
        return a.children;
      } else {
        return [a];
      }
    })
    .flat()
    .map((item) => ({
      ...item,
      scope: item.scope ? item.scope : "",
    }))
    .find((item) => item.id === targetApi.value);
  const m = {
    name: target?.label || "",
    scope: target?.scope || "",
    weight: target?.testModule?.weight || 1,
    disabled: target?.disabled || false,
    document: target?.testModule?.document || {
      howToUse: "",
      params: [],
      returnValue: {
        instructions: "",
        type: "",
      },
      example: {
        title: "",
        code: "",
      },
      searchKeys: [],
      codeSnippet: "",
    },
    dialog: target?.testModule?.dialog || {
      title: "",
      content: "",
      args: [],
    },
  };
  localForm.value.manager = m;
  targetApiPath = target?.fullPath || "";
  beforeLocalForm = JSON.stringify(m);
  scopeList.splice(
    0,
    scopeList.length,
    {
      label: "Root",
      value: "",
    },
    ...apiDataList.value
      .filter((item) => item.children)
      .map((item) => {
        return {
          label: item.children![0].scope || "Root",
          value: item.children![0].scope || "",
        };
      })
  );
});
const isChanged = computed(
  () =>
    beforeLocalForm !== JSON.stringify(localForm.value.manager) &&
    !!targetApi.value.length
);

const reset = (showTip: boolean = true) => {
  localForm.value.manager = JSON.parse(beforeLocalForm);
  showTip && ElMessage.success("重置成功");
};
const save = async () => {
  const oldOptions = JSON.parse(beforeLocalForm);
  const template = new InvokeTemplate(JSON.parse(beforeLocalForm));
  const res = await template.apply(targetApiPath, oldOptions);
  if (res) {
    beforeLocalForm = JSON.stringify(localForm.value.manager);
  }
};
const delApi = async () => {
  try {
    await ElMessageBox.confirm(
      "删除后无法恢复，请谨慎删除！",
      `删除${localForm.value.manager.scope}.${localForm.value.manager.name}`,
      {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--danger",
        type: "error",
      }
    );
  } catch (error) {
    return;
  }
  try {
    const dir = await pathUtils.resolve(targetApiPath, "../");
    const parentDir = await pathUtils.resolve(dir, "../");
    const delRes = await fsUtils.deleteDir(dir, true);
    if (delRes) {
      //如果父目录为空，删除父目录
      await fsUtils.deleteDir(parentDir, false, true);
      ElMessage.success("删除成功");
    } else {
      ElMessage.error("删除失败");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("删除失败");
  }
};
const checkSave = async (e: any) => {
  if (isChanged.value) {
    try {
      await ElMessageBox.confirm("是否保存当前修改？", "提示", {
        confirmButtonText: "保存",
        cancelButtonText: "放弃更改",
        type: "warning",
      });
    } catch (error) {
      reset(false);
      e.srcElement?.click();
      return;
    }
    save();
  }
};
const apiDataList = ref<SelectOption<ExtraProperties>[]>([]);
const { getApiModules } = useCore();
const setDefaultValue = (options: SelectOption<ExtraProperties>[]) => {
  apiDataList.value = options.map((item: SelectOption<ExtraProperties>) => {
    return {
      ...item,
      //将disabled字段转换为enabled字段，disabled会导致el-tree-select的节点不可选
      enabled: !item.disabled,
      disabled: false,
      testModule: {
        ...item.testModule,
        document: {
          ...item.testModule?.document,
          params: dataStructureUtils.genTreeArrNodeId(
            item.testModule?.document?.params || []
          ),
          returnValue: {
            ...item.testModule?.document?.returnValue,
            instructions:
              item.testModule?.document?.returnValue?.instructions || "",
          },
          example: {
            ...item.testModule?.document?.example,
            title: item.testModule?.document?.example?.title || "",
            code: item.testModule?.document?.example?.code || "",
          },
          searchKeys: item.testModule?.document?.searchKeys || [],
          codeSnippet: item.testModule?.document?.codeSnippet || "",
        },
        dialog: {
          ...item.testModule?.dialog,
          args: item.testModule?.dialog?.args?.map((i) => {
            const id = nanoid();
            if (i.componentType === "DirInput") {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                suffix: i.suffix || "",
                verifyPath: i.verifyPath || false,
              };
            } else if (i.componentType === "FileInput") {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                suffix: i.suffix || "",
                verifyPath: i.verifyPath || false,
                multiple: i.multiple || false,
                value: i.value || (i.multiple ? [] : ""),
              };
            } else if (i.componentType === "RectInput") {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                targetSrc: i.targetSrc || "",
              };
            } else if (i.componentType === "select") {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                options: i.options || [],
                multiple: i.multiple || false,
                value: i.value || (i.multiple ? [] : ""),
                selectOptionSeparator: i.selectOptionSeparator || "",
                notAllowCreate: i.notAllowCreate || false,
              };
            } else if (i.componentType === "numberRangeInput") {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                limit: i.limit || [0, 0],
              };
            } else if (i.componentType === "switch") {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                activeText: i.activeText || "是",
                inactiveText: i.inactiveText || "否",
              };
            } else if (i.componentType === "slider") {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                range: i.range || { max: 1, min: 0, step: 0.1 },
              };
            }
            return {
              ...i,
              id,
              noTest: i.noTest || false,
              onlyTest: i.onlyTest || false,
            };
          }),
          notOpen: item.testModule?.dialog?.notOpen || false,
          title: item.testModule?.dialog?.title || "",
          content: item.testModule?.dialog?.content || "",
        },
      },
      children: item.children?.map((child) => {
        return {
          ...child,
          enabled: !child.disabled,
          disabled: false,
          testModule: {
            ...child.testModule,
            document: {
              ...child.testModule?.document,
              params: dataStructureUtils.genTreeArrNodeId(
                child.testModule?.document?.params || []
              ),
              returnValue: {
                ...child.testModule?.document?.returnValue,
                instructions:
                  child.testModule?.document?.returnValue?.instructions || "",
              },
              example: {
                ...child.testModule?.document?.example,
                title: child.testModule?.document?.example?.title || "",
                code: child.testModule?.document?.example?.code || "",
              },
              searchKeys: child.testModule?.document?.searchKeys || [],
              codeSnippet: child.testModule?.document?.codeSnippet || "",
            },
            dialog: {
              ...child.testModule?.dialog,
              args: child.testModule?.dialog?.args?.map((i) => {
                const id = nanoid();
                if (i.componentType === "DirInput") {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    suffix: i.suffix || "",
                    verifyPath: i.verifyPath || false,
                  };
                } else if (i.componentType === "FileInput") {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    suffix: i.suffix || "",
                    verifyPath: i.verifyPath || false,
                    multiple: i.multiple || false,
                    value: i.value || (i.multiple ? [] : ""),
                  };
                } else if (i.componentType === "RectInput") {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    targetSrc: i.targetSrc || "",
                  };
                } else if (i.componentType === "select") {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    options: i.options || [],
                    multiple: i.multiple || false,
                    value: i.value || (i.multiple ? [] : ""),
                    selectOptionSeparator: i.selectOptionSeparator || "",
                    notAllowCreate: i.notAllowCreate || false,
                  };
                } else if (i.componentType === "numberRangeInput") {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    limit: i.limit || [0, 0],
                  };
                } else if (i.componentType === "switch") {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    activeText: i.activeText || "是",
                    inactiveText: i.inactiveText || "否",
                  };
                } else if (i.componentType === "slider") {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    range: i.range || { max: 1, min: 0, step: 0.1 },
                  };
                }
                return {
                  ...i,
                  id,
                  noTest: i.noTest || false,
                  onlyTest: i.onlyTest || false,
                };
              }),
              notOpen: child.testModule?.dialog?.notOpen || false,
              title: child.testModule?.dialog?.title || "",
              content: child.testModule?.dialog?.content || "",
            },
          },
        };
      }),
    };
  }) as SelectOption<ExtraProperties>[];
  //默认选中第一个
  if (apiDataList.value[0]) {
    if (apiDataList.value[0].children && apiDataList.value[0].children[0]) {
      targetApi.value = apiDataList.value[0].children[0].id;
    } else {
      targetApi.value = apiDataList.value[0].id;
    }
  }
};
const initData = async () => {
  const dataSources: InvokeApiMethodType[] = JSON.parse(
    JSON.stringify(await getApiModules(false, true, true))
  );
  const { groupRecordToOptions, dataGrouping } = dataStructureUtils;
  const options = groupRecordToOptions(
    dataGrouping<InvokeApiMethodType>(dataSources, "scope"),
    "name",
    "id",
    ["disabled", "id", "fullPath", "scope", "testModule"]
  );
  setDefaultValue(options);
};
const anchorModel = ref<"horizontal" | "vertical">("horizontal");
const windowResizeHandle = async () => {
  const isMaximized = await appWindow.isMaximized();
  if (isMaximized) {
    anchorModel.value = "vertical";
  } else {
    anchorModel.value = "horizontal";
  }
};
const anchorLinks = reactive([
  {
    value: "api-name",
    label: "名称",
  },
  {
    value: "api-state",
    label: "状态",
  },
  {
    value: "ns",
    label: "命名空间",
  },
  {
    value: "weight",
    label: "权重",
  },
  {
    value: "api-doc",
    label: "文档",
  },
  {
    value: "api-test",
    label: "弹窗",
  },
  {
    value: "auxiliary",
    label: "辅助代码",
  },
  {
    value: "fn",
    label: "API本体",
  },
  {
    value: "cb",
    label: "回调代码",
  },
]);
const scrollTo = (name: string) => {
  const target = document.getElementById(
    (currentTab.value === "管理API" ? "manager" : "create") + "-" + name
  );
  if (target) {
    //anchorLinks最后五个value
    const lastFive = anchorLinks.slice(-5).map((i) => i.value);
    const idx = lastFive.indexOf(name);
    if (idx !== -1) {
      let changeFormShow: (idx: number) => void;
      if (currentTab.value === "创建API") {
        changeFormShow = IMFRef.value.changeFormShow;
      } else {
        changeFormShow = IMFRef_manager.value.changeFormShow;
      }
      changeFormShow && changeFormShow(idx);
    }
    nextTick(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    });
  }
};
let lastLinkTarget = {
  manager: anchorLinks[0].value,
  create: anchorLinks[0].value,
};
watch(linkTarget, (value) => {
  if (currentTab.value === "管理API") {
    lastLinkTarget.manager = value;
  } else {
    lastLinkTarget.create = value;
  }
});
const tabChangeHandle = () => {
  if (currentTab.value === "创建API") {
    linkTarget.value = lastLinkTarget.create;
    setTimeout(() => {
      scrollTo(lastLinkTarget.create);
    }, 100);
  } else {
    linkTarget.value = lastLinkTarget.manager;
    setTimeout(() => {
      scrollTo(lastLinkTarget.manager);
    }, 100);
  }
};
let scrollHandleTimer: NodeJS.Timeout;
let usePreTarget = false;
let lastScrollTop = 0;
const scrollHandle = (e: Event) => {
  scrollHandleTimer && clearTimeout(scrollHandleTimer);
  scrollHandleTimer = setTimeout(() => {
    const currentScrollTop = (e.target as any).scrollTop || 0;
    //遍历anchorLinks的value，找到对应的元素，判断是否在可视区域内，将最上面的元素的value赋值给linkTarget
    const target = anchorLinks.find((i) => {
      const ele = document.getElementById(
        (currentTab.value === "管理API" ? "manager" : "create") + "-" + i.value
      );
      if (ele) {
        const rect = ele.getBoundingClientRect();
        return rect.top >= 70 && rect.bottom <= window.innerHeight;
      }
      return false;
    });
    if (target) {
      linkTarget.value = target.value;
      usePreTarget = false;
    } else {
      if (currentScrollTop < lastScrollTop) {
        //如果当前元素索引大于零，使用上一个元素
        const index = anchorLinks.findIndex(
          (i) => i.value === linkTarget.value
        );
        if (index > 0 && !usePreTarget) {
          linkTarget.value = anchorLinks[index - 1].value;
          usePreTarget = true;
        }
      }
    }
    lastScrollTop = currentScrollTop;
  });
};
onMounted(async () => {
  await initData();
  windowResizeHandle();
  window.addEventListener("resize", windowResizeHandle);
  scrollRef.value?.addEventListener("scroll", scrollHandle);
  linkTarget.value = anchorLinks[0].value;
  invokeBaseApi.closeSplashscreen();
});
onUnmounted(() => {
  window.removeEventListener("resize", windowResizeHandle);
  scrollRef.value?.removeEventListener("scroll", scrollHandle);
});
const filterNodeMethod = (
  value: string,
  data: SelectOption<ExtraProperties>
) => {
  const dialog = data.testModule?.dialog;
  const document = data.testModule?.document;
  return (
    data.label.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
    dialog?.title?.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
    dialog?.content?.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
    document?.howToUse
      ?.toLocaleLowerCase()
      .includes(value.toLocaleLowerCase()) ||
    document?.searchKeys?.some((key) =>
      key.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    )
  );
};
const resetCreate = async () => {
  try {
    await ElMessageBox.confirm("是否清空当前内容？", "提示", {
      confirmButtonText: "清空",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch (error) {
    return;
  }
  localForm.value.create = defaultInvokeTemplateOptions();
  ElMessage.success("清空完成");
};
const createApi = () => {
  const { codeSnippetPlaceholder } = IMFRef.value;
  if (!localForm.value.create.document.codeSnippet?.trim().length) {
    localForm.value.create.document.codeSnippet = codeSnippetPlaceholder;
  }
  const template = new InvokeTemplate(localForm.value.create);
  template.create();
  ElMessage.success("创建成功");
};
// const reduceHeight = computed(()=>{
//   return anchorModel.value === 'horizontal' ? '104px' : '90px';
// })
</script>
<style></style>
<style lang="scss" scoped>
.container-root {
  background: v-bind(appBackground);
  border-radius: 10px 10px 10px 0;
  .content-container {
    height: calc(100vh - 95px);
    .link-item {
      cursor: pointer;
      margin: 5px 0;
      color: var(--el-segmented-color);
      font-size: 12px;
      &:hover {
        color: var(--el-color-primary-light-5) !important;
      }
      &.active {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
