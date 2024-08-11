<template>
  <div w-full>
    <div w-full box-border flex flex-col>
      <div class="form-item">
        <el-text tag="b" :id="anchorIdPrefix + '-api-name'">API名称</el-text>
        <el-input
          v-model="localForm.name"
          placeholder="API名称"
          style="width: 240px"
        />
      </div>
      <div class="form-item">
        <el-text tag="b" :id="anchorIdPrefix + '-api-state'">API状态</el-text>
        <el-switch
          v-model="localForm.disabled"
          active-text="禁用"
          inactive-text="启用"
          style="
            --el-switch-on-color: #ff4949;
            --el-switch-off-color: var(--el-color-primary);
          "
        />
      </div>
      <div class="form-item">
        <el-text tag="b" :id="anchorIdPrefix + '-ns'"
          >命名空间(namespace)</el-text
        >
        <el-select
          v-model="localForm.scope"
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="Root"
          style="width: 240px"
          @change="selectScopeHandler"
        >
          <el-option
            v-for="(item, idx) in scopeList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          />
          <template #label="{ label }">
            <div flex flex-row flex-items-center>
              <el-tag
                size="small"
                type="success"
                mr-1
                v-if="!scopeList.find((i) => i.label === label)"
                >new</el-tag
              >
              <el-text>{{ label }}</el-text>
            </div>
          </template>
        </el-select>
      </div>
      <div class="form-item">
        <el-text tag="b" :id="anchorIdPrefix + '-weight'"
          >显示权重(越大默认排序越靠前)</el-text
        >
        <el-input-number
          v-model="localForm.weight"
          :min="0"
          placeholder="显示权重"
        />
      </div>
      <div flex flex-col>
        <div class="form-item">
          <el-text tag="b" :id="anchorIdPrefix + '-api-doc'">API文档</el-text>
          <el-button link @click="apiFormShow = !apiFormShow">
            <el-icon size="large">
              <span v-show="apiFormShow" i-mdi-chevron-down></span>
              <span v-show="!apiFormShow" i-mdi-chevron-left></span>
            </el-icon>
          </el-button>
        </div>
        <div flex flex-col pl-5 box-border mt-2 v-show="apiFormShow">
          <div flex flex-col flex-items-start mb-2>
            <el-text self-start mb-2>API使用介绍</el-text>
            <el-input
              v-model="localForm.document.howToUse"
              type="textarea"
              placeholder="API使用介绍"
              autosize
            />
          </div>
          <div flex flex-col flex-items-start mb-2>
            <el-text self-start mb-2>API参数</el-text>
            <el-table
              :data="localForm.document.params"
              table-layout="fixed"
              row-key="id"
              default-expand-all
              :border="true"
              max-height="75vh"
            >
              <el-table-column prop="name" label="参数名" fixed width="180">
                <template #default="scope">
                  <el-input v-model="scope.row.name" placeholder="参数名" />
                </template>
              </el-table-column>
              <el-table-column prop="required" label="必填" width="70">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.required"
                    active-text="是"
                    inactive-text="否"
                    inline-prompt
                    @change="onRequiredChange(scope.row.id, scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="instructions" label="说明" width="260">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.instructions"
                    type="textarea"
                    placeholder="说明"
                    size="small"
                    autosize
                  />
                </template>
              </el-table-column>
              <el-table-column prop="type" label="类型" width="200">
                <template #default="scope">
                  <el-select
                    v-if="Array.isArray(scope.row.type)"
                    multiple
                    v-model="scope.row.type"
                    filterable
                    allow-create
                  ></el-select>
                  <el-autocomplete
                    v-else
                    v-model="scope.row.type"
                    :fetch-suggestions="queryTypeSearch"
                    clearable
                    placeholder="请输入类型名称"
                  >
                    <template #default="{ item }">
                      <div class="value">{{ item.value }}</div>
                    </template>
                  </el-autocomplete>
                  <el-checkbox
                    ml-1
                    :checked="Array.isArray(scope.row.type)"
                    label="枚举"
                    size="small"
                    @change="(val) => onTypeChange(val, scope.row.id)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="default" label="默认值">
                <template #default="scope">
                  <el-select
                    v-if="Array.isArray(scope.row.type)"
                    v-model="scope.row.default"
                    size="small"
                    :disabled="scope.row.required"
                    filterable
                    allow-create
                    clearable
                  >
                    <el-option
                      v-for="item in scope.row.type"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                  <el-input
                    v-model="scope.row.default"
                    placeholder="默认值"
                    v-else
                    size="small"
                    :disabled="scope.row.required"
                  />
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="100">
                <template #header>
                  <el-button
                    link
                    type="danger"
                    size="large"
                    @click="clearParamLine()"
                  >
                    <el-icon size="large"
                      ><span i-mdi-sort-variant-remove></span
                    ></el-icon>
                  </el-button>
                  <el-button
                    link
                    type="primary"
                    size="large"
                    @click="newParamLine()"
                  >
                    <el-icon size="large"
                      ><span i-mdi-playlist-plus></span
                    ></el-icon>
                  </el-button>
                </template>
                <template #default="scope">
                  <div w-full flex flex-row flex-items-center justify-center>
                    <el-button
                      link
                      class="ml-1"
                      type="danger"
                      @click="clearParamLine(scope.row.id)"
                    >
                      <el-icon size="large"><span i-mdi-close></span></el-icon>
                    </el-button>
                    <el-button
                      link
                      class="ml-1"
                      type="primary"
                      @click="newParamLine(scope.row.id)"
                    >
                      <el-icon size="large"
                        ><span i-mdi-filter-variant-plus></span
                      ></el-icon>
                    </el-button>
                    <el-button link class="ml-1" @click="sortUp(scope.row.id)">
                      <el-icon size="large"
                        ><span i-mdi-arrow-up-thin></span
                      ></el-icon>
                    </el-button>
                    <el-button
                      link
                      class="ml-1"
                      @click="sortDown(scope.row.id)"
                    >
                      <el-icon size="large"
                        ><span i-mdi-arrow-down-thin></span
                      ></el-icon>
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div flex flex-col flex-items-start mb-2 w-full>
            <el-text self-start>返回值</el-text>
            <div w-full box-border pl-2>
              <div class="form-item" w-full>
                <el-text>类型</el-text>
                <el-autocomplete
                  v-model="localForm.document.returnValue.type"
                  style="width: 480px"
                  :fetch-suggestions="queryTypeSearch"
                  clearable
                  placeholder="请输入类型名称"
                >
                  <template #default="{ item }">
                    <div class="value">{{ item.value }}</div>
                  </template>
                </el-autocomplete>
              </div>
              <div flex flex-col flex-items-start w-full box-border p-8px>
                <el-text self-start mb-2>返回值说明</el-text>
                <el-input
                  v-model="localForm.document.returnValue.instructions"
                  type="textarea"
                  placeholder="返回值说明"
                  autosize
                />
              </div>
            </div>
          </div>
          <div flex flex-col flex-items-start mb-2 w-full>
            <el-text self-start>示例</el-text>
            <div w-full box-border pl-2>
              <div flex flex-col flex-items-start w-full box-border p-8px>
                <el-text self-start>标题</el-text>
                <el-input
                  v-model="localForm.document.example.title"
                  type="textarea"
                  placeholder="示例标题"
                  autosize
                />
              </div>
              <div flex flex-col flex-items-start w-full box-border p-8px>
                <el-text self-start>代码</el-text>
                <!-- TODO: 使用monaco-editor实现，并且将生成的类型声明提供给monaco-editor -->
                <el-input
                  v-model="localForm.document.example.code"
                  type="textarea"
                  placeholder="示例代码"
                  autosize
                />
              </div>
            </div>
          </div>
          <div
            flex
            flex-row
            flex-items-center
            w-full
            justify-between
            pr-2
            mb-2
            box-border
          >
            <el-text>搜索关键词</el-text>
            <el-select
              multiple
              filterable
              allow-create
              v-model="localForm.document.searchKeys"
              style="width: 480px"
              placeholder="可以添加搜索关键词"
            ></el-select>
          </div>
          <div flex flex-col flex-items-start w-full box-border pr-2>
            <el-text self-start>代码片段(不填按照下面提示的内容生成)</el-text>
            <el-input
              v-model="localForm.document.codeSnippet"
              type="textarea"
              :placeholder="codeSnippetPlaceholder"
              autosize
            />
          </div>
        </div>
      </div>
      <div flex flex-col>
        <div class="form-item">
          <el-text tag="b" :id="anchorIdPrefix + '-api-test'"
            >测试弹窗/快速修改参数弹窗</el-text
          >
          <el-button link @click="dialogFormShow = !dialogFormShow">
            <el-icon size="large">
              <span v-show="dialogFormShow" i-mdi-chevron-down></span>
              <span v-show="!dialogFormShow" i-mdi-chevron-left></span>
            </el-icon>
          </el-button>
        </div>
        <div flex flex-col pl-5 box-border v-show="dialogFormShow" w-full pr-2>
          <div class="form-item">
            <el-text>不启用[测试弹窗/快速修改参数弹窗]</el-text>
            <el-switch
              v-model="localForm.dialog.notOpen"
              active-text="是"
              inactive-text="否"
            />
          </div>
          <div v-if="!localForm.dialog.notOpen">
            <div class="form-item">
              <el-text>在API测试窗口显示的名称</el-text>
              <el-input
                v-model="localForm.dialog.title"
                placeholder="在API测试窗口显示的名称"
                style="width: 240px"
              />
            </div>
            <div flex flex-col flex-items-start w-full box-border pl-8px>
              <el-text self-start
                >弹窗中显示的内容(用于对API进行介绍或者说明)</el-text
              >
              <el-input
                v-model="localForm.dialog.content"
                autosize
                placeholder="弹窗中显示的内容"
                type="textarea"
              />
            </div>
            <div flex flex-col flex-items-start w-full box-border pl-8px>
              <el-text self-start
                >弹窗组件编辑(可从左侧将指定参数组件拖拽至右侧)</el-text
              >
              <dialog-arg-editor
                v-model="localForm.dialog.args"
                :document-params="currentDocParams"
              />
            </div>
          </div>
        </div>
      </div>
      <div flex flex-col v-for="codeItem in codes" :key="codeItem.name">
        <div class="form-item">
          <el-text tag="b" :id="anchorIdPrefix + '-' + codeItem.name">{{
            codeItem.title
          }}</el-text>
          <el-button link @click="codeItem.show = !codeItem.show">
            <el-icon size="large">
              <span v-show="codeItem.show" i-mdi-chevron-down></span>
              <span v-show="!codeItem.show" i-mdi-chevron-left></span>
            </el-icon>
          </el-button>
        </div>
        <div flex flex-col pl-5 box-border v-show="codeItem.show" w-full pr-2>
          <raw-code-view :raw-code="codeItem.code" :file-path="codeItem.path" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CheckboxValueType } from "element-plus";
