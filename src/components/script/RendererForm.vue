<template>
  <div class="renderer-form">
    <el-alert
      v-if="isPreviewForm"
      title="表单预览"
      type="info"
      description="表单预览仅能修改组件默认值，修改/删除组件需打开下方的“组件管理树”进行修改。"
      show-icon
      class="alert"
    />
    <ElCard class="box-card" v-for="g in showList" :key="g.groupLabel">
      <template #header>
        <div class="card-header">
          <span>{{ g.groupLabel }}</span>
          <el-switch
            v-model="g.enable"
            v-if="g.groupLabel !== '*脚本设置'"
            @change="rendererListChangeHandle"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </div>
      </template>
      <div v-show="g.enable">
        <el-descriptions
          v-if="
            g.selectList.length ||
            g.multipleGroupSelectList.length ||
            g.groupSelectList.length ||
            g.inputList?.length
          "
          class="descriptions-box"
          direction="horizontal"
          :column="2"
          size="default"
          border
        >
          <el-descriptions-item v-for="s in g.selectList" :key="s.label" :label="s.label">
            <el-select
              v-model="s.value"
              :placeholder="s.label"
              @change="rendererListChangeHandle"
            >
              <el-option
                v-for="item in s.options"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item
            v-for="s in g.multipleGroupSelectList"
            :key="s.label"
            :label="s.label"
          >
            <el-select
              multiple
              :multiple-limit="s.limit"
              v-model="s.value"
              :placeholder="s.label"
              @change="rendererListChangeHandle"
            >
              <el-option-group
                v-for="group in s.options"
                :key="group.groupLabel"
                :label="group.groupLabel"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-option-group>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item
            v-for="s in g.groupSelectList"
            :key="s.label"
            :label="s.label"
          >
            <el-select
              v-model="s.value"
              :placeholder="s.label"
              @change="rendererListChangeHandle"
            >
              <el-option-group
                v-for="group in s.options"
                :key="group.groupLabel"
                :label="group.groupLabel"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-option-group>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item v-for="i in g.inputList" :key="i.label" :label="i.label">
            <el-input
              v-model="i.value"
              :placeholder="i.label"
              @change="rendererListChangeHandle"
            />
          </el-descriptions-item>
        </el-descriptions>
        <el-checkbox
          v-for="c in g.checkList"
          :key="c.label"
          :label="c.label"
          v-model="c.checked"
          :disabled="
            isPreviewForm &&
            g.groupLabel === '*脚本设置' &&
            c.label === '导入上次运行配置'
          "
          @change="configChangeHandle(c.label)"
        />
        <div class="table-list-div" v-for="t in g.tableList">
          <div>{{ t.label }}</div>
          <el-table
            table-layout="fixed"
            :data="t.tableData"
            style="width: 100%"
            max-height="250"
            @change="rendererListChangeHandle"
          >
            <el-table-column
              v-for="h in t.tableHeader"
              :prop="h.prop"
              :key="h.label"
              :label="h.label"
              :width="h.width"
            ></el-table-column>
            <el-table-column>
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="t.tableData.splice(scope.$index, 1)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-descriptions
            class="descriptions-box"
            direction="horizontal"
            :column="2"
            size="default"
            border
          >
            <el-descriptions-item
              v-for="p in t.inputProp"
              :key="p.propLabel"
              :label="p.propLabel"
            >
              <template v-if="p.type === 'select'">
                <el-select
                  v-model="p.value"
                  :placeholder="p.propLabel"
                  @change="rendererListChangeHandle"
                >
                  <el-option
                    v-for="item in p.options"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </template>
              <template v-else-if="p.type === 'input-number'">
                <el-input-number
                  v-model="(p.value as number)"
                  :placeholder="p.propLabel"
                />
              </template>
              <template v-else>
                <el-input v-model="p.value" :placeholder="p.propLabel" />
              </template>
            </el-descriptions-item>
          </el-descriptions>
          <el-button style="width: 100%" @click="onAddItem(t)">添加</el-button>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const props = defineProps({
  isPreviewForm: {
    type: Boolean,
    default: false,
  },
  reInit: {
    type: Function as PropType<() => boolean>,
    default: () => false,
  },
  saveBuildForm: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
});
const listStore = useListStore();
const { rendererList: storeRendererList, previewRendererList, scriptList } = storeToRefs(
  listStore
);
const rendererList = props.isPreviewForm
  ? previewRendererList.value
  : storeRendererList.value;
