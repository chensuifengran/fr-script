<template>
  <general-dialog
    :callback="dialogOptions.ok"
    :cancel="dialogOptions.cancel"
    :title="title"
    :cancel-text="dialogOptions.cancelText"
    :confirm-text="dialogOptions.confirmText"
    v-model="visible"
  >
    <template #element>
      <div class="edit-form" v-show="!useInnerDialog">
        <el-form
          label-position="right"
          label-width="180px"
          :model="form"
          :rules="rules"
          ref="formEl"
        >
          <el-form-item label="分组标签" prop="groupLabel">
            <el-select
              v-model="form.groupLabel"
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="*脚本设置"
            >
              <el-option
                v-for="(item, idx) in props.groups"
                :key="idx"
                :label="item"
                :value="item"
              />
              <template #label="{ label }">
                <div flex flex-row flex-items-center>
                  <el-tag
                    type="success"
                    mr-1
                    v-if="!props.groups?.includes(label)"
                    >new</el-tag
                  >
                  <el-text>{{ label }}</el-text>
                </div>
              </template>
            </el-select>
          </el-form-item>
          <template v-if="props.editTarget === 'item'">
            <el-form-item label="ID(选填)" prop="id">
              <el-input v-model="form.id" clearable>
                <template #append>
                  <el-button link @click="randomId" type="primary">
                    <random-icon />
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="组件标签" prop="label">
              <el-input v-model="form.label" clearable />
            </el-form-item>
            <el-form-item label="组件类型" prop="componentType">
              <el-segmented
                :options="fieldTypeOptions"
                v-model="form.componentType"
                :disabled="isEdit"
              />
            </el-form-item>
            <template v-if="form.componentType === FieldType.Check">
              <el-form-item label="是否默认选中" prop="cForm.check.checked">
                <el-switch v-model="form.cForm.check.checked" />
              </el-form-item>
            </template>
            <template v-else-if="form.componentType === FieldType.Picker">
              <el-form-item label="子类型" prop="cForm.picker.pickerType">
                <el-segmented
                  :options="pickerTypeOptions"
                  v-model="form.cForm.picker.pickerType"
                  :disabled="isEdit"
                />
              </el-form-item>
              <!-- color子组件 -->
              <template v-if="form.cForm.picker.pickerType === 'color'">
                <el-form-item
                  label="透明度选择"
                  prop="cForm.picker.colorFields.alpha"
                >
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
                        <span :style="{ color: item.value }">{{
                          item.label
                        }}</span>
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
                <el-form-item
                  label="默认值"
                  prop="cForm.picker.colorFields.value"
                >
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
                <el-form-item
                  label="范围选择"
                  prop="cForm.picker.dtFields.isRange"
                >
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
                    <el-input
                      v-model="form.cForm.picker.dtFields.startPlaceholder"
                    />
                  </el-form-item>
                  <el-form-item
                    label="结束时间占位符"
                    prop="cForm.picker.dtFields.endPlaceholder"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.endPlaceholder"
                    />
                  </el-form-item>
                  <el-form-item
                    label="范围分隔符"
                    prop="cForm.picker.dtFields.rangeSeparator"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.rangeSeparator"
                    />
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
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.rangeValue"
                    >
                      <el-time-picker
                        v-model="form.cForm.picker.dtFields.rangeValue"
                        :default-value="[new Date(), new Date()]"
                        :is-range="true"
                        :start-placeholder="
                          form.cForm.picker.dtFields.startPlaceholder
                        "
                        :end-placeholder="
                          form.cForm.picker.dtFields.endPlaceholder
                        "
                        :range-separator="
                          form.cForm.picker.dtFields.rangeSeparator
                        "
                        :value-format="form.cForm.picker.dtFields.valueFormat"
                        :disabled-hours="disabledHours"
                        :disabled-minutes="disabledMinutes"
                        :disabled-seconds="disabledSeconds"
                      />
                    </el-form-item>
                  </template>
                  <!-- date子组件 -->
                  <template v-else>
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.rangeValue"
                    >
                      <el-date-picker
                        v-model="form.cForm.picker.dtFields.rangeValue"
                        type="datetimerange"
                        :default-value="[new Date(), new Date()]"
                        :start-placeholder="
                          form.cForm.picker.dtFields.startPlaceholder
                        "
                        :end-placeholder="
                          form.cForm.picker.dtFields.endPlaceholder
                        "
                        :range-separator="
                          form.cForm.picker.dtFields.rangeSeparator
                        "
                        :value-format="form.cForm.picker.dtFields.valueFormat"
                      />
                    </el-form-item>
                  </template>
                </template>
                <!-- 非范围选择 -->
                <template v-else>
                  <el-form-item
                    label="提示占位符"
                    prop="cForm.picker.dtFields.placeholder"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.placeholder"
                    />
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
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.value"
                    >
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
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.value"
                    >
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
            <template v-else-if="form.componentType === FieldType.Select">
              <el-form-item label="选项显示模式" prop="cForm.select.segmented">
                <el-segmented
                  :options="[
                    {
                      label: '常规下拉',
                      value: false,
                    },
                    {
                      label: '平铺分段',
                      value: true,
                    },
                  ]"
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
                          }}{{
                            typeof item === "object" ? `(${item.value})` : ""
                          }}</el-text
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
                <el-form-item
                  label="选项分组"
                  prop="cForm.select.enabledGroupOption"
                >
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
                          :label="
                            typeof item === 'object' ? item.label : item + ''
                          "
                          :value="typeof item === 'object' ? item.value : item"
                        >
                          <div flex flex-row items-center>
                            <el-tag size="small">{{ typeof item }}</el-tag>
                            <el-text
                              >{{ typeof item === "object" ? item.label : item
                              }}{{
                                typeof item === "object"
                                  ? `(${item.value})`
                                  : ""
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
                        :label="
                          typeof item === 'object' ? item.label : item + ''
                        "
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
                            :label="
                              typeof item === 'object' ? item.label : item + ''
                            "
                            :value="
                              typeof item === 'object' ? item.value : item
                            "
                          >
                            <div flex flex-row items-center>
                              <el-tag size="small">{{ typeof item }}</el-tag>
                              <el-text
                                >{{
                                  typeof item === "object" ? item.label : item
                                }}{{
                                  typeof item === "object"
                                    ? `(${item.value})`
                                    : ""
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
                          :label="
                            typeof item === 'object' ? item.label : item + ''
                          "
                          :value="typeof item === 'object' ? item.value : item"
                        >
                          <div flex flex-row items-center>
                            <el-tag size="small">{{ typeof item }}</el-tag>
                            <el-text
                              >{{ typeof item === "object" ? item.label : item
                              }}{{
                                typeof item === "object"
                                  ? `(${item.value})`
                                  : ""
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
                            :label="
                              typeof item === 'object' ? item.label : item + ''
                            "
                            :value="
                              typeof item === 'object' ? item.value : item
                            "
                          >
                            <div flex flex-row items-center>
                              <el-tag size="small">{{ typeof item }}</el-tag>
                              <el-text
                                >{{
                                  typeof item === "object" ? item.label : item
                                }}{{
                                  typeof item === "object"
                                    ? `(${item.value})`
                                    : ""
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
                          :label="
                            typeof item === 'object' ? item.label : item + ''
                          "
                          :value="typeof item === 'object' ? item.value : item"
                        >
                          <div flex flex-row items-center>
                            <el-tag size="small">{{ typeof item }}</el-tag>
                            <el-text
                              >{{ typeof item === "object" ? item.label : item
                              }}{{
                                typeof item === "object"
                                  ? `(${item.value})`
                                  : ""
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
            <template v-else-if="form.componentType === FieldType.Input">
              <el-form-item label="子类型" prop="cForm.input.inputType">
                <el-segmented
                  :options="[
                    {
                      label: '文本',
                      value: 'text',
                    },
                    {
                      label: '数字',
                      value: 'number',
                    },
                    {
                      label: '数字范围',
                      value: 'range',
                    },
                    {
                      label: '文件夹选择',
                      value: 'dir',
                    },
                    {
                      label: '文件选择',
                      value: 'file',
                    },
                  ]"
                  v-model="form.cForm.input.inputType"
                />
              </el-form-item>
              <template
                v-if="
                  form.cForm.input.inputType === 'text' ||
                  !form.cForm.input.inputType
                "
              >
                <el-form-item label="输入模式" prop="cForm.input.text.mod">
                  <el-segmented
                    :options="[
                      {
                        label: '文本',
                        value: 'text',
                      },
                      {
                        label: '密码',
                        value: 'password',
                      },
                      {
                        label: '文本域',
                        value: 'textarea',
                      },
                    ]"
                    v-model="form.cForm.input.text.mod"
                    @change="handleTextModChange"
                  />
                </el-form-item>
                <el-form-item
                  label="占位提示词"
                  prop="cForm.input.text.placeholder"
                >
                  <el-input
                    v-model="form.cForm.input.text.placeholder"
                    placeholder="占位提示词(选填)"
                    clearable
                  />
                </el-form-item>
                <template v-if="form.cForm.input.text.mod !== 'textarea'">
                  <el-form-item
                    label="显示清除按钮"
                    prop="cForm.input.text.clearable"
                  >
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
                  <el-form-item
                    label="高度自适应"
                    prop="cForm.input.text.autosizeConf"
                  >
                    <el-segmented
                      :options="[
                        {
                          label: '关闭',
                          value: 'close',
                        },
                        {
                          label: '开启',
                          value: 'open',
                        },
                        {
                          label: '自定义',
                          value: 'custom',
                        },
                      ]"
                      v-model="form.cForm.input.text.autosizeConf"
                    />
                  </el-form-item>
                  <template
                    v-if="form.cForm.input.text.autosizeConf === 'custom'"
                  >
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
                  <el-form-item
                    label="密码可展示"
                    prop="cForm.input.text.showPassword"
                  >
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
                <el-form-item
                  label="严格步进"
                  prop="cForm.input.number.stepStrictly"
                  ><el-tooltip
                    effect="dark"
                    content="只能是步进的倍数"
                    placement="right"
                  >
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
                <el-form-item
                  label="显示控制器"
                  prop="cForm.input.number.controls"
                >
                  <el-switch v-model="form.cForm.input.number.controls" />
                </el-form-item>
                <template v-if="form.cForm.input.number.controls">
                  <el-form-item
                    label="控制器位置"
                    prop="cForm.input.number.controlsPosition"
                  >
                    <el-segmented
                      :options="[
                        {
                          label: '默认',
                          value: '',
                        },
                        {
                          label: '右边',
                          value: 'right',
                        },
                      ]"
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
                    :options="[
                      {
                        label: '默认',
                        value: 'default',
                      },
                      {
                        label: '最小值',
                        value: 'min',
                        disabled:
                          !form.cForm.input.number.min ||
                          Number.isNaN(form.cForm.input.number.min),
                      },
                      {
                        label: '最大值',
                        value: 'max',
                        disabled:
                          !form.cForm.input.number.max ||
                          Number.isNaN(form.cForm.input.number.max),
                      },
                      {
                        label: '自定义',
                        value: 'custom',
                      },
                    ]"
                    v-model="form.cForm.input.number.valueOnClearMod"
                  />
                </el-form-item>
                <template
                  v-if="form.cForm.input.number.valueOnClearMod === 'custom'"
                >
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
                    :controls-position="
                      form.cForm.input.number.controlsPosition
                    "
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
                <el-form-item
                  label="限制取值范围"
                  prop="cForm.input.range.limitRange"
                >
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
                <el-form-item
                  label="显示控制器"
                  prop="cForm.input.range.controls"
                >
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
                <el-form-item
                  label="多文件选择"
                  prop="cForm.input.file.multiple"
                >
                  <el-switch v-model="form.cForm.input.file.multiple" />
                </el-form-item>
                <el-form-item label="组件值" prop="cForm.input.file.value">
                  <template v-if="form.cForm.input.file.multiple">
                    <file-input
                      v-model="form.cForm.input.file.mValue"
                      multiple
                      w-full
                    />
                  </template>
                  <template v-else>
                    <file-input v-model="form.cForm.input.file.sValue" w-full />
                  </template>
                </el-form-item>
              </template>
            </template>
          </template>
        </el-form>
      </div>
      <div v-show="useInnerDialog">
        <el-form
          :model="innerDialogForm"
          label-position="left"
          label-width="140px"
        >
          <el-form-item label="选项类型" prop="opType">
            <el-segmented
              :options="['常量', '对象']"
              v-model="innerDialogForm.opType"
            />
          </el-form-item>
          <template v-if="innerDialogForm.opType === '对象'">
            <el-form-item label="标签" prop="label">
              <el-input v-model="innerDialogForm.label" />
            </el-form-item>
          </template>
          <template v-if="form.cForm.select.enabledGroupOption">
            <el-form-item label="分组标签" prop="group">
              <el-autocomplete
                v-model="innerDialogForm.group"
                :fetch-suggestions="queryGroupLabels"
                placeholder="请输入分组标签"
                clearable
              />
            </el-form-item>
          </template>
          <el-form-item
            v-if="form.cForm.select.valueType === 'string'"
            :label="innerDialogForm.opType + '值'"
            prop="stringValue"
          >
            <el-input v-model="innerDialogForm.stringValue" />
          </el-form-item>
          <el-form-item
            v-if="form.cForm.select.valueType === 'number'"
            :label="innerDialogForm.opType + '值'"
            prop="numberValue"
          >
            <el-input-number v-model="innerDialogForm.numberValue" />
          </el-form-item>
          <el-form-item
            v-if="form.cForm.select.valueType === 'boolean'"
            :label="innerDialogForm.opType + '值'"
            prop="booleanValue"
          >
            <el-switch v-model="innerDialogForm.booleanValue" />
          </el-form-item>
        </el-form>
      </div>
    </template>
  </general-dialog>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import { FieldType } from "../../utils/enums.ag";
import { nanoid } from "nanoid";
import { type RenderFormInstance } from "../../hooks/useRenderItemEditForm";
import type {
  dayjs,
  FormRules,
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "element-plus";
import { templateRef } from "@vueuse/core";
const {
  form,
  fieldTypeOptions,
  valueTypeOptions,
  pickerTypeOptions,
  colorOptions,
  colorFormatOptions,
} = useRenderItemEditForm();
const formEl = templateRef("formEl");
const props = defineProps({
  editItem: {
    type: Object as PropType<{
      groupLabel: string;
      label: string;
      item: RenderItem | null;
      listName: "checkList" | "inputList" | "selectList" | "pickerList" | "";
    }>,
    required: true,
  },
  editTarget: {
    type: String as PropType<"item" | "group">,
    default: "item",
  },
  groups: {
    type: Array as PropType<string[]>,
    default: [],
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object as PropType<FormRules<RenderFormInstance>>,
    default: () => ({}),
  },
});

let oldInfo = {
  groupLabel: "",
  label: "",
};

const emit = defineEmits<{
  confirm: [
    item: RenderCodeItem,
    isEdit: boolean,
    oldGroupLabel: string,
    oldLabel: string,
    type: "checkList" | "inputList" | "selectList" | "pickerList",
    validate: boolean
  ];
}>();

const visible = defineModel({
  required: true,
  type: Boolean,
});

const useInnerDialog = ref(false);

const title = computed(() => {
  if (useInnerDialog.value) {
    return `添加分段选择选项`;
  } else {
    return `${props.isEdit ? "编辑" : "添加"}${
      props.editTarget === "group" ? "分组" : "组件"
    }`;
  }
});

const innerDialogForm = reactive<{
  opType: "常量" | "对象";
  stringValue: string;
  numberValue: number;
  booleanValue: boolean;
  group: string;
  label: string;
}>({
  opType: "对象",
  stringValue: "",
  numberValue: 0,
  booleanValue: false,
  label: "",
  group: "",
});

const randomId = () => {
  form.id = nanoid(8);
};

watch(visible, (val) => {
  if (val) {
    switch (props.editItem.listName) {
      case "inputList":
        form.componentType = FieldType.Input;
        break;
      case "selectList":
        form.componentType = FieldType.Select;
        break;
      case "pickerList":
        form.componentType = FieldType.Picker;
        break;
      default:
        form.componentType = FieldType.Check;
        break;
    }
    oldInfo.groupLabel = props.editItem.groupLabel;
    oldInfo.label = props.editItem.label;
    form.groupLabel = props.editItem.groupLabel;
    form.label = props.editItem.label;
    form.id = props.editItem.item?.id;
    if (props.editItem.listName === "checkList") {
      if (props.editItem.item && "checked" in props.editItem.item) {
        form.cForm.check.checked = props.editItem.item.checked || false;
      }
    } else if (props.editItem.listName === "pickerList") {
      if (props.editItem.item && "pickerType" in props.editItem.item) {
        if (props.editItem.item.pickerType === "color") {
          form.cForm.picker.pickerType = "color";
          form.cForm.picker.colorFields.alpha =
            props.editItem.item.enableAlpha || false;
          form.cForm.picker.colorFields.predefine =
            props.editItem.item.predefine || [];
          form.cForm.picker.colorFields.colorFormat =
            props.editItem.item.colorFormat || "hex";
          form.cForm.picker.colorFields.value =
            props.editItem.item.value || "#000000";
        } else if (props.editItem.item.pickerType === "time") {
          form.cForm.picker.pickerType = "time";
          form.cForm.picker.dtFields.isRange =
            props.editItem.item.isRange || false;
          if ("startPlaceholder" in props.editItem.item) {
            form.cForm.picker.dtFields.startPlaceholder =
              props.editItem.item.startPlaceholder || "开始时间";
          }
          if ("endPlaceholder" in props.editItem.item) {
            form.cForm.picker.dtFields.endPlaceholder =
              props.editItem.item.endPlaceholder || "结束时间";
          }
          if ("rangeSeparator" in props.editItem.item) {
            form.cForm.picker.dtFields.rangeSeparator =
              props.editItem.item.rangeSeparator || "~";
          }
          if ("valueFormat" in props.editItem.item) {
            if (form.cForm.picker.dtFields.isRange) {
              form.cForm.picker.dtFields.rangeValue = props.editItem.item
                .value as [string, string];
            } else {
              form.cForm.picker.dtFields.value = props.editItem.item
                .value as string;
            }
            form.cForm.picker.dtFields.valueFormat =
              props.editItem.item.valueFormat || "";
          } else {
            form.cForm.picker.dtFields.valueFormat = "";
            if (form.cForm.picker.dtFields.isRange) {
              form.cForm.picker.dtFields.rangeValue = (props.editItem.item
                .value as [Date, Date]) || [new Date(), new Date()];
            } else {
              form.cForm.picker.dtFields.value =
                (props.editItem.item.value as Date) || new Date();
            }
          }
          form.cForm.picker.dtFields.disabledHours =
            props.editItem.item.disabledHours?.toString() || "";
          form.cForm.picker.dtFields.disabledMinutes =
            props.editItem.item.disabledMinutes?.toString() || "";
          form.cForm.picker.dtFields.disabledSeconds =
            props.editItem.item.disabledSeconds?.toString() || "";
        } else {
          form.cForm.picker.pickerType = "date";
          form.cForm.picker.dtFields.isRange =
            props.editItem.item.isRange || false;
          if (form.cForm.picker.dtFields.isRange) {
            form.cForm.picker.dtFields.rangeValue = (props.editItem.item
              .value as any) || [new Date(), new Date()];
          } else {
            form.cForm.picker.dtFields.value =
              (props.editItem.item.value as any) || new Date();
          }
          if ("startPlaceholder" in props.editItem.item) {
            form.cForm.picker.dtFields.startPlaceholder =
              props.editItem.item.startPlaceholder || "开始日期";
          }
          if ("endPlaceholder" in props.editItem.item) {
            form.cForm.picker.dtFields.endPlaceholder =
              props.editItem.item.endPlaceholder || "结束日期";
          }
          if ("rangeSeparator" in props.editItem.item) {
            form.cForm.picker.dtFields.rangeSeparator =
              props.editItem.item.rangeSeparator || "~";
          }
          if ("valueFormat" in props.editItem.item) {
            form.cForm.picker.dtFields.valueFormat =
              props.editItem.item.valueFormat || "";
          } else {
            form.cForm.picker.dtFields.valueFormat = "";
          }
        }
      }
    } else if (props.editItem.listName === "selectList") {
      const item = props.editItem.item as SelectListItem;
      if (item?.segmented) {
        form.cForm.select.segmented = true;
        form.cForm.select.multiple = false;
        form.cForm.select.validOptions = item.options.map((item) => {
          if (typeof item === "object") {
            return item.value;
          }
          return item;
        });
        form.cForm.select.baseOptions = item.options;
        form.cForm.select.segmentedValue = item.value;
        if (typeof item.options[0] === "object") {
          innerDialogForm.opType = "对象";
          form.cForm.select.valueType = typeof item.options[0].value as
            | "string"
            | "number"
            | "boolean";
        } else {
          innerDialogForm.opType = "常量";
          form.cForm.select.valueType = typeof item.options[0] as
            | "string"
            | "number"
            | "boolean";
        }
      } else {
        form.cForm.select.segmented = false;
        if (!item) {
          return;
        }
        form.cForm.select.multiple = item.multiple || false;
        form.cForm.select.validOptions = item.options.flatMap((o) => {
          if (typeof o === "object") {
            if ("groupLabel" in o) {
              return o.options.map((o_) => {
                if (typeof o_ === "object") {
                  return o_.value;
                }
                return o_;
              });
            }
            if (typeof o === "object") {
              return o.value;
            }
          }
          return o;
        });
        let targetOption;
        if (item.group) {
          form.cForm.select.enabledGroupOption = true;
          form.cForm.select.groupOptions = item.options;
          targetOption = item.options[0]?.options[0];
        } else {
          form.cForm.select.enabledGroupOption = false;
          form.cForm.select.baseOptions = item.options;
          targetOption = item.options[0];
        }
        if (typeof targetOption === "object") {
          innerDialogForm.opType = "对象";
          form.cForm.select.valueType = typeof targetOption.value as
            | "string"
            | "number"
            | "boolean";
        } else {
          innerDialogForm.opType = "常量";
          if (targetOption === undefined) {
            form.cForm.select.valueType = "string";
          } else {
            form.cForm.select.valueType = typeof targetOption as
              | "string"
              | "number"
              | "boolean";
          }
        }
        if (item.multiple) {
          form.cForm.select.mValue = item.value;
        } else {
          form.cForm.select.sValue = item.value;
        }
      }
    } else if (props.editItem.listName === "inputList") {
      if (props.editItem.item) {
        const item = props.editItem.item as InputListItem;
        if (item.inputType === "text" || !item.inputType) {
          form.cForm.input.inputType = "text";
          form.cForm.input.text.mod = item.mod || "text";
          form.cForm.input.text.placeholder = item.placeholder || "";
          form.cForm.input.text.clearable = item.clearable || false;
          form.cForm.input.text.maxlength = item.maxlength || -1;
          form.cForm.input.text.showWordLimit = item.showWordLimit || false;
          form.cForm.input.text.showPassword = item.showPassword || false;
          form.cForm.input.text.value = item.value || "";
          if (Array.isArray(item.autosize)) {
            form.cForm.input.text.autosizeConf = "custom";
            form.cForm.input.text.autosize = item.autosize.map(
              (i) => i || 2
            ) as [number, number];
          } else if (typeof item.autosize === "boolean") {
            form.cForm.input.text.autosizeConf = item.autosize
              ? "open"
              : "close";
            form.cForm.input.text.autosize = [2, 2];
          } else if (typeof item.autosize === "number") {
            form.cForm.input.text.autosizeConf = "custom";
            form.cForm.input.text.autosize = [item.autosize, item.autosize];
          } else {
            form.cForm.input.text.autosizeConf = "close";
            form.cForm.input.text.autosize = [2, 2];
          }
        } else if (item.inputType === "number") {
          form.cForm.input.inputType = "number";
          form.cForm.input.number.min = item.min || NaN;
          form.cForm.input.number.max = item.max || NaN;
          form.cForm.input.number.step = item.step || 1;
          form.cForm.input.number.stepStrictly = item.stepStrictly || false;
          form.cForm.input.number.precision = item.precision || undefined;
          form.cForm.input.number.controls = item.controls || false;
          form.cForm.input.number.controlsPosition =
            item.controlsPosition || "";
          form.cForm.input.number.value = item.value || 0;
          if (!item.valueOnClear) {
            form.cForm.input.number.valueOnClearMod = "default";
            form.cForm.input.number.valueOnClearNum = 0;
          } else if (typeof item.valueOnClear === "string") {
            form.cForm.input.number.valueOnClearMod = item.valueOnClear;
            form.cForm.input.number.valueOnClearNum = 0;
          } else {
            form.cForm.input.number.valueOnClearMod = "custom";
            form.cForm.input.number.valueOnClearNum = item.valueOnClear;
          }
        } else if (item.inputType === "range") {
          form.cForm.input.inputType = "range";
          form.cForm.input.range.limitRange = !!item.limit;
          form.cForm.input.range.limit = item.limit || [-9999, 9999];
          form.cForm.input.range.controls = item.controls || false;
          form.cForm.input.range.value = item.value || [0, 100];
        } else if (item.inputType === "dir") {
          form.cForm.input.inputType = "dir";
          form.cForm.input.dir.value = item.value || "";
        } else if (item.inputType === "file") {
          form.cForm.input.inputType = "file";
          form.cForm.input.file.multiple = item.multiple || false;
          if (item.multiple) {
            form.cForm.input.file.mValue = item.value || [];
          } else {
            form.cForm.input.file.sValue = item.value || "";
          }
        }
      }
    } else {
      if (props.editItem.item) {
        (form.cForm as any)[props.editItem.listName.replace("List", "")] = (
          props.editItem.item as any
        ).value;
      }
    }
  }
});
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

const confirm = () => {
  let item: RenderCodeItem;
  switch (form.componentType) {
    case FieldType.Check:
      item = {
        targetGroupLabel: form.groupLabel,
        label: form.label,
        id: form.id,
        ...form.cForm.check,
      } as unknown as RenderCodeItem;
      break;
    case FieldType.Input:
      const fInput = form.cForm.input;
      let inputFields = {};
      if (fInput.inputType === "text" || !fInput.inputType) {
        const text = fInput.text;
        inputFields = {
          inputType: undefined,
          mod: text.mod === "text" ? undefined : text.mod,
          placeholder: text.placeholder === "" ? undefined : text.placeholder,
          clearable:
            text.mod === "textarea"
              ? undefined
              : text.clearable
              ? true
              : undefined,
          maxlength: text.maxlength === -1 ? undefined : text.maxlength,
          showWordLimit: text.showWordLimit ? true : undefined,
          autosize:
            text.mod !== "textarea"
              ? undefined
              : text.autosizeConf === "custom"
              ? text.autosize
              : text.autosizeConf === "close"
              ? undefined
              : true,
          showPassword:
            text.mod !== "password"
              ? undefined
              : text.showPassword
              ? true
              : undefined,
          value: text.value,
        };
      } else if (fInput.inputType === "number") {
        const n = fInput.number;
        inputFields = {
          inputType: "number",
          min: Number.isNaN(n.min) ? undefined : n.min,
          max: Number.isNaN(n.max) ? undefined : n.max,
          step: n.step === 1 ? undefined : n.step,
          stepStrictly: n.stepStrictly ? true : undefined,
          precision: n.precision,
          controls: n.controls ? true : undefined,
          controlsPosition:
            n.controlsPosition === "" ? undefined : n.controlsPosition,
          valueOnClear:
            n.valueOnClearMod === "custom"
              ? n.valueOnClearNum
              : n.valueOnClearMod === "default"
              ? undefined
              : n.valueOnClearMod,
          value: n.value,
        };
      } else if (fInput.inputType === "range") {
        const range = fInput.range;
        inputFields = {
          inputType: "range",
          limit: range.limitRange ? range.limit : undefined,
          controls: range.controls ? true : undefined,
          value: range.value,
        };
      } else if (fInput.inputType === "dir") {
        inputFields = {
          inputType: "dir",
          value: fInput.dir.value,
        };
      } else if (fInput.inputType === "file") {
        inputFields = {
          inputType: "file",
          multiple: fInput.file.multiple,
          value: fInput.file.multiple ? fInput.file.mValue : fInput.file.sValue,
        };
      }
      item = {
        targetGroupLabel: form.groupLabel,
        label: form.label,
        id: form.id,
        ...inputFields,
      } as unknown as RenderCodeItem;
      break;
    case FieldType.Select:
      const fSelect = form.cForm.select;
      let selectFields = {};
      if (fSelect.segmented) {
        selectFields = {
          segmented: true,
          value: fSelect.segmentedValue,
          options: fSelect.baseOptions.filter((o) => {
            return fSelect.validOptions.find((v) => {
              if (typeof o === "object") {
                return v === o.value;
              } else {
                return v === o;
              }
            });
          }),
        };
      } else {
        selectFields = {
          segmented: false,
          multiple: fSelect.multiple,
          value: fSelect.multiple ? fSelect.mValue : fSelect.sValue,
          group: fSelect.enabledGroupOption,
          options: fSelect.enabledGroupOption
            ? fSelect.groupOptions
                .map((g) => {
                  const options = g.options.filter((o) => {
                    if (typeof o === "object") {
                      return fSelect.validOptions.includes(o.value);
                    }
                    return fSelect.validOptions.includes(o);
                  });
                  if (options.length) {
                    return {
                      groupLabel: g.groupLabel,
                      options,
                    };
                  }
                  return null;
                })
                .filter((g) => g !== null)
            : fSelect.baseOptions.filter((o) => {
                if (typeof o === "object") {
                  return fSelect.validOptions.includes(o.value);
                }
                return fSelect.validOptions.includes(o);
              }),
        };
      }
      item = {
        targetGroupLabel: form.groupLabel,
        label: form.label,
        id: form.id,
        ...selectFields,
      } as unknown as RenderCodeItem;
      break;
    case FieldType.Picker:
      const fPicker = form.cForm.picker;
      let pickerFields = {};
      if (fPicker.pickerType === "color") {
        const color = fPicker.colorFields;
        pickerFields = {
          value: color.value,
          predefine: color.predefine,
          colorFormat: color.colorFormat,
          enableAlpha: color.alpha,
          pickerType: "color",
        };
      } else if (fPicker.pickerType === "time") {
        const dt = fPicker.dtFields;
        const isRange = dt.isRange;
        pickerFields = {
          value: isRange ? dt.rangeValue : dt.value,
          isRange,
          startPlaceholder: isRange ? dt.startPlaceholder : undefined,
          endPlaceholder: isRange ? dt.endPlaceholder : undefined,
          rangeSeparator: isRange ? dt.rangeSeparator : undefined,
          valueFormat: dt.valueFormat === "" ? undefined : dt.valueFormat,
          placeholder: !isRange ? dt.placeholder : undefined,
          disabledHours: transformFnStr(dt.disabledHours),
          disabledMinutes: transformFnStr(dt.disabledMinutes),
          disabledSeconds: transformFnStr(dt.disabledSeconds),
          pickerType: "time",
        };
      } else {
        const dt = fPicker.dtFields;
        const isRange = dt.isRange;
        pickerFields = {
          value: isRange ? dt.rangeValue : dt.value,
          isRange,
          startPlaceholder: isRange ? dt.startPlaceholder : undefined,
          endPlaceholder: isRange ? dt.endPlaceholder : undefined,
          rangeSeparator: isRange ? dt.rangeSeparator : undefined,
          valueFormat: dt.valueFormat === "" ? undefined : dt.valueFormat,
          placeholder: !isRange ? dt.placeholder : undefined,
          pickerType: "date",
        };
      }
      item = {
        targetGroupLabel: form.groupLabel,
        label: form.label,
        id: form.id,
        ...pickerFields,
      } as unknown as RenderCodeItem;
      break;
    default:
      item = {
        targetGroupLabel: form.groupLabel,
        label: "",
        id: "",
        value: "",
      } as unknown as RenderCodeItem;
  }
  formEl.value?.validate(async (valid: boolean) => {
    emit(
      "confirm",
      item,
      props.isEdit,
      oldInfo.groupLabel,
      oldInfo.label,
      (form.componentType + "List") as
        | "checkList"
        | "inputList"
        | "selectList"
        | "pickerList",
      valid
    );
  });
};

const dialogOptions = reactive({
  confirmText: "确定",
  cancelText: "取消",
  cancel: () => {
    visible.value = false;
  },
  ok: confirm,
});

const openAddOptionDialog = () => {
  useInnerDialog.value = true;
  dialogOptions.confirmText = "添加";
  dialogOptions.cancelText = "返回";
  dialogOptions.cancel = () => {
    useInnerDialog.value = false;
    dialogOptions.confirmText = "确定";
    dialogOptions.cancelText = "取消";
    dialogOptions.cancel = () => {
      visible.value = false;
    };
    dialogOptions.ok = confirm;
  };
  dialogOptions.ok = () => {
    let item;
    if (form.cForm.select.valueType === "string") {
      item = innerDialogForm.stringValue;
    } else if (form.cForm.select.valueType === "number") {
      item = innerDialogForm.numberValue;
    } else {
      item = innerDialogForm.booleanValue;
    }
    const enabledGroupOption = form.cForm.select.enabledGroupOption;
    let existValue;
    if (enabledGroupOption) {
      existValue = form.cForm.select.groupOptions.find((group) => {
        return group.options.find((o) => {
          if (typeof o === "object") {
            return o.value === item;
          } else {
            return o === item;
          }
        });
      });
    } else {
      existValue = form.cForm.select.baseOptions.find((o) => {
        if (typeof o === "object") {
          return o.value === item;
        } else {
          return o === item;
        }
      });
    }
    if (existValue) {
      ElMessage.error("请确保该选项的值唯一");
      console.error("请确保该选项的值唯一", existValue);
      return;
    }
    if (enabledGroupOption && !innerDialogForm.group.trim()) {
      ElMessage.error("分组名称不能为空");
      return;
    }
    if (innerDialogForm.opType === "常量") {
      if (enabledGroupOption) {
        const targetGroup = form.cForm.select.groupOptions.find((group) => {
          return group.groupLabel === innerDialogForm.group;
        });
        if (targetGroup) {
          targetGroup.options.unshift(item as any);
        } else {
          form.cForm.select.groupOptions.unshift({
            groupLabel: innerDialogForm.group,
            options: [item as any],
          });
        }
      } else {
        form.cForm.select.baseOptions.unshift(item);
      }
    } else {
      if (enabledGroupOption) {
        const targetGroup = form.cForm.select.groupOptions.find((group) => {
          return group.groupLabel === innerDialogForm.group;
        });
        if (targetGroup) {
          targetGroup.options.unshift({
            label: innerDialogForm.label,
            value: item,
          } as any);
        } else {
          form.cForm.select.groupOptions.unshift({
            groupLabel: innerDialogForm.group,
            options: [
              {
                label: innerDialogForm.label,
                value: item,
              },
            ],
          });
        }
      } else {
        debugger;
        form.cForm.select.baseOptions.unshift({
          label: innerDialogForm.label,
          value: item,
        });
      }
    }
    form.cForm.select.validOptions.push(item);
    if (form.cForm.select.enabledGroupOption) {
      if (form.cForm.select.multiple) {
        if (form.cForm.select.mValue.length === 0) {
          form.cForm.select.mValue = [item];
        }
      } else {
        if (
          form.cForm.select.sValue &&
          ["", false, 0].includes(form.cForm.select.sValue)
        ) {
          form.cForm.select.sValue = item;
        }
      }
    } else {
      if (["", false, 0].includes(form.cForm.select.segmentedValue)) {
        form.cForm.select.segmentedValue = item;
      }
    }

    ElMessage.success("选项添加成功，选中以生效");
    dialogOptions.cancel();
  };
};

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

watch(
  () => form.cForm.select.valueType,
  (valueType) => {
    if (!form.cForm.select.validOptions.length) {
      return;
    }
    let firstElement;
    if (form.cForm.select.enabledGroupOption) {
      let _firstElement;
      form.cForm.select.groupOptions.find((group) => {
        return group.options.find((o) => {
          if (typeof o === "object") {
            const res = o.value === form.cForm.select.validOptions[0];
            if (res) {
              _firstElement = o;
            }
            return res;
          } else {
            const res = o === form.cForm.select.validOptions[0];
            if (res) {
              _firstElement = o;
            }
            return res;
          }
        });
      });
      firstElement = _firstElement;
    } else {
      firstElement = form.cForm.select.baseOptions.find((s) => {
        if (typeof s === "object") {
          return s.value === form.cForm.select.validOptions[0];
        } else {
          return s === form.cForm.select.validOptions[0];
        }
      });
    }
    if (firstElement) {
      if (typeof firstElement === "object") {
        if (typeof firstElement.value !== valueType) {
          form.cForm.select.validOptions = [];
          form.cForm.select.segmentedValue =
            valueType === "string" ? "" : valueType === "number" ? 0 : false;
          form.cForm.select.sValue =
            valueType === "string" ? "" : valueType === "number" ? 0 : false;
          form.cForm.select.mValue = [];
        }
      } else {
        if (typeof firstElement !== valueType) {
          form.cForm.select.validOptions = [];
          form.cForm.select.segmentedValue =
            valueType === "string" ? "" : valueType === "number" ? 0 : false;
          form.cForm.select.sValue =
            valueType === "string" ? "" : valueType === "number" ? 0 : false;
          form.cForm.select.mValue = [];
        }
      }
    }
  }
);

const labelFilter = (queryString: string) => {
  return (label: string) => {
    return {
      value: label
        .toLocaleLowerCase()
        .includes(queryString.toLocaleLowerCase()),
    };
  };
};
const queryGroupLabels = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? form.cForm.select.groupOptions
        .map((g) => g.groupLabel)
        .filter(labelFilter(queryString))
    : form.cForm.select.groupOptions.map((g) => ({ value: g.groupLabel }));
  cb(results);
};

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

<style lang="scss" scoped>
.edit-form {
  max-height: 60vh;
  overflow-y: auto;
  padding: 5px;
}
</style>