import { SelectOption } from "../utils/dataStructure";
import { InvokeTemplateOptions } from "../utils/invokeTemplate";
import { nanoid } from "nanoid";
import { exists } from "@tauri-apps/api/fs";
import { listen } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
type ExtraProperties = {
  enabled?: boolean;
  disabled?: boolean;
  id: string;
  fullPath: string;
  scope?: string;
  testModule?: TestModuleType;
};

const localForm = defineModel<Required<InvokeTemplateOptions>>({
  required: true,
});
const codes = reactive([
  {
    name: "auxiliary",
    title: "辅助代码",
    code: "",
    show: false,
    path: "",
  },
  {
    name: "fn",
    title: "API本体",
    code: "",
    show: false,
    path: "",
  },
  {
    name: "cb",
    title: "《快捷输入/修改参数弹窗》回调代码",
    code: "",
    show: false,
    path: "",
  },
]);
const updateCodes = async () => {
  let targetFullPath = "";
  apiDataList.value.find((i) => {
    if (i.label === localForm.value.name) {
      targetFullPath = i.fullPath;
    } else if (i.children) {
      i.children.find((j) => {
        if (j.label === localForm.value.name) {
          targetFullPath = j.fullPath;
        }
      });
    }
    return !!targetFullPath;
  });
  const aPath = await pathUtils.resolve(targetFullPath, "../auxiliary.ts");
  const aTarget = codes.find((i) => i.name === "auxiliary")!;
  const fTarget = codes.find((i) => i.name === "fn")!;
  const cTarget = codes.find((i) => i.name === "cb")!;
  if (await exists(aPath)) {
    const auxCode = await fsUtils.readFile(aPath);
    aTarget.code = auxCode;
    aTarget.path = aPath;
  } else {
    aTarget.code = "";
    aTarget.path = "";
  }
  const fPath = await pathUtils.resolve(targetFullPath, "../exportFn.ts");
  if (await exists(fPath)) {
    const fnCode = await fsUtils.readFile(fPath);
    fTarget.code = fnCode;
    fTarget.path = fPath;
  } else {
    fTarget.code = "";
    fTarget.path = "";
  }
  const cPath = await pathUtils.resolve(targetFullPath, "../modelCallback.ts");
  if (await exists(cPath)) {
    const cbCode = await fsUtils.readFile(cPath);
    cTarget.code = cbCode;
    cTarget.path = cPath;
  } else {
    cTarget.code = "";
    cTarget.path = "";
  }
};
watch(localForm, updateCodes, {
  deep: true,
});