const localPreviewValue = reactive([...previewRendererList.value.slice(0)]);
const showList = computed(() => (props.isPreviewForm ? localPreviewValue : rendererList));
if (props.isPreviewForm) {
  watch(previewRendererList, () => {
    localPreviewValue.splice(0, localPreviewValue.length, ...previewRendererList.value);
  });
}
let isFirst = true;
const { openId } = useScriptInfo();
if (!props.isPreviewForm) {
  watch(openId, () => {
    if (openId.value !== "-1") {
      const target = scriptList.value.find((i) => i.id === openId.value);
      if (target?.setting.autoImportLastRunConfig) {
        isFirst = true;
      }
    }
  });
}

//拷贝一份默认配置
let curRendererList: RendererList[] = [];
const configChangeHandle = async (label?: string) => {
  if (props.isPreviewForm) {
    diffComponentValue();
    props.saveBuildForm!();
    return;
  }

  if (label === "导入上次运行配置") {
    const scriptConfig = rendererList.find(
      (i: RendererList) => i.groupLabel === "*脚本设置"
    );
    const mergeConfig = scriptConfig?.checkList.find(
      (i) => i.label === "导入上次运行配置"
    )?.checked;
    if (mergeConfig) {
      await nextTick();
      const defaultObj: RendererList[] = JSON.parse(JSON.stringify(rendererList));
      curRendererList = JSON.parse(JSON.stringify(rendererList));

      const r = localStorage.getItem(
        (window as any).runTimeApi.getScriptId!() + "-rendererList"
      );
      if (r) {
        //合并配置

        const targetObj: RendererList[] = JSON.parse(r);

        for (let i = 0; i < defaultObj.length; i++) {
          const defaultItem = defaultObj[i];
          const targetItem = targetObj.find(
            (item) => item.groupLabel === defaultItem.groupLabel
          );
          if (targetItem) {
            //覆盖defaultItem的enable
            defaultItem.enable = targetItem.enable;

            //判断targetItem的selectList[index].value是否存在于defaultItem的selectList[index].options中
            for (let j = 0; j < defaultItem.selectList.length; j++) {
              const defaultSelectItem = defaultItem.selectList[j];
              const targetSelectItem = targetItem.selectList.find(
                (item) => item.label === defaultSelectItem.label
              );
              if (targetSelectItem) {
                const options = defaultSelectItem.options;
                if (options.includes(targetSelectItem.value)) {
                  defaultSelectItem.value = targetSelectItem.value;
                }
              }
            }

            //覆盖defaultItem的checkList[index]的checked
            for (let j = 0; j < defaultItem.checkList.length; j++) {
              const defaultCheckItem = defaultItem.checkList[j];
              const targetCheckItem = targetItem.checkList.find(
                (item) => item.label === defaultCheckItem.label
              );
              if (targetCheckItem) {
                defaultCheckItem.checked = targetCheckItem.checked;
              }
            }

            //覆盖defaultItem的inputList[index]的value
            for (let j = 0; j < defaultItem.inputList.length; j++) {
              const defaultInputItem = defaultItem.inputList[j];
              const targetInputItem = targetItem.inputList.find(
                (item) => item.label === defaultInputItem.label
              );
              if (targetInputItem) {
                defaultInputItem.value = targetInputItem.value;
              }
            }

            /*
            提取defaultItem的groupSelectList[index]中的所有选项分组的value,
            判断targetItem的groupSelectList[index].value,
            是否存在于提取出来的数组中
            存在则覆盖defaultItem的groupSelectList[index].value
            */
            const AllValues: string[] = [];
            for (let j = 0; j < defaultItem.groupSelectList.length; j++) {
              const defaultGroupSelectItem = defaultItem.groupSelectList[j];
              const targetGroupSelectItem = targetItem.groupSelectList.find(
                (item) => item.label === defaultGroupSelectItem.label
              );
              if (targetGroupSelectItem) {
                const options = defaultGroupSelectItem.options;
                for (let k = 0; k < options.length; k++) {
                  const option = options[k];
                  for (let l = 0; l < option.options.length; l++) {
                    const item = option.options[l];
                    AllValues.push(item.value);
                  }
                }
                if (AllValues.includes(targetGroupSelectItem.value)) {
                  defaultGroupSelectItem.value = targetGroupSelectItem.value;
                }
              }
            }

            /*
            提取defaultItem的multipleGroupSelectList[index]中的所有选项分组的value,
            判断targetItem的multipleGroupSelectList[index].value,
            是否存在于提取出来的数组中
            存在则覆盖defaultItem的multipleGroupSelectList[index].value
            */
            const AllMultipleValues: string[] = [];
            for (let j = 0; j < defaultItem.multipleGroupSelectList.length; j++) {
              const defaultMultipleGroupSelectItem =
                defaultItem.multipleGroupSelectList[j];
              const targetMultipleGroupSelectItem = targetItem.multipleGroupSelectList.find(
                (item) => item.label === defaultMultipleGroupSelectItem.label
              );
              if (targetMultipleGroupSelectItem) {
                const options = defaultMultipleGroupSelectItem.options;
                for (let k = 0; k < options.length; k++) {
                  const option = options[k];
                  for (let l = 0; l < option.options.length; l++) {
                    const item = option.options[l];
                    AllMultipleValues.push(item.value);
                  }
                }
                const targetMultipleGroupSelectItemValue =
                  targetMultipleGroupSelectItem.value;
                const newTargetMultipleGroupSelectItemValue: string[] = [];
                for (let k = 0; k < targetMultipleGroupSelectItemValue.length; k++) {
                  const item = targetMultipleGroupSelectItemValue[k];
                  if (AllMultipleValues.includes(item)) {
                    newTargetMultipleGroupSelectItemValue.push(item);
                  }
                }
                defaultMultipleGroupSelectItem.value = newTargetMultipleGroupSelectItemValue;
              }
            }

            //拿到defaultItem的tableList[index]的inputProp所有的propLabel
            const AllTableInputPropLabel: string[] = [];
            for (let j = 0; j < defaultItem.tableList.length; j++) {
              const defaultTableItem = defaultItem.tableList[j];
              const targetTableItem = targetItem.tableList.find(
                (item) => item.label === defaultTableItem.label
              );
              if (targetTableItem) {
                const inputProp = defaultTableItem.inputProp;
                AllTableInputPropLabel.push(...inputProp.map((i) => i.propLabel));
                //判断targetTableItem的tableData的每一项的键是否存在于AllTableInputPropLabel中
                const tableData = targetTableItem.tableData;
                for (let k = 0; k < tableData.length; k++) {
                  const item = tableData[k];
                  for (const key in item) {
                    if (Object.prototype.hasOwnProperty.call(item, key)) {
                      if (!AllTableInputPropLabel.includes(key)) {
                        delete (item as any)[key];
                      }
                    }
                  }
                }
                //覆盖defaultTableItem的tableData
                defaultTableItem.tableData = tableData;
              }
            }
          }
        }
        defaultObj.find((i) => {
          if (i.groupLabel === "*脚本设置") {
            i.checkList.find((i) => i.label === "导入上次运行配置")!.checked = true;
            return;
          }
        });
        rendererList.splice(0, rendererList.length, ...defaultObj);
      }
      ElNotification.closeAll();
      ElNotification({
        title: "配置导入完成",
        type: "success",
        position: "bottom-right",
      });
    } else {
      const { openId } = useScriptInfo();
      if (openId.value === "-1") {
        return;
      }
      ElNotification.closeAll();
      ElNotification({
        title: "取消配置导入",
        type: "info",
        position: "bottom-right",
      });
      curRendererList.find((i) => {
        if (i.groupLabel === "*脚本设置") {
          i.checkList.find((i) => i.label === "导入上次运行配置")!.checked = false;
          return;
        }
      });
      rendererList.splice(0, rendererList.length, ...curRendererList);
    }
  }
  // window["rendererList"] = JSON.parse(JSON.stringify(rendererList));
};

