<template>
  <el-form-item label="子类型" prop="cForm.input.inputType">
    <el-segmented
      :options="inputTypeOptions"
      v-model="form.cForm.input.inputType"
    />
  </el-form-item>
  <template
    v-if="form.cForm.input.inputType === 'text' || !form.cForm.input.inputType"
  >
    <el-form-item label="输入模式" prop="cForm.input.text.mod">
      <el-segmented
        :options="modOpts"
        v-model="form.cForm.input.text.mod"
        @change="handleTextModChange"
      />
    </el-form-item>
    <el-form-item label="占位提示词" prop="cForm.input.text.placeholder">
      <el-input
        v-model="form.cForm.input.text.placeholder"
        placeholder="占位提示词(选填)"
        clearable
      />
    </el-form-item>
    <template v-if="form.cForm.input.text.mod !== 'textarea'">
      <el-form-item label="显示清除按钮" prop="cForm.input.text.clearable">
        <el-switch v-model="form.cForm.input.text.clearable" />
      </el-form-item>
    </template>
    <el-form-item
      label="最大字符数(-1为不限制)"
      prop="cForm.input.text.maxlength"
    >
      <el-input-number
        v-model="form.cForm.input.text.maxlength"
        controls-position="right"
        :min="-1"
        :value-on-clear="-1"
      />
    </el-form-item>
    <template
      v-if="
        form.cForm.input.text.mod !== 'password' &&
        form.cForm.input.text.maxlength > 0
      "
    >
      <el-form-item
        label="显示输入计数器"
        prop="cForm.input.text.showWordLimit"
      >
        <el-switch v-model="form.cForm.input.text.showWordLimit" />
      </el-form-item>
    </template>
    <template v-if="form.cForm.input.text.mod === 'textarea'">
      <el-form-item label="高度自适应" prop="cForm.input.text.autosizeConf">
        <el-segmented
          :options="autosizeConfOpts"
          v-model="form.cForm.input.text.autosizeConf"
        />
      </el-form-item>
      <template v-if="form.cForm.input.text.autosizeConf === 'custom'">
        <el-form-item
          label="显示行数[最小,最大]"
          prop="cForm.input.text.autosize"
        >
          <range-input
            v-model="form.cForm.input.text.autosize"
            :limit="[1, 1000]"
          />
        </el-form-item>
      </template>
    </template>
    <template v-else-if="form.cForm.input.text.mod === 'password'">
      <el-form-item label="密码可展示" prop="cForm.input.text.showPassword">
        <el-switch v-model="form.cForm.input.text.showPassword" />
      </el-form-item>
    </template>
    <el-form-item label="组件值" prop="cForm.input.text.value">
      <el-input
        v-model="form.cForm.input.text.value"
        :placeholder="form.cForm.input.text.placeholder"
        :type="form.cForm.input.text.mod || 'text'"
        :clearable="form.cForm.input.text.clearable"
        :show-password="form.cForm.input.text.showPassword"
        :maxlength="
          form.cForm.input.text.maxlength === -1
            ? undefined
            : form.cForm.input.text.maxlength
        "
        :show-word-limit="form.cForm.input.text.showWordLimit"
        :autosize="
          form.cForm.input.text.autosizeConf === 'open' ||
          form.cForm.input.text.autosizeConf === 'custom'
            ? {
                minRows: form.cForm.input.text.autosize[0],
                maxRows: form.cForm.input.text.autosize[1],
              }
            : false
        "
      />
    </el-form-item>
  </template>
  <template v-else-if="form.cForm.input.inputType === 'number'">
    <el-form-item label="最小值" prop="cForm.input.number.min">
      <el-input-number
        v-model="form.cForm.input.number.min"
        :value-on-clear="NaN"
        placeholder="最小值，留空不限制最小值"
        :controls="false"
        w-full
      />
    </el-form-item>
    <el-form-item label="最大值" prop="cForm.input.number.max">
      <el-input-number
        v-model="form.cForm.input.number.max"
        :value-on-clear="NaN"
        placeholder="最大值，留空不限制最大值"
        :controls="false"
        w-full
      />
    </el-form-item>
    <el-form-item label="步长" prop="cForm.input.number.step">
      <el-input-number
        v-model="form.cForm.input.number.step"
        :value-on-clear="1"
        placeholder="请输入步长"
        :controls="false"
        w-full
      />
    </el-form-item>
    <el-form-item label="严格步进" prop="cForm.input.number.stepStrictly"
      ><el-tooltip effect="dark" content="只能是步进的倍数" placement="right">
        <el-switch v-model="form.cForm.input.number.stepStrictly" />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="精度" prop="cForm.input.number.precision">
      <el-input-number
        v-model="form.cForm.input.number.precision"
        :value-on-clear="undefined"
        placeholder="不小于step的小数位数，留空不限制精度"
        :step="1"
        :controls="false"
        w-full
      />
    </el-form-item>
    <el-form-item label="显示控制器" prop="cForm.input.number.controls">
      <el-switch v-model="form.cForm.input.number.controls" />
    </el-form-item>
    <template v-if="form.cForm.input.number.controls">
      <el-form-item
        label="控制器位置"
        prop="cForm.input.number.controlsPosition"
      >
        <el-segmented
          :options="controlsPositionOpts"
          v-model="form.cForm.input.number.controlsPosition"
          @change="handleTextModChange"
        />
      </el-form-item>
    </template>
    <el-form-item
      label="输入框被清空时的值"
      prop="cForm.input.number.valueOnClearMod"
    >
      <el-segmented
        :options="valueOnClearModOpts"
        v-model="form.cForm.input.number.valueOnClearMod"
      />
    </el-form-item>
    <template v-if="form.cForm.input.number.valueOnClearMod === 'custom'">
      <el-form-item
        label="输入框被清空时的值"
        prop="cForm.input.number.valueOnClearNum"
      >
        <el-input-number
          v-model="form.cForm.input.number.valueOnClearNum"
          :value-on-clear="0"
          placeholder="留空为0"
          :step="1"
          :max="form.cForm.input.number.max"
          :min="form.cForm.input.number.min"
        />
      </el-form-item>
    </template>
    <el-form-item label="组件值" prop="cForm.input.number.value">
      <el-input-number
        v-model="form.cForm.input.number.value"
        :min="form.cForm.input.number.min"
        :max="form.cForm.input.number.max"
        :step="form.cForm.input.number.step"
        :step-strictly="form.cForm.input.number.stepStrictly"
        :precision="form.cForm.input.number.precision"
        :controls="form.cForm.input.number.controls"
        :controls-position="form.cForm.input.number.controlsPosition"
        :value-on-clear="
          form.cForm.input.number.valueOnClearMod === 'custom'
            ? form.cForm.input.number.valueOnClearNum
            : form.cForm.input.number.valueOnClearMod === 'default'
            ? undefined
            : form.cForm.input.number.valueOnClearMod
        "
      />
    </el-form-item>
  </template>
  <template v-else-if="form.cForm.input.inputType === 'range'">
    <el-form-item label="限制取值范围" prop="cForm.input.range.limitRange">
      <el-switch
        v-model="form.cForm.input.range.limitRange"
        @change="handleLimitRangeChange"
      />
    </el-form-item>
    <template v-if="form.cForm.input.range.limitRange">
      <el-form-item label="取值范围" prop="cForm.input.range.limit">
        <range-input
          v-model="form.cForm.input.range.limit"
          @change="handleLimitRangeChange"
        />
      </el-form-item>
    </template>
    <el-form-item label="显示控制器" prop="cForm.input.range.controls">
      <el-switch v-model="form.cForm.input.range.controls" />
    </el-form-item>
    <el-form-item label="取值范围" prop="cForm.input.range.value">
      <range-input
        v-model="form.cForm.input.range.value"
        :limit="
          form.cForm.input.range.limitRange
            ? form.cForm.input.range.limit
            : undefined
        "
        :controls="form.cForm.input.range.controls"
      />
    </el-form-item>
  </template>
  <template v-else-if="form.cForm.input.inputType === 'dir'">
    <el-form-item label="组件值" prop="cForm.input.dir.value">
      <dir-input v-model="form.cForm.input.dir.value" w-full />
    </el-form-item>
  </template>
  <template v-else-if="form.cForm.input.inputType === 'file'">
    <el-form-item label="多文件选择" prop="cForm.input.file.multiple">
      <el-switch v-model="form.cForm.input.file.multiple" />
    </el-form-item>
    <el-form-item label="组件值" prop="cForm.input.file.value">
      <template v-if="form.cForm.input.file.multiple">
        <file-input v-model="form.cForm.input.file.mValue" multiple w-full />
      </template>
      <template v-else>
        <file-input v-model="form.cForm.input.file.sValue" w-full />
      </template>
    </el-form-item>
  </template>
