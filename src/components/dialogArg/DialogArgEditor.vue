<template>
  <general-dialog :callback="editDialogCallback" title="修改参数" v-model="editDialogForm.dialog.visible">
    <template #element>
      <div class="dialog-form">
        <el-form label-position="left" label-width="150px" :model="editDialogForm">
          <el-form-item label="字段命名" prop="name">
            <template v-if="documentParams.length">
              <el-select v-model="editDialogForm.name" filterable allow-create>
                <el-option v-for="argItem in documentParams" :key="argItem.id" :label="argItem.name"
                  :value="argItem.name" />
              </el-select>
            </template>
            <template v-else>
              <el-input v-model="editDialogForm.name" />
            </template>
          </el-form-item>
          <el-form-item label="字段标签" prop="label">
            <el-input v-model="editDialogForm.label" />
          </el-form-item>
          <el-form-item label="不在API调试中使用" prop="noTest">
            <el-switch v-model="editDialogForm.noTest" @change="onNoTestChange" />
          </el-form-item>
          <el-form-item label="仅在API调试中使用" prop="onlyTest">
            <el-switch v-model="editDialogForm.onlyTest" @change="onOnlyTestChange" />
          </el-form-item>
          <el-form-item label="显示条件" prop="displayCondition">
            <el-select v-model="editDialogForm.displayCondition" multiple>
              <el-option v-for="argItem in model" :key="argItem.id" :label="argItem.name + `(${argItem.label})`"
                :value="argItem.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="输入提示" prop="placeholder">
            <el-input v-model="editDialogForm.placeholder" />
          </el-form-item>
          <template v-if="editDialogForm.componentType === 'DirInput'">
            <el-form-item label="后缀" prop="component.dirInput.suffix">
              <el-input v-model="editDialogForm.component.dirInput.suffix" />
            </el-form-item>
            <el-form-item label="验证路径" prop="component.dirInput.verifyPath">
              <el-switch v-model="editDialogForm.component.dirInput.verifyPath" />
            </el-form-item>
            <el-form-item label="默认值" prop="component.dirInput.value">
              <el-input v-model="editDialogForm.component.dirInput.value" />
            </el-form-item>
          </template>
          <template v-if="editDialogForm.componentType === 'FileInput'">
            <el-form-item label="后缀" prop="component.fileInput.suffix">
              <el-input v-model="editDialogForm.component.fileInput.suffix" />
            </el-form-item>
            <el-form-item label="验证路径" prop="component.fileInput.verifyPath">
              <el-switch v-model="editDialogForm.component.fileInput.verifyPath" />
            </el-form-item>
            <el-form-item label="是否多选" prop="component.fileInput.multiple">
              <el-switch v-model="editDialogForm.component.fileInput.multiple" />
            </el-form-item>
            <template v-if="editDialogForm.component.fileInput.multiple">
              <el-form-item label="默认值" prop="component.fileInput.mValue">
                <el-select v-model="editDialogForm.component.fileInput.mValue" multiple allow-create
                  filterable></el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="默认值" prop="component.fileInput.value">
                <el-input v-model="editDialogForm.component.fileInput.value" />
              </el-form-item>
            </template>
          </template>
          <template v-if="editDialogForm.componentType === 'input'">
            <el-form-item label="默认值" prop="component.input.value">
              <el-input v-model="editDialogForm.component.input.value" />
            </el-form-item>
          </template>
          <template v-if="editDialogForm.componentType === 'RectInput'">
            <el-form-item label="目标图片路径" prop="component.rectInput.targetSrc">
              <el-input v-model="editDialogForm.component.rectInput.targetSrc" />
            </el-form-item>
            <el-form-item label="默认值" prop="component.rectInput.value">
              <rect-input v-model="editDialogForm.component.rectInput.value" />
            </el-form-item>
          </template>
          <template v-if="editDialogForm.componentType === 'select'">
            <el-form-item label="选项类型" prop="component.select.optionType">
              <el-select v-model="editDialogForm.component.select.optionType">
                <el-option label="数组" value="array" />
                <el-option label="函数" value="function" />
              </el-select>
            </el-form-item>
            <template v-if="editDialogForm.component.select.optionType === 'array'">
              <el-form-item label="选项" prop="component.select.options">
                <el-select v-model="editDialogForm.component.select.options" multiple filterable
                  allow-create></el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="选项" prop="component.select.fnOptionsStr">
                <el-input v-model="editDialogForm.component.select.fnOptionsStr" />
              </el-form-item>
            </template>
            <el-form-item label="选项分隔符" prop="component.select.selectOptionSeparator">
              <el-input v-model="editDialogForm.component.select.selectOptionSeparator" />
            </el-form-item>
            <el-form-item label="是否多选" prop="component.select.multiple">
              <el-switch v-model="editDialogForm.component.select.multiple" />
            </el-form-item>
            <el-form-item v-if="editDialogForm.component.select.multiple" label="不允许新建"
              prop="component.select.notAllowCreate">
              <el-switch v-model="editDialogForm.component.select.notAllowCreate" />
            </el-form-item>
            <template v-if="editDialogForm.component.select.multiple">
              <el-form-item label="默认值" prop="component.select.mValue">
                <el-select v-model="editDialogForm.component.select.mValue" multiple
                  :allow-create="!editDialogForm.component.select.notAllowCreate" filterable>
                  <template v-if="editDialogForm.component.select.optionType === 'array'">
                    <el-option v-for="item in editDialogForm.component.select.options" :key="item" :label="item"
                      :value="item" />
                  </template>
                  <template v-else>
                    <el-option v-for="item in parseFnStr(editDialogForm.component.select.fnOptionsStr)" :key="item"
                      :label="item" :value="item" />
                  </template>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="默认值" prop="component.select.value">
                <el-select v-model="editDialogForm.component.select.value"
                  :allow-create="!editDialogForm.component.select.notAllowCreate" filterable>
                  <template v-if="editDialogForm.component.select.optionType === 'array'">
                    <el-option v-for="item in editDialogForm.component.select.options" :key="item" :label="item"
                      :value="item" />
                  </template>
                  <template v-else>
                    <el-option v-for="item in parseFnStr(editDialogForm.component.select.fnOptionsStr)" :key="item"
                      :label="item" :value="item" />
                  </template>
                </el-select>
              </el-form-item>
            </template>
          </template>
          <template v-if="editDialogForm.componentType === 'slider'">
            <el-form-item label="最小值" prop="component.slider.range.min">
              <el-input-number v-model="editDialogForm.component.slider.range.min" />
            </el-form-item>
            <el-form-item label="最大值" prop="component.slider.range.max">
              <el-input-number v-model="editDialogForm.component.slider.range.max" />
            </el-form-item>
            <el-form-item label="步长" prop="component.slider.range.step">
              <el-input-number v-model="editDialogForm.component.slider.range.step" />
            </el-form-item>
            <el-form-item label="默认值" prop="component.slider.value">
              <slider-input v-model="editDialogForm.component.slider.value"
                :step="editDialogForm.component.slider.range.step" :min="editDialogForm.component.slider.range.min"
                :max="editDialogForm.component.slider.range.max" :width="100" label="默认值" hide-label />
            </el-form-item>
          </template>
          <template v-if="editDialogForm.componentType === 'switch'">
            <el-form-item label="开启文本" prop="component.switch.activeText">
              <el-input v-model="editDialogForm.component.switch.activeText" />
            </el-form-item>
            <el-form-item label="关闭文本" prop="component.switch.inactiveText">
              <el-input v-model="editDialogForm.component.switch.inactiveText" />
            </el-form-item>
            <el-form-item label="默认值" prop="component.switch.value">
              <el-switch v-model="editDialogForm.component.switch.value"
                :active-text="editDialogForm.component.switch.activeText"
                :inactive-text="editDialogForm.component.switch.inactiveText" />
            </el-form-item>
          </template>
          <template v-if="editDialogForm.componentType === 'numberInput'">
            <el-form-item label="默认值" prop="component.numberInput.value">
              <el-input-number v-model="editDialogForm.component.numberInput.value" />
            </el-form-item>
          </template>
          <template v-if="editDialogForm.componentType === 'numberRangeInput'">
            <el-form-item label="范围限制" prop="component.numberRangeInput.limit">
              <range-input v-model="editDialogForm.component.numberRangeInput.limit" />
            </el-form-item>
            <el-form-item label="默认值" prop="component.numberRangeInput.value">
              <range-input v-model="editDialogForm.component.numberRangeInput.value"
                :limit="editDialogForm.component.numberRangeInput.limit" />
            </el-form-item>
          </template>
        </el-form>
      </div>
    </template>
  </general-dialog>
  <div w-full flex flex-row pos-relative h-85vh position-relative>
    <div flex-1 overflow-y-scroll overflow-x-hidden p-3 box-border class="b1">
      <el-text>预设组件</el-text>
      <el-divider />
      <VueDraggable v-model="localArgs" :animation="150" :group="{ name: 'args', pull: 'clone', put: false }"
        ghostClass="ghost" :clone="clone" :sort="false">
        <dialog-arg-item v-for="argItem in localArgs" :key="argItem.id" :argItem="argItem" />
      </VueDraggable>
    </div>
    <div flex-1 h-full overflow-y-scroll overflow-x-hidden ml-1 p-3 box-border class="b1">
      <el-text>弹窗参数组件</el-text>
      <el-divider />
      <VueDraggable h-full w-full v-model="model" :animation="150" :group="{ name: 'args' }" ghostClass="ghost"
        :sort="true">
        <dialog-arg-item v-for="argItem in model" :key="argItem.id" :argItem="argItem" edit @on-edit="editArg"
          @on-delete="delArg" />
      </VueDraggable>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';
