<template>
  <el-form-item label="选项显示模式" prop="cForm.select.segmented">
    <el-segmented
      :options="segmentedOpts"
      v-model="form.cForm.select.segmented"
      :disabled="isEdit"
    />
  </el-form-item>
  <el-form-item label="组件值类型" prop="cForm.select.valueType">
    <el-segmented
      :options="valueTypeOptions"
      v-model="form.cForm.select.valueType"
    />
  </el-form-item>
  <template v-if="form.cForm.select.segmented">
    <el-form-item label="选项" prop="cForm.select.validOptions">
      <el-select
        v-model="form.cForm.select.validOptions"
        multiple
        :value-key="
          typeof form.cForm.select.validOptions[0] === 'object'
            ? 'value'
            : undefined
        "
        filterable
        placeholder="请选择生效的选项"
        style="width: 240px"
      >
        <el-option
          v-for="(item, index) in baseOptions"
          :key="index"
          :label="typeof item === 'object' ? item.label : item + ''"
          :value="typeof item === 'object' ? item.value : item"
        >
          <div flex flex-row items-center>
            <el-tag size="small">{{ typeof item }}</el-tag>
            <el-text
              >{{ typeof item === "object" ? item.label : item
              }}{{ typeof item === "object" ? `(${item.value})` : "" }}</el-text
            >
          </div>
        </el-option>
      </el-select>
      <el-button link type="primary" @click="openAddOptionDialog"
        >添加备选选项</el-button
      >
    </el-form-item>
    <el-form-item label="组件值" prop="cForm.select.segmentedValue">
      <el-segmented
        v-if="form.cForm.select.validOptions.length"
        :options="form.cForm.select.validOptions"
        v-model="form.cForm.select.segmentedValue"
      />
      <el-text v-else>暂无选项，请添加选项以调整组件值</el-text>
    </el-form-item>
  </template>
  <template v-else>
    <el-form-item label="多选" prop="cForm.select.multiple">
      <el-switch v-model="form.cForm.select.multiple" />
    </el-form-item>
    <el-form-item label="选项分组" prop="cForm.select.enabledGroupOption">
      <el-switch
        v-model="form.cForm.select.enabledGroupOption"
        @change="handleEnabledGroupOption"
      />
    </el-form-item>
    <el-form-item label="选项" prop="cForm.select.validOptions">
      <el-select
        v-model="form.cForm.select.validOptions"
        multiple
        filterable
        placeholder="请选择生效的选项"
        style="width: 400px"
        @change="handleSelectChange"
      >
        <template #label="item">
          <span
            >{{
              typeof item === "object"
                ? typeof item.value === "object"
                  ? item.label + ":" + item.value?.value
                  : item.label + ":" + item.value
                : item
            }}
          </span>
        </template>
        <template v-if="form.cForm.select.enabledGroupOption">
          <el-option-group
            v-for="(group, groupIndex) in groupOptions"
            :key="groupIndex"
            :label="group.groupLabel"
          >
            <el-option
              v-for="(item, index) in group.options"
              :key="index"
              :label="typeof item === 'object' ? item.label : item + ''"
              :value="typeof item === 'object' ? item.value : item"
            >
              <div flex flex-row items-center>
                <el-tag size="small">{{ typeof item }}</el-tag>
                <el-text
                  >{{ typeof item === "object" ? item.label : item
                  }}{{
                    typeof item === "object" ? `(${item.value})` : ""
                  }}</el-text
                >
              </div>
            </el-option>
          </el-option-group>
        </template>
        <template v-else>
          <el-option
            v-for="(item, index) in baseOptions"
            :key="index"
            :label="typeof item === 'object' ? item.label : item + ''"
            :value="typeof item === 'object' ? item.value : item"
          >
            <div flex flex-row items-center>
              <el-tag size="small">{{ typeof item }}</el-tag>
              <el-text
                >{{ typeof item === "object" ? item.label : item
                }}{{
                  typeof item === "object" ? `(${item.value})` : ""
                }}</el-text
              >
            </div>
          </el-option>
        </template>
      </el-select>
      <el-button link type="primary" @click="openAddOptionDialog"
        >添加备选选项</el-button
      >
    </el-form-item>
    <el-form-item label="组件值" prop="cForm.select.msValue">
      <template v-if="form.cForm.select.multiple">
        <el-select
          v-model="form.cForm.select.mValue"
          multiple
          filterable
          placeholder="请选择组件的默认值"
          style="width: 240px"
        >
          <template #label="item">
            <span
              >{{
                typeof item === "object"
                  ? typeof item.value === "object"
                    ? item.label + ":" + item.value?.value
                    : item.label + ":" + item.value
                  : item
              }}
            </span>
          </template>
          <template v-if="form.cForm.select.enabledGroupOption">
            <el-option-group
              v-for="g in validGroupOptions"
              :label="g.groupLabel"
              :key="g.groupLabel"
            >
              <el-option
                v-for="(item, index) in g.options"
                :key="index"
                :label="typeof item === 'object' ? item.label : item + ''"
                :value="typeof item === 'object' ? item.value : item"
              >
                <div flex flex-row items-center>
                  <el-tag size="small">{{ typeof item }}</el-tag>
                  <el-text
                    >{{ typeof item === "object" ? item.label : item
                    }}{{
                      typeof item === "object" ? `(${item.value})` : ""
                    }}</el-text
                  >
                </div>
              </el-option>
            </el-option-group>
          </template>
          <template v-else>
            <el-option
              v-for="(item, index) in validOptions"
              :key="index"
              :label="typeof item === 'object' ? item.label : item + ''"
              :value="typeof item === 'object' ? item.value : item"
            >
              <div flex flex-row items-center>
                <el-tag size="small">{{ typeof item }}</el-tag>
                <el-text
                  >{{ typeof item === "object" ? item.label : item
                  }}{{
                    typeof item === "object" ? `(${item.value})` : ""
                  }}</el-text
                >
              </div>
            </el-option>
          </template>
        </el-select>
      </template>
      <template v-else>
        <el-select
          v-model="form.cForm.select.sValue"
          filterable
          placeholder="请选择组件默认选择的值"
          style="width: 240px"
        >
          <template v-if="form.cForm.select.enabledGroupOption">
            <el-option-group
              v-for="g in validGroupOptions"
              :label="g.groupLabel"
              :key="g.groupLabel"
            >
              <el-option
                v-for="(item, index) in g.options"
                :key="index"
                :label="typeof item === 'object' ? item.label : item + ''"
                :value="typeof item === 'object' ? item.value : item"
              >
                <div flex flex-row items-center>
                  <el-tag size="small">{{ typeof item }}</el-tag>
                  <el-text
                    >{{ typeof item === "object" ? item.label : item
                    }}{{
                      typeof item === "object" ? `(${item.value})` : ""
                    }}</el-text
                  >
                </div>
              </el-option>
            </el-option-group>
          </template>
          <template v-else>
            <el-option
              v-for="(item, index) in validOptions"
              :key="index"
              :label="typeof item === 'object' ? item.label : item + ''"
              :value="typeof item === 'object' ? item.value : item"
            >
              <div flex flex-row items-center>
                <el-tag size="small">{{ typeof item }}</el-tag>
                <el-text
                  >{{ typeof item === "object" ? item.label : item
                  }}{{
                    typeof item === "object" ? `(${item.value})` : ""
                  }}</el-text
                >
              </div>
            </el-option>
          </template>
        </el-select>
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