const currentDocParams = computed(() => {
  return localForm.value.document.params;
});
defineProps({
  scopeList: {
    type: Array as PropType<
      {
        label: string;
        value: string;
      }[]
    >,
    required: true,
  },
  anchorModel: {
    type: String as PropType<"horizontal" | "vertical">,
    default: "horizontal",
  },
  anchorIdPrefix: {
    type: String,
    required: true,
  },
});

const codeSnippetPlaceholder = ref("");

watchEffect(() => {
  const { returnValue: _, params: __ } = localForm.value.document;
  if (!localForm.value.document.codeSnippet?.trim().length) {
    const t = new InvokeTemplate(localForm.value);
    codeSnippetPlaceholder.value = t.defaultSnippet();
  }
});
const apiDataList = ref<SelectOption<ExtraProperties>[]>([]);
const apiFormShow = ref(true);
const dialogFormShow = ref(true);

const selectScopeHandler = () => {
  if (localForm.value?.scope) {
    //转为首字母大写
    let scope = localForm.value.scope;
    localForm.value.scope = scope.charAt(0).toUpperCase() + scope.slice(1);
  }
};
const { getApiModules } = useCore();
const initData = async () => {
  const dataSources = await getApiModules(false, true, true);
  const { groupRecordToOptions, dataGrouping } = dataStructureUtils;
  const options = groupRecordToOptions(
    dataGrouping<InvokeApiMethodType>(dataSources, "scope"),
    "name",
    "id",
    ["disabled", "id", "fullPath", "scope", "testModule"]
  );
  //将disabled字段转换为enabled字段，disabled会导致el-tree-select的节点不可选
  apiDataList.value = options.map((item) => {
    return {
      ...item,
      enabled: !item.disabled,
      disabled: false,
      children: item.children?.map((child) => {
        return {
          ...child,
          enabled: !child.disabled,
          disabled: false,
        };
      }),
    };
  });
};

