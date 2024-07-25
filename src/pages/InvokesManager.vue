<template>
  <div class="container-root" w-full h-full pos-relative p-0 box-border overflow-hidden flex p-5px flex-col>
    <div h-40px flex flex-row justify-between flex-items-center w-full p-5px box-border border-rd-10px>
      <span style="font-size: 18px">内置API管理器</span>
      <div flex flex-row justify-end flex-items-center>
        <el-text tag="b" v-show="currentTab === '管理API'">{{ isChanged ? '*' : '' }}</el-text>
        <el-tree-select size="small" v-show="currentTab === '管理API'" @click="checkSave" w-300px mr-10px
          v-model="targetApi" :data="apiDataList" :filter-node-method="filterNodeMethod" clearable placeholder="请选择API"
          filterable default-expand-all>
          <template #default="{ data: { label, children, enabled } }">
            <div flex flex-items-center flex-row>{{ label }}<el-tag v-if="children" ml-1
                size="small">namespace</el-tag><el-tag size="small" type="danger" v-if="!enabled" ml-1>已禁用</el-tag>
            </div>
          </template>
        </el-tree-select>
        <el-button-group ml-1 v-show="currentTab === '管理API'" size="small">
          <el-button @click="reset(true)" :disabled="!isChanged">重置</el-button>
          <el-button type="primary" @click="save" :disabled="!isChanged">保存</el-button>
        </el-button-group>
        <el-button-group ml-1 v-show="currentTab === '创建API'" size="small">
          <el-button type="warning" @click="resetCreate">清空</el-button>
          <el-button type="primary" @click="createApi">创建</el-button>
        </el-button-group>
        <el-segmented v-model="currentTab" :options="tabOption" ml-1 />
      </div>
    </div>
    <div w-full overflow-y-scroll overflow-x-hidden>
      <invokes-manager-form v-model="localForm.manager" :scope-list="scopeList"
        v-show="currentTab === '管理API' && targetApi" />
      <el-empty v-show="currentTab === '管理API' && !targetApi" description="请选择一个API进行管理" />
      <invokes-manager-form ref="IMFRef" v-model="localForm.create" :scope-list="scopeList"
        v-show="currentTab === '创建API'" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nanoid } from 'nanoid';
import { SelectOption } from '../utils/dataStructure';
import { InvokeTemplateOptions } from '../utils/invokeTemplate';
const IMFRef = ref<any>();
type ExtraProperties = {
  enabled?: boolean;
  disabled?: boolean;
  id: string;
  fullPath: string;
  scope?: string;
  testModule?: TestModuleType;
}
const tabOption = ['管理API', "创建API"];
const currentTab = ref<"管理API" | "创建API">('管理API');
const { appBackground } = useAppTheme();
const targetApi = ref("");
let beforeLocalForm: string = "";
const localForm = ref<{
  manager: Required<InvokeTemplateOptions>,
  create: Required<InvokeTemplateOptions>,
}>({
  manager: defaultInvokeTemplateOptions(),
  create: defaultInvokeTemplateOptions()
});
const scopeList = reactive<{
  label: string;
  value: string;
}[]>([]);
watch(targetApi, () => {
  const target = apiDataList.value.map(a => {
    if (a.children) {
      return a.children
    } else {
      return [a]
    }
  }).flat().map(item => ({
    ...item,
    scope: item.scope ? item.scope : ""
  })).find(item => item.id === targetApi.value);
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
    }
  };
  localForm.value.manager = m;
  beforeLocalForm = JSON.stringify(m);
  scopeList.splice(0, scopeList.length, {
    label: "Root",
    value: ""
  }, ...apiDataList.value.filter(item => item.children).map(item => {
    return {
      label: item.children![0].scope || "Root",
      value: item.children![0].scope || ""
    }
  }));
});
const isChanged = computed(() => beforeLocalForm !== JSON.stringify(localForm.value.manager) && !!targetApi.value.length);