</template>
<script lang="ts" setup>
defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const { form } = useRenderItemEditForm();

const inputTypeOptions = [
  {
    label: "文本",
    value: "text",
  },
  {
    label: "数字",
    value: "number",
  },
  {
    label: "数字范围",
    value: "range",
  },
  {
    label: "文件夹选择",
    value: "dir",
  },
  {
    label: "文件选择",
    value: "file",
  },
];

const controlsPositionOpts = [
  {
    label: "默认",
    value: "",
  },
  {
    label: "右边",
    value: "right",
  },
];

const modOpts = [
  {
    label: "文本",
    value: "text",
  },
  {
    label: "密码",
    value: "password",
  },
  {
    label: "文本域",
    value: "textarea",
  },
];

const autosizeConfOpts = [
  {
    label: "关闭",
    value: "close",
  },
  {
    label: "开启",
    value: "open",
  },
  {
    label: "自定义",
    value: "custom",
  },
];

const valueOnClearModOpts = computed(() => {
  return [
    {
      label: "默认",
      value: "default",
    },
    {
      label: "最小值",
      value: "min",
      disabled:
        !form.cForm.input.number.min ||
        Number.isNaN(form.cForm.input.number.min),
    },
    {
      label: "最大值",
      value: "max",
      disabled:
        !form.cForm.input.number.max ||
        Number.isNaN(form.cForm.input.number.max),
    },
    {
      label: "自定义",
      value: "custom",
    },
  ];
});

const handleTextModChange = () => {
  if (form.cForm.input.text.mod === "text" || !form.cForm.input.text.mod) {
    form.cForm.input.text.showPassword = false;
  }
};

const handleLimitRangeChange = () => {
  if (form.cForm.input.range.limitRange) {
    const [min, max] = form.cForm.input.range.limit;
    const [vMin, vMax] = form.cForm.input.range.value;
    if (vMin < min) {
      form.cForm.input.range.value = [min, vMax];
    }
    if (vMax > max) {
      form.cForm.input.range.value = [vMin, max];
    }
  }
};
</script>

<style lang="scss" scoped></style>
