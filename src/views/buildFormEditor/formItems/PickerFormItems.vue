<template>
  <el-form-item label="子类型" prop="cForm.picker.pickerType">
    <el-segmented
      :options="pickerTypeOptions"
      v-model="form.cForm.picker.pickerType"
      :disabled="isEdit"
    />
  </el-form-item>
  <!-- color子组件 -->
  <template v-if="form.cForm.picker.pickerType === 'color'">
    <el-form-item label="透明度选择" prop="cForm.picker.colorFields.alpha">
      <el-switch v-model="form.cForm.picker.colorFields.alpha" />
    </el-form-item>
    <el-form-item
      label="预定义的颜色"
      prop="cForm.picker.colorFields.predefine"
    >
      <el-select
        v-model="form.cForm.picker.colorFields.predefine"
        allow-create
        filterable
        multiple
        placeholder="选择或者输入添加预定义颜色"
        style="width: 240px"
      >
        <el-option
          v-for="item in colorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div class="flex items-center">
            <el-tag :color="item.value" style="margin-right: 8px" />
            <span :style="{ color: item.value }">{{ item.label }}</span>
          </div>
        </el-option>
        <template #tag>
          <el-tag
            v-for="color in form.cForm.picker.colorFields.predefine"
            :key="color"
            :color="color"
          />
        </template>
      </el-select>
    </el-form-item>
    <el-form-item
      label="预定义的颜色"
      prop="cForm.picker.colorFields.predefine"
    >
      <el-select
        v-model="form.cForm.picker.colorFields.colorFormat"
        placeholder="颜色格式"
      >
        <el-option
          v-for="item in colorFormatOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="默认值" prop="cForm.picker.colorFields.value">
      <el-color-picker
        :show-alpha="form.cForm.picker.colorFields.alpha"
        v-model="form.cForm.picker.colorFields.value"
        :predefine="form.cForm.picker.colorFields.predefine"
        :color-format="form.cForm.picker.colorFields.colorFormat"
      />
    </el-form-item>
  </template>
  <!-- date、time子组件 -->
  <template v-else>
    <el-form-item label="范围选择" prop="cForm.picker.dtFields.isRange">
      <el-switch v-model="form.cForm.picker.dtFields.isRange" />
    </el-form-item>
    <el-form-item
      label="值的格式(选填)"
      prop="cForm.picker.dtFields.valueFormat"
    >
      <el-input v-model="form.cForm.picker.dtFields.valueFormat" />
    </el-form-item>
    <!-- 范围选择 -->
    <template v-if="form.cForm.picker.dtFields.isRange">
      <el-form-item
        label="开始时间占位符"
        prop="cForm.picker.dtFields.startPlaceholder"
      >
        <el-input v-model="form.cForm.picker.dtFields.startPlaceholder" />
      </el-form-item>
      <el-form-item
        label="结束时间占位符"
        prop="cForm.picker.dtFields.endPlaceholder"
      >
        <el-input v-model="form.cForm.picker.dtFields.endPlaceholder" />
      </el-form-item>
      <el-form-item
        label="范围分隔符"
        prop="cForm.picker.dtFields.rangeSeparator"
      >
        <el-input v-model="form.cForm.picker.dtFields.rangeSeparator" />
      </el-form-item>
      <!-- time子组件 -->
      <template v-if="form.cForm.picker.pickerType === 'time'">
        <el-form-item
          label="禁用小时"
          prop="cForm.picker.dtFields.disabledHours"
        >
          <el-input
            v-model="form.cForm.picker.dtFields.disabledHours"
            placeholder="函数表达式 例如：()=>[1,2,3,5]"
          />
        </el-form-item>
        <el-form-item
          label="禁用分钟"
          prop="cForm.picker.dtFields.disabledMinutes"
        >
          <el-input
            v-model="form.cForm.picker.dtFields.disabledMinutes"
            placeholder="函数表达式,如：(hour)=>(hour===10?[25,45]:[])"
          />
        </el-form-item>
        <el-form-item
          label="禁用秒数"
          prop="cForm.picker.dtFields.disabledSeconds"
        >
          <el-input
            v-model="form.cForm.picker.dtFields.disabledSeconds"
            placeholder="函数表达式,如：(h,m)=>((h>10&&m<=30)?[1,15]:[])"
          />
        </el-form-item>
        <el-form-item label="组件值" prop="cForm.picker.dtFields.rangeValue">
          <el-time-picker
            v-model="form.cForm.picker.dtFields.rangeValue"
            :default-value="[new Date(), new Date()]"
            :is-range="true"
            :start-placeholder="form.cForm.picker.dtFields.startPlaceholder"
            :end-placeholder="form.cForm.picker.dtFields.endPlaceholder"
            :range-separator="form.cForm.picker.dtFields.rangeSeparator"
            :value-format="form.cForm.picker.dtFields.valueFormat"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
            :disabled-seconds="disabledSeconds"
          />
        </el-form-item>
      </template>
      <!-- date子组件 -->
      <template v-else>
        <el-form-item label="组件值" prop="cForm.picker.dtFields.rangeValue">
          <el-date-picker
            v-model="form.cForm.picker.dtFields.rangeValue"
            type="datetimerange"
            :default-value="[new Date(), new Date()]"
            :start-placeholder="form.cForm.picker.dtFields.startPlaceholder"
            :end-placeholder="form.cForm.picker.dtFields.endPlaceholder"
            :range-separator="form.cForm.picker.dtFields.rangeSeparator"
            :value-format="form.cForm.picker.dtFields.valueFormat"
          />
        </el-form-item>
      </template>
    </template>
    <!-- 非范围选择 -->
    <template v-else>
      <el-form-item label="提示占位符" prop="cForm.picker.dtFields.placeholder">
        <el-input v-model="form.cForm.picker.dtFields.placeholder" />
      </el-form-item>
      <!-- time子组件 -->
      <template v-if="form.cForm.picker.pickerType === 'time'">
        <el-form-item
          label="禁用小时"
          prop="cForm.picker.dtFields.disabledHours"
        >
          <el-input
            v-model="form.cForm.picker.dtFields.disabledHours"
            placeholder="函数表达式 例如：()=>[1,2,3,5]"
          />
        </el-form-item>
        <el-form-item
          label="禁用分钟"
          prop="cForm.picker.dtFields.disabledMinutes"
        >
          <el-input
            v-model="form.cForm.picker.dtFields.disabledMinutes"
            placeholder="函数表达式,如：(hour)=>(hour===10?[25,45]:[])"
          />
        </el-form-item>
        <el-form-item
          label="禁用秒数"
          prop="cForm.picker.dtFields.disabledSeconds"
        >
          <el-input
            v-model="form.cForm.picker.dtFields.disabledSeconds"
            placeholder="函数表达式,如：(h,m)=>((h>10&&m<=30)?[1,15]:[])"
          />
        </el-form-item>
        <el-form-item label="组件值" prop="cForm.picker.dtFields.value">
          <el-time-picker
            v-model="form.cForm.picker.dtFields.value"
            :default-value="new Date()"
            :is-range="false"
            :value-format="form.cForm.picker.dtFields.valueFormat"
            :placeholder="form.cForm.picker.dtFields.placeholder"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
            :disabled-seconds="disabledSeconds"
          />
        </el-form-item>
      </template>
      <!-- date子组件 -->
      <template v-else>
        <el-form-item label="组件值" prop="cForm.picker.dtFields.value">
          <el-date-picker
            v-model="form.cForm.picker.dtFields.value"
            type="datetime"
            :default-value="new Date()"
            :value-format="form.cForm.picker.dtFields.valueFormat"
            :placeholder="form.cForm.picker.dtFields.placeholder"
          />
        </el-form-item>
      </template>
    </template>
  </template>