const emit = defineEmits(["onOpenAddOption"]);

const openAddOptionDialog = () => {
  emit("onOpenAddOption");
};

const valueTypeOptions = [
  {
    label: "字符串",
    value: "string",
  },
  {
    label: "数字",
    value: "number",
  },
  {
    label: "布尔值",
    value: "boolean",
  },
];

const segmentedOpts = [
  {
    label: "常规下拉",
    value: false,
  },
  {
    label: "平铺分段",
    value: true,
  },
];

const validOptions = computed(() => {
  return form.cForm.select.baseOptions.filter((o) => {
    if (typeof o === "object") {
      return form.cForm.select.validOptions.includes(o.value);
    } else {
      return form.cForm.select.validOptions.includes(o);
    }
  });
});

const validGroupOptions = computed(() => {
  return form.cForm.select.groupOptions
    .map((g) => {
      const opts = g.options.filter((o) => {
        if (typeof o === "object") {
          return form.cForm.select.validOptions.includes(o.value);
        } else {
          return form.cForm.select.validOptions.includes(o);
        }
      });
      if (!opts.length) {
        return null;
      }
      return {
        groupLabel: g.groupLabel,
        options: opts,
      };
    })
    .filter((g) => g !== null);
});

const baseOptions = computed(() => {
  if (!form.cForm.select.validOptions.length) {
    return form.cForm.select.baseOptions.filter((o) => {
      if (typeof o === "object") {
        return typeof o.value === form.cForm.select.valueType;
      } else {
        return typeof o === form.cForm.select.valueType;
      }
    });
  } else {
    const firstElement = form.cForm.select.baseOptions.find((s) => {
      if (typeof s === "object") {
        return s.value === form.cForm.select.validOptions[0];
      } else {
        return s === form.cForm.select.validOptions[0];
      }
    });
    return form.cForm.select.baseOptions.filter((o) => {
      if (typeof o === "object") {
        if (typeof firstElement !== "object") {
          return false;
        }
        return typeof o.value === form.cForm.select.valueType;
      } else {
        if (typeof firstElement === "object") {
          return false;
        }
        return typeof o === form.cForm.select.valueType;
      }
    });
  }
});