const onAddItem = (t: {
  label: string;
  tableData: object[];
  tableHeader: TableFormHeader[];
  inputProp: {
    propLabel: string;
    type: "select" | "input" | "input-number";
    value: string | number;
    options: string[];
  }[];
}) => {
  const dataObj: any = {};
  const table = JSON.parse(JSON.stringify(t));

  const ip = table.inputProp;
  for (let i = 0; i < ip.length; i++) {
    const e = ip[i];
    dataObj[e.propLabel] = e.value;
  }
  t.tableData.push(dataObj);
  rendererListChangeHandle();
};

onMounted(() => {
  if (props.isPreviewForm) return;
  const t = setTimeout(() => {
    watchEffect(async () => {
      const reInit = props.reInit();
      if (reInit) {
        //重新初始化脚本需要等待一秒先让UI表单渲染完成再导入配置，否则会导致自动导入上次运行配置失效
        await new Promise<void>((resolve) => {
          const t = setTimeout(() => {
            clearTimeout(t);
            resolve();
          }, 1000);
        });
        isFirst = true;
      }
      if (!isFirst) return;

      if (openId.value !== "-1") {
        const target = scriptList.value.find((i) => i.id === openId.value);
        if (!target?.setting.autoImportLastRunConfig) {
          return;
        } else if (target.setting.autoImportLastRunConfig) {
          const scriptConfig = (window as any).rendererList?.find(
            (i: any) => i.groupLabel === "*脚本设置"
          );
          if (scriptConfig) {
            const importLastRunConfig = scriptConfig.checkList.find(
              (i: any) => i.label === "导入上次运行配置"
            );
            if (importLastRunConfig) {
              importLastRunConfig.checked = true;
            }
          }
        }
      }
      const scriptConfig = (window as any).rendererList.find(
        (i: any) => i.groupLabel === "*脚本设置"
      );

      if (
        scriptConfig === undefined ||
        scriptConfig?.checkList.find((i: any) => i.label === "导入上次运行配置") ===
          undefined
      ) {
        return;
      }

      if (!props.isPreviewForm) {
        configChangeHandle("导入上次运行配置");
        isFirst = false;
      }
    });
    clearTimeout(t);
  }, 1000);
});
//"multiplSelection" | "groupSelect" | "select" | "check" | "table" | "input"转换为previewRendererList对应的列表
const bTypeToPType = (bType: string) => {
  switch (bType) {
    case "multiplSelection":
      return "multipleGroupSelectList";
    default:
      return bType + "List";
  }
};