</template>
<script lang="ts" setup>
import type {
  dayjs,
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "element-plus/lib";

defineProps({
  isEdit: {
    type: Boolean,
    required: false,
  },
});

const { form } = useRenderItemEditForm();

const pickerTypeOptions = [
  {
    label: "颜色",
    value: "color",
  },
  {
    label: "日期",
    value: "date",
  },
  {
    label: "时间",
    value: "time",
  },
];

const colorOptions = [
  {
    label: "red",
    value: "#ff4500",
  },
  {
    label: "green",
    value: "#32cd32",
  },
  {
    label: "blue",
    value: "#1e90ff",
  },
  {
    label: "yellow",
    value: "#ffd700",
  },
  {
    label: "black",
    value: "#000000",
  },
  {
    label: "white",
    value: "#ffffff",
  },
];

const colorFormatOptions = [
  {
    label: "hex(a)",
    value: "hex",
  },
  {
    label: "rgb(a)",
    value: "rgb",
  },
  {
    label: "hsl(a)",
    value: "hsl",
  },
  {
    label: "hsv(a)",
    value: "hsv",
  },
];

const disabledHours_ = computed(() => {
  const res = transformFnStr<GetDisabledHours>(
    form.cForm.picker.dtFields.disabledHours
  );
  return res;
});
const disabledHours: GetDisabledHours = (
  role: string,
  comparingDate?: dayjs.Dayjs
) => {
  return disabledHours_.value?.(role, comparingDate) || [];
};

const disabledMinutes_ = computed(() => {
  const res = transformFnStr<GetDisabledMinutes>(
    form.cForm.picker.dtFields.disabledMinutes
  );
  return res;
});
const disabledMinutes: GetDisabledMinutes = (
  hour: number,
  role: string,
  comparingDate?: dayjs.Dayjs
) => {
  return disabledMinutes_.value?.(hour, role, comparingDate) || [];
};

const disabledSeconds_ = computed(() => {
  const res = transformFnStr<GetDisabledSeconds>(
    form.cForm.picker.dtFields.disabledSeconds
  );
  return res;
});
const disabledSeconds: GetDisabledSeconds = (
  hour: number,
  minute: number,
  role: string,
  comparingDate?: dayjs.Dayjs
) => {
  return disabledSeconds_.value?.(hour, minute, role, comparingDate) || [];
};
</script>

<style lang="scss" scoped></style>
