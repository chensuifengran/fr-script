<script lang="ts" setup>
import { ElNotification } from "element-plus";
const { appAsideBgColor, appBackground } = useAppTheme();
const props = defineProps({
  model: {
    type: Object as PropType<TestModuleType>,
  },
  type: {
    type: String as PropType<"invokeApi" | "util">,
    default: "invokeApi",
  },
  showHover: {
    type: Boolean,
    default: true
  }
});

const hoverBeforeWidth = computed(() => {
  return props.showHover ? "4px" : "0px"
})
const showAnimation = computed(() => {
  return props.showHover ? "all 0.5s" : "none"
})
const listStore = useListStore();
const dialog = computed(() => {
  const d = props.model?.dialog;
  return {
    ...d,
    args: d?.args?.map((arg) => {
      let opts = arg.options;
      if (opts) {
        if (typeof opts === "function") {
          opts = opts(listStore);
        }
      }
      return {
        ...arg,
        options: opts,
      };
    }),
  };
});
const aliasName = computed(() => {
  const targetMethodName = dialog.value?.targetMethodName;
  return getInvokeApiMethods().find((i) => i.name === targetMethodName)?.exportFn?.alias;
});
const name = computed(() => {
  return dialog.value?.title || dialog.value?.targetMethodName;
});
const { invokeDynamicDialog } = useCore();

const detailsContentRef = ref<HTMLDivElement>();
const showDetails = ref(false);
const itemHeight = ref("40px");
const overflow = ref("hidden");
const changeShowDetails = () => {
  const value = !showDetails.value;
  if (value && !props.model?.document) {
    ElNotification.closeAll();
    ElNotification({
      title: "该API暂无使用文档",
      type: "warning",
      position: "bottom-right",
    });
    return;
  }
  if (value) {
    const t = setTimeout(async () => {
      clearTimeout(t);
      overflow.value = "auto";
      await autoDetailHeight();
    });
  } else {
    overflow.value = "hidden";
  }
  showDetails.value = value;
};

const firstExampleCode = reactive<string[]>([]);
onMounted(() => {
  const code = props.model?.document?.example?.code;
  code && firstExampleCode.push(...code);
});
const resetExampleCode = () => {
  if (firstExampleCode.length) {
    let target: InvokeApiMethodType | undefined;

    const targetMethodName = dialog.value?.targetMethodName;
    if (props.type === "invokeApi") {
      target = getInvokeApiMethods().find((i) => i.name === targetMethodName);
    } else if (props.type === "util") {
    }

    if (target) {
      const codes = target.testModule?.document?.example?.code;
      if (codes) {
        codes.splice(0, codes.length, ...firstExampleCode);
      }
    } else {
      console.error(`重置示例失败：未找到${targetMethodName}的测试模块`);
    }
  }
};
const autoDetailHeight = async () => {
  const bodyHight = document.body.clientHeight;
  if (showDetails.value) {
    //保证示例代码变化后能够获得最新的高度
    await nextTick();
    const h = detailsContentRef.value?.clientHeight || 0;
    const height = Math.min(
      h ? h + 22 : 0,
      420 + (bodyHight - 661 > 0 ? (bodyHight - 661) / 2 : 0)
    );
    detailsMaxHeight.value = height + "px";
    itemHeight.value = 40 + height + "px";
  } else {
    itemHeight.value = "40px";
  }
};
const detailsMaxHeight = ref("420px");
watchEffect(async () => {
  //监测示例代码的值变化
  props.model?.document?.example?.code.join("");
  await autoDetailHeight();
});
</script>