import { nanoid } from 'nanoid';
import { ListStore } from '../../store/listStore';
defineProps({
  documentParams: {
    type: Array as PropType<DocumentParamItem[]>,
    default: []
  }
});
const editDialogForm = reactive({
  componentType: <"input" | "RectInput" | "slider" | "switch" | "DirInput" | "numberInput" | "numberRangeInput" | "select" | "FileInput" | undefined>undefined,
  noTest: false,//此字段不在API调试中使用(展示)
  onlyTest: false,//此字段只在API调试中使用(展示)
  name: "",//字段(英文)名
  label: "",//字段标签
  displayCondition: <string[]>[],//显示条件，可填入其它字段的name，当其它字段的值为true时显示
  placeholder: "请输入",//输入提示
  component: {//组件特有字段
    select: {
      optionType: "array",//'array' | 'function 辅助字段
      options: <string[]>[],// optionType === 'array'
      fnOptionsStr: '(store) => {return ["a1","a2"]}', // optionType === 'function' 辅助字段
      selectOptionSeparator: "", // 选项分隔符
      notAllowCreate: false,  // 是否允许创建新选项
      multiple: false,  // 是否多选
      value: "",  // mutiple === false时绑定的值
      mValue: <string[]>[], // multiple === true时绑定的值 辅助字段
    },
    fileInput: {
      verifyPath: false,// 是否验证路径
      suffix: "",// 后缀
      multiple: <boolean>false,  // 是否多选
      value: "",  // mutiple === false时绑定的值
      mValue: <string[]>[], // multiple === true时绑定的值 辅助字段
    },
    input: {
      value: "",// 绑定的值
    },
    rectInput: {
      value: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },// 绑定的值
      targetSrc: "",// 目标图片路径
    },
    slider: {
      value: 0,// 绑定的值
      range: {
        min: 0,
        max: 100,
        step: 1
      },// 滑块范围
    },
    switch: {
      value: false,// 绑定的值
      activeText: '是',// 开启文本
      inactiveText: '否',// 关闭文本
    },
    dirInput: {
      value: "",// 绑定的值
      suffix: "",// 后缀
      verifyPath: false,// 是否验证路径
    },
    numberInput: {
      value: 0,// 绑定的值
    },
    numberRangeInput: {
      value: <[number, number]>[0, 100],// 绑定的值
      limit: <[number, number]>[0, 100],// 范围限制
    }
  },
  dialog: {
    visible: false,
    targetId: ''
  }
});
const onOnlyTestChange = () => {
  if (editDialogForm.onlyTest) {
    editDialogForm.noTest = false;
  }
}
const onNoTestChange = () => {
  if (editDialogForm.noTest) {
    editDialogForm.onlyTest = false;
  }
}
const model = defineModel<DialogDynamicArgItem[]>({
  default: []
});