const reset = (showTip: boolean = true) => {
  localForm.value.manager = JSON.parse(beforeLocalForm);
  showTip && ElMessage.success('重置成功');
}
const save = () => {
  beforeLocalForm = JSON.stringify(localForm.value.manager);
  console.log(JSON.parse(beforeLocalForm));
  console.log(new InvokeTemplate(JSON.parse(beforeLocalForm)));

}
const checkSave = async (e: any) => {
  if (isChanged.value) {
    try {
      await ElMessageBox.confirm('是否保存当前修改？', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '放弃更改',
        type: 'warning'
      });
    } catch (error) {
      reset(false);
      e.srcElement?.click();
      return
    }
    save();
  }
}
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
          params: dataStructureUtils.genTreeArrNodeId(item.testModule?.document?.params || []),
          returnValue: {
            ...item.testModule?.document?.returnValue,
            instructions: item.testModule?.document?.returnValue?.instructions || ""
          },
          example: {
            ...item.testModule?.document?.example,
            title: item.testModule?.document?.example?.title || "",
            code: item.testModule?.document?.example?.code || ""
          },
          searchKeys: item.testModule?.document?.searchKeys || [],
          codeSnippet: item.testModule?.document?.codeSnippet || ""
        },
        dialog: {
          ...item.testModule?.dialog,
          args: item.testModule?.dialog?.args?.map((i) => {
            const id = nanoid();
            if (i.componentType === 'DirInput') {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                suffix: i.suffix || "",
                verifyPath: i.verifyPath || false
              }
            } else if (i.componentType === 'FileInput') {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                suffix: i.suffix || "",
                verifyPath: i.verifyPath || false,
                multiple: i.multiple || false,
                value: i.value || (i.multiple ? [] : "")
              }
            } else if (i.componentType === 'RectInput') {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                targetSrc: i.targetSrc || "",
              }
            } else if (i.componentType === 'select') {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                options: i.options || [],
                multiple: i.multiple || false,
                value: i.value || (i.multiple ? [] : ""),
                selectOptionSeparator: i.selectOptionSeparator || "",
                notAllowCreate: i.notAllowCreate || false
              }
            } else if (i.componentType === 'numberRangeInput') {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                limit: i.limit || [0, 0],
              }
            } else if (i.componentType === 'switch') {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                activeText: i.activeText || "是",
                inactiveText: i.inactiveText || "否"
              }
            } else if (i.componentType === 'slider') {
              return {
                ...i,
                id,
                noTest: i.noTest || false,
                onlyTest: i.onlyTest || false,
                range: i.range || { max: 1, min: 0, step: 0.1 }
              }
            }
            return {
              ...i,
              id,
              noTest: i.noTest || false,
              onlyTest: i.onlyTest || false,
            }
          }),
          notOpen: item.testModule?.dialog?.notOpen || false,
          title: item.testModule?.dialog?.title || "",
          content: item.testModule?.dialog?.content || ""
        },
      },
      children: item.children?.map(child => {
        return {
          ...child,
          enabled: !child.disabled,
          disabled: false,
          testModule: {
            ...child.testModule,
            document: {
              ...child.testModule?.document,
              params: dataStructureUtils.genTreeArrNodeId(child.testModule?.document?.params || []),
              returnValue: {
                ...child.testModule?.document?.returnValue,
                instructions: child.testModule?.document?.returnValue?.instructions || ""
              },
              example: {
                ...child.testModule?.document?.example,
                title: child.testModule?.document?.example?.title || "",
                code: child.testModule?.document?.example?.code || ""
              },
              searchKeys: child.testModule?.document?.searchKeys || [],
              codeSnippet: child.testModule?.document?.codeSnippet || ""
            },
            dialog: {
              ...child.testModule?.dialog,
              args: child.testModule?.dialog?.args?.map((i) => {
                const id = nanoid();
                if (i.componentType === 'DirInput') {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    suffix: i.suffix || "",
                    verifyPath: i.verifyPath || false
                  }
                } else if (i.componentType === 'FileInput') {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    suffix: i.suffix || "",
                    verifyPath: i.verifyPath || false,
                    multiple: i.multiple || false,
                    value: i.value || (i.multiple ? [] : "")
                  }
                } else if (i.componentType === 'RectInput') {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    targetSrc: i.targetSrc || "",
                  }
                } else if (i.componentType === 'select') {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    options: i.options || [],
                    multiple: i.multiple || false,
                    value: i.value || (i.multiple ? [] : ""),
                    selectOptionSeparator: i.selectOptionSeparator || "",
                    notAllowCreate: i.notAllowCreate || false
                  }
                } else if (i.componentType === 'numberRangeInput') {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    limit: i.limit || [0, 0],
                  }
                } else if (i.componentType === 'switch') {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    activeText: i.activeText || "是",
                    inactiveText: i.inactiveText || "否"
                  }
                } else if (i.componentType === 'slider') {
                  return {
                    ...i,
                    id,
                    noTest: i.noTest || false,
                    onlyTest: i.onlyTest || false,
                    range: i.range || { max: 1, min: 0, step: 0.1 }
                  }
                }
                return {
                  ...i,
                  id,
                  noTest: i.noTest || false,
                  onlyTest: i.onlyTest || false,
                }
              }),
              notOpen: child.testModule?.dialog?.notOpen || false,
              title: child.testModule?.dialog?.title || "",
              content: child.testModule?.dialog?.content || ""
            }
          }
        }
      })
    }
  }) as SelectOption<ExtraProperties>[];
  //默认选中第一个
  if (apiDataList.value[0]) {
    if (apiDataList.value[0].children && apiDataList.value[0].children[0]) {
      targetApi.value = apiDataList.value[0].children[0].id;
    } else {
      targetApi.value = apiDataList.value[0].id;
    }
  }
}
const initData = async () => {
  const dataSources: InvokeApiMethodType[] = JSON.parse(JSON.stringify(await getApiModules(false, true, true)));
  const { groupRecordToOptions, dataGrouping } = dataStructureUtils;
  const options = groupRecordToOptions(
    dataGrouping<InvokeApiMethodType>(dataSources, "scope"),
    "name",
    "id",
    ['disabled', "id", "fullPath", "scope", "testModule"]
  );
  setDefaultValue(options);
}
onMounted(async () => {
  await initData();
});
const filterNodeMethod = (value: string, data: SelectOption<ExtraProperties>) => {
  return data.label.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
    data.testModule?.dialog?.title?.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
    data.testModule?.dialog?.content?.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
    data.testModule?.document?.howToUse?.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
    data.testModule?.document?.searchKeys?.some((key) => key.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
}
const resetCreate = () => {
  localForm.value.create = defaultInvokeTemplateOptions();
}
const createApi = () => {
  const { codeSnippetPlaceholder } = IMFRef.value;
  if (!localForm.value.create.document.codeSnippet?.trim().length) {
    localForm.value.create.document.codeSnippet = codeSnippetPlaceholder;
  }
  const template = new InvokeTemplate(localForm.value.create);
  template.create();
  ElMessage.success('创建成功');
}
</script>
<style></style>
<style lang="scss" scoped>
.container-root {
  background: v-bind(appBackground);
  border-radius: 10px 10px 10px 0;
}
</style>