//比较scriptStore.previewRendererList 和 scriptStore.previewBuildFormList各组件默认值，不一致则以previewRendererList为准
const diffComponentValue = () => {
  const { previewRendererList, previewBuildFormList } = storeToRefs(listStore);
  previewBuildFormList.value.forEach((i) => {
    const type = bTypeToPType(i.type);
    const target = previewRendererList.value.find(
      (j) => j.groupLabel === i.targetGroupLabel
    );
    if (target) {
      i.enable = target.enable;
      const targetItem = (target as any)[type].find((j: any) => j.label === i.label);
      if (targetItem) {
        if (type === "checkList") {
          const item = i as {
            targetGroupLabel: string;
            type:
              | "multiplSelection"
              | "groupSelect"
              | "select"
              | "check"
              | "table"
              | "input";
            label: string;
            checked: boolean;
            enable?: boolean;
          };
          if (targetItem.checked !== item.checked) {
            item.checked = targetItem.checked;
          }
        } else {
          const item = i as {
            targetGroupLabel: string;
            type:
              | "multiplSelection"
              | "groupSelect"
              | "select"
              | "check"
              | "table"
              | "input";
            label: string;
            value: string | string[];
            enable?: boolean;
          };
          if (targetItem.value !== item.value) {
            item.value = targetItem.value;
          }
        }
      }
    }
  });
};

const rendererListChangeHandle = () => {
  if (props.isPreviewForm) {
    diffComponentValue();
    props.saveBuildForm!();
  }
};
</script>

<style lang="scss" scoped>
.renderer-form {
  margin-bottom: 10px;
  width: 100%;

  .box-card {
    margin: 0 10px;
    margin-bottom: 10px;

    .table-list-div {
      padding: 10px;
    }

    .descriptions-box {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.alert {
  margin: 0 0 10px 10px;
}
</style>
<style lang="scss">
.renderer-form {
  overflow-x: hidden;

  .el-card__body {
    padding: 0 20px;
  }

  .el-card__header {
    padding: 5px 20px;
  }
}
</style>