<template>
  <div class="api-doc-item" @click="changeShowDetails">
    <div class="api-header drag-handle">
      <div class="info">
        <el-icon class="icon" v-if="!showDetails">
          <span i-solar-alt-arrow-right-line-duotone></span>
        </el-icon>
        <el-icon class="icon" v-else>
          <span i-solar-alt-arrow-down-line-duotone></span>
        </el-icon>
        <span>[{{ aliasName || dialog?.targetMethodName }}]{{ name }}</span>
      </div>
      <el-tooltip effect="dark" content="测试调用" placement="left" v-if="type === 'invokeApi'">
        <el-button size="small" type="primary" circle @click.stop="invokeDynamicDialog(
          dialog?.targetMethodName!,
          aliasName || dialog?.targetMethodName,
          dialog?.content,
          'test'
        )">
          <el-icon size="large"><span i-mdi-bug-play></span></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip v-else effect="dark" content="查看文档" placement="left">
        <el-button size="small" :disabled="!model!.canBeCalled"><el-icon size="large"><span
              i-mdi-file-eye-outline></span></el-icon></el-button>
      </el-tooltip>
    </div>
    <div class="api-details" v-if="showDetails">
      <div class="content" v-if="model?.document" ref="detailsContentRef">
        <div class="api-details-item">
          <span>方法名：</span>
          <span>{{ aliasName || dialog?.targetMethodName }}</span>
        </div>
        <div class="api-details-item" v-if="model.document.howToUse">
          <span>方法描述：</span>
          <span>{{ model.document.howToUse }}</span>
        </div>
        <div class="api-details-item" v-if="model.document.params" @click.stop>
          <span>参数：</span>
          <el-table :data="model.document.params" table-layout="auto" row-key="name">
            <el-table-column prop="name" label="参数名" />
            <el-table-column prop="required" label="必填">
              <template #default="scope">
                <span v-if="scope.row.required">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="instructions" label="说明" width="240" />
            <el-table-column prop="type" label="类型">
              <template #default="scope">
                <span v-if="typeof scope.row.type === 'string'">
                  {{ scope.row.type }}</span>
                <span v-else>enum<el-tooltip effect="dark" :content="scope.row.type?.join(',') || ''"
                    placement="top-start">
                    <el-icon>
                      <span i-mdi-information-variant></span>
                    </el-icon> </el-tooltip></span>
              </template>
            </el-table-column>
            <el-table-column prop="default" label="默认值" />
          </el-table>
        </div>
        <div class="api-details-item" v-if="model.document.returnValue">
          <span>返回值：</span>
          <span>{{ model.document.returnValue?.instructions }}</span>
          <code-view v-if="model.document.returnValue.type" :highlight-code="model.document.returnValue.type"
            :show-copy="false" @click.stop="" />
        </div>
        <div class="api-details-item" v-if="model.document.example" @click.stop="">
          <span class="example-title"><el-tooltip effect="dark" content="恢复默认示例代码" placement="top-start"
              v-if="model.document.example.code.join('') !== firstExampleCode.join('')">
              <el-icon class="refreshCode" @click.stop="resetExampleCode">
                <span i-mdi-file-sync-outline></span>
              </el-icon> </el-tooltip>示例：</span>
          <span>{{ model.document.example.title }}</span>
          <code-view :highlight-code="model.document.example.code" @click.stop="" />
        </div>
      </div>
      <el-empty description="该API暂无使用文档" v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-doc-item {
  width: 100%;
  height: v-bind(itemHeight);
  background: v-bind(appBackground);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 5px;
  border-radius: 5px;
  box-shadow: v-bind(appAsideBgColor) 0 0 3px;
  cursor: pointer;
  transition: v-bind(showAnimation);

  &:hover {
    box-shadow: #a0e0bd 0 0 3px;

    &::before {
      content: "";
      z-index: 100;
      position: absolute;
      top: 0;
      left: 0;
      width: v-bind(hoverBeforeWidth);
      height: 0;
      background-color: var(--el-color-primary-light-3);
      animation: forwards 0.5s heightChange;
    }
  }

  .api-header {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
    background: v-bind(appAsideBgColor);
    position: relative;

    .info {
      display: flex;
      flex-direction: row;
      align-items: center;

      .icon {
        // margin-left: 10px;
        color: #537e62;
        cursor: default;
        margin-right: 10px;

        &:hover {
          color: #05d74e;
        }
      }
    }
  }
  .api-details {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    box-sizing: border-box;
    max-height: v-bind(detailsMaxHeight);
    overflow-y: v-bind(overflow);
    .api-details-item {
      margin-bottom: 10px;
      .example-title {
        display: flex;
        flex-direction: row;
        align-items: center;

        .refreshCode {
          margin-left: 10px;
          cursor: pointer;

          &:hover {
            color: #00e14b;
          }
        }
      }
    }
  }
}

@keyframes heightChange {
  from {
    height: 0;
    top: 50%;
  }

  to {
    height: 100%;
    top: 0;
  }
}
</style>

<style lang="scss">
.api-doc-item {
  .el-empty {
    padding: 0;
  }
}
</style>