const localArgs = [
  <DialogArg.Input>{
    componentType: 'input',
    value: '',
    desc: "文本输入框",
  },
  <DialogArg.RectInput>{
    componentType: 'RectInput',
    value: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    targetSrc: "",
    desc: "矩形参数输入框",
  },
  <DialogArg.Slider>{
    componentType: 'slider',
    value: 0,
    range: {
      min: 0,
      max: 100,
      step: 1
    },
    desc: "滑块进度条"
  },
  <DialogArg.Switch>{
    componentType: 'switch',
    value: false,
    activeText: '是',
    inactiveText: '否',
    desc: "切换按钮"
  },
  <DialogArg.DirInput>{
    componentType: 'DirInput',
    value: '',
    suffix: '',
    verifyPath: false,
    desc: "目录输入框"
  },
  <DialogArg.NumberInput>{
    componentType: 'numberInput',
    value: 0,
    desc: "数字输入框"
  },
  <DialogArg.NumberRangeInput>{
    componentType: 'numberRangeInput',
    value: [0, 100],
    limit: [0, 100],
    desc: "数字范围输入框"
  },
  <DialogArg.Select<string[]>>{
    desc: "单选下拉框(选项为string数组类型)",
    componentType: 'select',
    value: "",
    options: [],
    selectOptionSeparator: "",
    notAllowCreate: true,
    multiple: false
  },
  <DialogArg.Select<(store: ListStore) => string[]>>{
    desc: "单选下拉框(选项为带有ListStore上下文的函数类型)",
    componentType: 'select',
    value: "",
    options: (_store: ListStore) => {
      const options = ['选项1', '选项2'];
      return options;
    },
    selectOptionSeparator: "",
    notAllowCreate: true,
    multiple: false
  },
  <DialogArg.Select<string[], true>>{
    desc: "选项为string或number类型的多选下拉框",
    componentType: 'select',
    value: [],
    options: [],
    selectOptionSeparator: "",
    notAllowCreate: false,
    multiple: true
  },
  <DialogArg.FileInput>{
    componentType: 'FileInput',
    value: '',
    suffix: '',
    verifyPath: false,
    desc: "文件输入框"
  },
  <DialogArg.FileInput<true>>{
    componentType: 'FileInput',
    value: [],
    suffix: '',
    verifyPath: false,
    desc: "(多)文件输入框",
    multiple: true
  },
].map(i => {
  return {
    ...i,
    id: nanoid(),
    onlyTest: false,
    noTest: false,
    name: "",
    label: i.desc || i.componentType,
    displayCondition: [],
    placeholder: ""
  };
}) as DialogDynamicArgItem[];