const groupOptions = computed(() => {
  if (!form.cForm.select.validOptions.length) {
    return form.cForm.select.groupOptions.map((group) => {
      return {
        groupLabel: group.groupLabel,
        options: group.options.filter((o) => {
          if (typeof o === "object") {
            return typeof o.value === form.cForm.select.valueType;
          } else {
            return typeof o === form.cForm.select.valueType;
          }
        }),
      };
    });
  } else {
    let targetOption:
      | {
          label: string;
          value: string | number | boolean;
        }
      | string
      | number
      | boolean;
    form.cForm.select.groupOptions.find((group) => {
      const res = group.options.find((o) => {
        if (typeof o === "object") {
          if (o.value === form.cForm.select.validOptions[0]) {
            targetOption = o;
            return true;
          }
        } else {
          if (o === form.cForm.select.validOptions[0]) {
            targetOption = o;
            return true;
          }
        }
      });
      return res;
    });
    return form.cForm.select.groupOptions.map((group) => {
      return {
        groupLabel: group.groupLabel,
        options: group.options.filter((o) => {
          if (typeof o === "object") {
            if (typeof targetOption !== "object") {
              return false;
            }
            return typeof o.value === form.cForm.select.valueType;
          } else {
            if (typeof targetOption === "object") {
              return false;
            }
            return typeof o === form.cForm.select.valueType;
          }
        }),
      };
    });
  }
});

const handleSelectChange = () => {
  const selectConf = form.cForm.select;
  if (selectConf.multiple) {
    if (selectConf.mValue.length) {
      selectConf.mValue = selectConf.mValue.filter((v) => {
        return selectConf.validOptions.includes(v);
      });
    }
  } else {
    if (selectConf.sValue) {
      if (!selectConf.validOptions.includes(selectConf.sValue)) {
        selectConf.sValue = undefined;
      }
    }
  }
};

const handleEnabledGroupOption = () => {
  form.cForm.select.validOptions = [];
  form.cForm.select.sValue = undefined;
  form.cForm.select.mValue = [];
};
</script>

<style lang="scss" scoped></style>
