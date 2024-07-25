export const apiDocument = <ApiDocumentType>{
  howToUse: "构建与用户交互的表单",
  params: [
    {
      name: "buildFormList",
      required: false,
      instructions: "表单组件数组",
      type: 'BuildFormItems[]',
      default: "[]",
      children: [
        {
          name: "BuildFormItems",
          required: false,
          instructions: "表单组件",
          type: ['BuildFormItem.Input ', ' BuildFormItem.MultiplSelect ', ' BuildFormItem.GroupSelect ', ' BuildFormItem.Select ', ' BuildFormItem.Check'],
          default: " ",
          children: [
            {
              name: "BuildFormItem.Input",
              required: false,
              instructions: "输入框组件",
              type: 'object',
              default: "",
              children: [
                {
                  name: "targetGroupLabel",
                  required: true,
                  instructions: "组标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "type",
                  required: true,
                  instructions: "组件类型",
                  type: '"input"',
                  default: "",
                  children: []
                },
                {
                  name: "label",
                  required: true,
                  instructions: "组件标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "value",
                  required: true,
                  instructions: "输入框的(默认)值",
                  type: 'string',
                  default: "",
                  children: []
                }
              ]
            },
            {
              name: "BuildFormItem.MultiplSelect",
              required: false,
              instructions: "多选分组组件",
              type: 'object',
              default: "",
              children: [
                {
                  name: "targetGroupLabel",
                  required: true,
                  instructions: "组标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "type",
                  required: true,
                  instructions: "组件类型",
                  type: '“multiplSelect”',
                  default: "",
                  children: []
                },
                {
                  name: "label",
                  required: true,
                  instructions: "组件标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "value",
                  required: true,
                  instructions: "选中的(默认)值",
                  type: 'string[]',
                  default: "",
                  children: []
                },
                {
                  name: "options",
                  required: true,
                  instructions: "选项",
                  type: 'GroupItem[]',
                  default: "",
                  children: [
                    {
                      name: "groupLabel",
                      required: true,
                      instructions: "分组标签",
                      type: 'string',
                      default: "",
                      children: []
                    },
                    {
                      name: "options",
                      required: true,
                      instructions: "分组中的选项",
                      type: 'OptionItem[]',
                      default: "",
                      children: [
                        {
                          name: "label",
                          required: true,
                          instructions: "选项标签",
                          type: 'string',
                          default: "",
                          children: []
                        },
                        {
                          name: "value",
                          required: true,
                          instructions: "选项值",
                          type: 'string',
                          default: "",
                          children: []
                        }
                      ]
                    }
                  ]
                },
                {
                  name: "limit",
                  required: false,
                  instructions: "最大选中数量",
                  type: 'number',
                  default: "",
                  children: []
                }
              ]
            },
            {
              name: "BuildFormItem.GroupSelect",
              required: false,
              instructions: "单选分组组件",
              type: 'object',
              default: "",
              children: [
                {
                  name: "targetGroupLabel",
                  required: true,
                  instructions: "组标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "type",
                  required: true,
                  instructions: "组件类型",
                  type: '"groupSelect"',
                  default: "",
                  children: []
                },
                {
                  name: "label",
                  required: true,
                  instructions: "组件标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "value",
                  required: true,
                  instructions: "选中的值",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "options",
                  required: true,
                  instructions: "选项",
                  type: 'GroupItem[]',
                  default: "",
                  children: [
                    {
                      name: "groupLabel",
                      required: true,
                      instructions: "分组标签",
                      type: 'string',
                      default: "",
                      children: []
                    },
                    {
                      name: "options",
                      required: true,
                      instructions: "分组中的选项",
                      type: 'OptionItem[]',
                      default: "",
                      children: [
                        {
                          name: "label",
                          required: true,
                          instructions: "选项标签",
                          type: 'string',
                          default: "",
                          children: []
                        },
                        {
                          name: "value",
                          required: true,
                          instructions: "选项值",
                          type: 'string',
                          default: "",
                          children: []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "BuildFormItem.Select",
              required: false,
              instructions: "单选组件",
              type: 'object',
              default: "",
              children: [
                {
                  name: "targetGroupLabel",
                  required: true,
                  instructions: "组标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "type",
                  required: true,
                  instructions: "组件类型",
                  type: '"select"',
                  default: "",
                  children: []
                },
                {
                  name: "label",
                  required: true,
                  instructions: "组件标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "value",
                  required: true,
                  instructions: "选中的值",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "options",
                  required: true,
                  instructions: "选项数组",
                  type: 'string[]',
                  default: "",
                  children: []
                }
              ]
            },
            {
              name: "BuildFormItem.Check",
              required: false,
              instructions: "复选框组件",
              type: 'object',
              default: "",
              children: [
                {
                  name: "targetGroupLabel",
                  required: true,
                  instructions: "组标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "type",
                  required: true,
                  instructions: "组件类型",
                  type: '"check"',
                  default: "",
                  children: []
                },
                {
                  name: "label",
                  required: true,
                  instructions: "组件标签",
                  type: 'string',
                  default: "",
                  children: []
                },
                {
                  name: "checked",
                  required: true,
                  instructions: "是否选中",
                  type: 'boolean',
                  default: "",
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  returnValue: {
    
    type: `void`,
  },
  example: {
    title: "构建与用户交互的表单",
    code: `buildForm([]);`,
  },
  searchKeys: ['build', 'from'],
  codeSnippet:
    "buildForm(${1:buildFormList});${0:}",
};