const clone = (element: any) => {
  const e = {
    ...element,
    id: nanoid(),
    label: element.desc
  };
  return e
}
const { appAsideBgColor } = useAppTheme();
const parseFnStr = (fnStr: string): string[] => {
  try {
    const fn = eval(fnStr);
    return fn(useListStore());
  } catch (error) {
    return [];
  }
}
const editArg = (id: string) => {
  const target = model.value?.find(i => i.id === id);
  if (target) {
    //内容回显
    editDialogForm.componentType = target.componentType;
    editDialogForm.noTest = !!target.noTest;
    editDialogForm.onlyTest = !!target.onlyTest;
    editDialogForm.name = target.name;
    editDialogForm.label = target.label;
    editDialogForm.displayCondition = target.displayCondition || [];
    editDialogForm.placeholder = target.placeholder || '';
    if (target.componentType === 'select') {
      const t = target as DialogArg.Select;
      const ot = Array.isArray(t.options) ? 'array' : 'function';
      editDialogForm.component.select.optionType = ot;
      if (Array.isArray(t.options)) {
        editDialogForm.component.select.options = t.options.map(i => '' + i);
      } else {
        editDialogForm.component.select.fnOptionsStr = t.options.toString();
      }
      editDialogForm.component.select.selectOptionSeparator = t.selectOptionSeparator || '';
      editDialogForm.component.select.notAllowCreate = !!t.notAllowCreate;
      editDialogForm.component.select.multiple = !!t.multiple;
      if (t.multiple) {
        editDialogForm.component.select.mValue = t.value as any;
      } else {
        editDialogForm.component.select.value = t.value as any;
      }
    } else if (target.componentType === 'FileInput') {
      const t = target as DialogArg.FileInput;
      editDialogForm.component.fileInput.verifyPath = !!t.verifyPath;
      editDialogForm.component.fileInput.suffix = t.suffix || '';
      editDialogForm.component.fileInput.multiple = !!t.multiple;
      if (t.multiple) {
        editDialogForm.component.fileInput.mValue = t.value as any;
      } else {
        editDialogForm.component.fileInput.value = t.value;
      }
    } else if (target.componentType === 'input') {
      const t = target as DialogArg.Input;
      editDialogForm.component.input.value = t.value;
    } else if (target.componentType === 'RectInput') {
      const t = target as DialogArg.RectInput;
      editDialogForm.component.rectInput.value = t.value;
      editDialogForm.component.rectInput.targetSrc = t.targetSrc || '';
    } else if (target.componentType === 'slider') {
      const t = target as DialogArg.Slider;
      editDialogForm.component.slider.value = t.value;
      editDialogForm.component.slider.range = t.range as any;
    } else if (target.componentType === 'switch') {
      const t = target as DialogArg.Switch;
      editDialogForm.component.switch.value = t.value;
      editDialogForm.component.switch.activeText = t.activeText || '是';
      editDialogForm.component.switch.inactiveText = t.inactiveText || '否';
    } else if (target.componentType === 'DirInput') {
      const t = target as DialogArg.DirInput;
      editDialogForm.component.dirInput.value = t.value;
      editDialogForm.component.dirInput.suffix = t.suffix || '';
      editDialogForm.component.dirInput.verifyPath = !!t.verifyPath;
    } else if (target.componentType === 'numberInput') {
      const t = target as DialogArg.NumberInput;
      editDialogForm.component.numberInput.value = t.value;
    } else if (target.componentType === 'numberRangeInput') {
      const t = target as DialogArg.NumberRangeInput;
      editDialogForm.component.numberRangeInput.value = t.value;
      editDialogForm.component.numberRangeInput.limit = t.limit || [0, 0];
    }
    editDialogForm.dialog.targetId = id;
    editDialogForm.dialog.visible = true;
  } else {
    ElMessage.error('编辑失败：未找到对应参数!');
  }
}
const editDialogCallback = () => {
  const target = model.value?.find(i => i.id === editDialogForm.dialog.targetId && i.componentType === editDialogForm.componentType);
  if (target) {
    if (target.componentType === 'DirInput') {
      target.suffix = editDialogForm.component.dirInput.suffix;
      target.verifyPath = editDialogForm.component.dirInput.verifyPath;
      target.value = editDialogForm.component.dirInput.value;
    } else if (target.componentType === 'FileInput') {
      if (editDialogForm.component.fileInput.multiple) {
        const t = target as unknown as ArgItem<DialogArg.FileInput<true>>;
        t.multiple = true;
        t.value = editDialogForm.component.fileInput.mValue;
      } else {
        const t = target as unknown as ArgItem<DialogArg.FileInput>;
        t.multiple = false;
        t.value = editDialogForm.component.fileInput.value;
      }
      target.suffix = editDialogForm.component.fileInput.suffix;
      target.verifyPath = editDialogForm.component.fileInput.verifyPath;
    } else if (target.componentType === 'input') {
      target.value = editDialogForm.component.input.value;
    } else if (target.componentType === 'RectInput') {
      target.value = editDialogForm.component.rectInput.value;
      target.targetSrc = editDialogForm.component.rectInput.targetSrc;
    } else if (target.componentType === 'slider') {
      target.value = editDialogForm.component.slider.value;
      target.range = editDialogForm.component.slider.range;
    } else if (target.componentType === 'switch') {
      target.value = editDialogForm.component.switch.value;
      target.activeText = editDialogForm.component.switch.activeText;
      target.inactiveText = editDialogForm.component.switch.inactiveText;
    } else if (target.componentType === 'numberInput') {
      target.value = editDialogForm.component.numberInput.value;
    } else if (target.componentType === 'numberRangeInput') {
      target.value = editDialogForm.component.numberRangeInput.value;
      target.limit = editDialogForm.component.numberRangeInput.limit;
    } else {
      const { multiple } = editDialogForm.component.select;
      if (editDialogForm.component.select.optionType === 'array') {
        target.options = editDialogForm.component.select.options;
      } else {
        target.options = eval(editDialogForm.component.select.fnOptionsStr);
      }
      const t = target as any;
      if (multiple) {
        t.value = editDialogForm.component.select.mValue;
        t.multiple = true;

      } else {
        t.value = editDialogForm.component.select.value;
        t.multiple = false;

      }
      target.selectOptionSeparator = editDialogForm.component.select.selectOptionSeparator;
      target.notAllowCreate = editDialogForm.component.select.notAllowCreate;
    }
    target.name = editDialogForm.name;
    target.label = editDialogForm.label;
    target.displayCondition = editDialogForm.displayCondition;
    target.placeholder = editDialogForm.placeholder;
    target.noTest = editDialogForm.noTest;
    target.onlyTest = editDialogForm.onlyTest;
    ElMessage.success('编辑成功');
  } else {
    ElMessage.error('编辑失败：未找到对应参数!');
  }
  editDialogForm.dialog.visible = false;
}
const delArg = (id: string) => {
  model.value = model.value?.filter(i => i.id !== id);
  ElMessage.success('删除成功');
}
</script>

<style lang="scss" scoped>
.b1 {
  border: 2px solid v-bind(appAsideBgColor);
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

:deep(.el-divider--horizontal) {
  margin: 3px;
  box-sizing: border-box;
}

.dialog-form {
  overflow-y: scroll;
  width: 100%;
  position: relative;
  max-height: 50vh;
  overflow-x: hidden;
  padding: 10px;
  box-sizing: border-box;
}
</style>