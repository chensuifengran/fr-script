<script lang="ts" setup>
import { ElNotification } from "element-plus";

const props = defineProps({
  model: {
    type: Object as PropType<TestModuleType>,
  },
  type: {
    type: String as PropType<"invokeApi" | "util">,
    default: "invokeApi",
  },
});
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

const exampleRef = ref<HTMLDivElement>();
const copyExampleCode = () => {
  if (exampleRef.value) {
    //删除exampleRef.value.innerText "与(和"与)之间的空格
    const replaceStr = exampleRef.value.innerText.replace(/\s+(?=[^()]*\))/g, "");
    if (execCopy(replaceStr)) {
      ElNotification({
        title: "复制成功",
        type: "success",
        position: "bottom-right",
      });
    } else {
      ElNotification({
        title: "复制失败",
        type: "error",
        position: "bottom-right",
      });
    }
  }
};
const appAsideBgColor = inject<globalThis.ComputedRef<string>>("appAsideBgColor");
const appBackground = inject<globalThis.ComputedRef<"#000" | "#fff">>("appBackground");
</script>

<template>
  <div class="api-doc-item" @click="changeShowDetails">
    <div class="api-header">
      <div class="info">
        <el-icon class="icon" v-if="!showDetails"><IEpArrowRight /></el-icon>
        <el-icon class="icon" v-else><IEpArrowDown /></el-icon>
        <span>[{{ aliasName || dialog?.targetMethodName }}]{{ name }}</span>
      </div>
      <el-button
        v-if="type === 'invokeApi'"
        size="small"
        @click.stop="invokeDynamicDialog(
            dialog?.targetMethodName!,
            aliasName || dialog?.targetMethodName,
            dialog?.content,
            'test'
            )"
        >测试调用</el-button
      >
      <el-button v-else size="small" :disabled="!model!.canBeCalled">测试调用</el-button>
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
                  {{ scope.row.type }}</span
                >
                <span v-else
                  >enum<el-tooltip
                    effect="dark"
                    :content="scope.row.type?.join(',') || ''"
                    placement="top-start"
                  >
                    <el-icon><IEpInfoFilled /></el-icon> </el-tooltip
                ></span>
              </template>
            </el-table-column>
            <el-table-column prop="default" label="默认值" />
          </el-table>
        </div>
        <div class="api-details-item" v-if="model.document.returnValue">
          <span>返回值：</span>
          <span>{{ model.document.returnValue?.instructions }}</span>
          <div class="code" v-if="model.document.returnValue.type" @click.stop="">
            <div v-for="t in model.document.returnValue.type" :key="t" v-html="t"></div>
          </div>
        </div>
        <div class="api-details-item" v-if="model.document.example" @click.stop="">
          <span class="example-title"
            ><el-tooltip
              effect="dark"
              content="恢复默认示例代码"
              placement="top-start"
              v-if="model.document.example.code.join('') !== firstExampleCode.join('')"
            >
              <el-icon class="refreshCode" @click.stop="resetExampleCode"
                ><IEpRefresh
              /></el-icon> </el-tooltip
            >示例：</span
          >
          <span>{{ model.document.example.title }}</span>
          <div class="code">
            <div v-for="c in model.document.example.code" :key="c" v-html="c"></div>
            <div
              v-html="model.document.example.code.join('\n')"
              ref="exampleRef"
              style="display: none"
            ></div>
            <el-button class="copy-code" @click="copyExampleCode" size="small"
              ><el-icon><IEpCopyDocument /></el-icon>复制</el-button
            >
          </div>
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
  transition: all 0.5s;
  margin-top: 5px;
  border-radius: 5px;
  box-shadow: v-bind(appAsideBgColor) 0 0 3px;
  cursor: pointer;
  &:hover {
    box-shadow: #a0e0bd 0 0 3px;
    &::before {
      content: "";
      z-index: 100;
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
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
  .code {
    width: 100%;
    padding: 10px 15px;
    border-radius: 4px;
    background: v-bind(appAsideBgColor);
    box-sizing: border-box;
    //文字可选的鼠标样式
    cursor: text;
    user-select: text;
    position: relative;
    // color: #ccc;

    &:hover {
      .copy-code {
        display: block;
      }
    }
    .copy-code {
      display: none;
      position: absolute;
      right: 0;
      top: 0;
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