let unListen: any;
onBeforeUnmount(() => {
  if (unListen) {
    unListen();
  }
});
onMounted(async () => {
  unListen = await listen("tauri://focus", (e: any) => {
    if (e.windowLabel === getCurrent().label) {
      updateCodes();
    }
  });
  await initData();
  updateCodes();
});

const onTypeChange = (val: CheckboxValueType, id: string) => {
  const target = dataStructureUtils.findByIdInTree(
    id,
    localForm.value.document.params!
  );
  if (target) {
    if (!val) {
      target.type = (target.type as string[]).join("|");
    } else {
      target.type = (target.type as string).split("|");
      if (!target.type.includes(target.default)) {
        target.default = target.type[0];
      }
    }
  }
};
const typeList = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "function",
  "null",
  "undefined",
];
const queryTypeSearch = (queryString: string, cb: any) => {
  const results = queryString
    ? typeList.filter((i) =>
        i.toLocaleLowerCase().includes(queryString.toLocaleLowerCase())
      )
    : typeList;
  const s = `'${queryString}'`;
  if (!results.includes(s)) {
    results.push(s);
  }
  const p = `Promise<${queryString}>`;
  if (
    !results.includes(p) &&
    !results.includes(p.toLocaleLowerCase()) &&
    !queryString.toLocaleLowerCase().includes("promise")
  ) {
    results.push(p);
  }
  if (
    !typeList.includes(queryString) &&
    !results.includes(queryString) &&
    (!queryString.includes("'") || !queryString.includes('"'))
  ) {
    results.push(queryString);
  }
  cb(
    results.map((i) => ({
      value: i,
    }))
  );
};
const newParamLine = (parentId?: string) => {
  if (parentId === undefined) {
    if (localForm.value.document.params) {
      localForm.value.document.params.push({
        id: nanoid(),
        name: "",
        required: false,
        instructions: "",
        type: "",
        default: "",
      });
    } else {
      localForm.value.document.params = [
        {
          id: nanoid(),
          name: "",
          required: false,
          instructions: "",
          type: "",
          default: "",
        },
      ];
    }
  } else {
    const target = dataStructureUtils.findByIdInTree(
      parentId,
      localForm.value.document.params!
    );
    if (target) {
      if (target.children) {
        target.children.push({
          id: nanoid(),
          name: "",
          required: false,
          instructions: "",
          type: "",
          default: "",
        });
      } else {
        target.children = [
          {
            id: nanoid(),
            name: "",
            required: false,
            instructions: "",
            type: "",
            default: "",
          },
        ];
      }
    }
  }
};
const sortUp = (id: string) => {
  const parent = dataStructureUtils.getTreeParentById(
    id,
    localForm.value.document.params!
  );
  if (parent) {
    const index = parent.findIndex((p) => p.id === id);
    if (index > 0) {
      //判断required字段，如果当前参数非必填，且上一个参数必填，则不允许上移
      if (!parent[index].required && parent[index - 1].required) {
        ElMessage.warning("非必填参数不允许在必填参数之前");
        return;
      }
      const temp = parent[index];
      parent[index] = parent[index - 1];
      parent[index - 1] = temp;
    }
  }
};
const sortDown = (id: string) => {
  const parent = dataStructureUtils.getTreeParentById(
    id,
    localForm.value.document.params!
  );
  if (parent) {
    const index = parent.findIndex((p) => p.id === id);
    if (index < parent.length - 1) {
      //判断required字段，如果当前参数必填，且下一个参数非必填，则不允许下移
      if (parent[index].required && !parent[index + 1].required) {
        ElMessage.warning("必填参数不允许在非必填参数之后");
        return;
      }
      const temp = parent[index];
      parent[index] = parent[index + 1];
      parent[index + 1] = temp;
    }
  }
};
const clearParamLine = async (id?: string) => {
  if (id === undefined) {
    try {
      await ElMessageBox.confirm("确定清空所有参数吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      });
      localForm.value.document.params = [];
      ElMessage.info("清空完成");
    } catch (error) {}
  } else {
    try {
      await ElMessageBox.confirm("确定删除该参数吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      });
      const parent = dataStructureUtils.getTreeParentById(
        id,
        localForm.value.document.params!
      );
      parent!.splice(
        parent.findIndex((p) => p.id === id),
        1
      );
      ElMessage.info("删除完成");
    } catch (error) {}
  }
};
const onRequiredChange = (id: string, row: DocumentParamItem) => {
  if (row.required && row.default !== "") {
    row.default = "";
  }
  //找到父结点，再给父结点的params数组按照required字段排序，优先显示required为true的参数
  const parent = dataStructureUtils.getTreeParentById(
    id,
    localForm.value.document.params!
  );
  if (parent) {
    parent.sort((a, b) => {
      return a.required === b.required ? 0 : a.required ? -1 : 1;
    });
  }
};
const changeFormShow = (idx: number) => {
  switch (idx) {
    case 0:
      apiFormShow.value = true;
      break;
    case 1:
      dialogFormShow.value = true;
      break;
    default:
      codes[idx - 2].show = true;
      break;
  }
};
defineExpose({
  codeSnippetPlaceholder,
  changeFormShow,
});
</script>

<style lang="scss" scoped>
.form-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 20px;
  box-sizing: border-box;

  &:hover {
    background: var(--el-color-primary-light-9);
  }
}

:deep(.el-table .cell) {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ml-1 {
  margin-left: 1px !important;
}
</style>
