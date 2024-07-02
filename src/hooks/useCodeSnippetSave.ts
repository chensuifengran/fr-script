import { FormInstance, FormRules } from 'element-plus';
import { nanoid } from 'nanoid';

const saveDialog = ref(false);
const showCopyBtn = ref(true);
const saveConfig = reactive<SaveConfigForm>({
  name: "",
  description: "",
  prefix: "",
  code: ""
});
const ruleFormRef = ref<FormInstance>();
const nameValidator = (_rule: any, value: any, callback: any) => {
  if (value.trim() === '') {
    callback(new Error('请输入代码片段名称'))
  } else {
    (async () => {
      const exist = useListStore().codeSnippets.find(item=> item.name === value);
      if (exist) {
        callback(new Error('名称和已有代码片段重复，换个试试吧'))
      }
      callback()
    })();
  }
}
const rules = reactive<FormRules<SaveConfigForm>>({
  name: [
    { required: true, message: '代码片段前缀不能为空', trigger: 'blur' },
    { validator: nameValidator, trigger: 'blur' },
  ],
  prefix: [
    { required: true, message: '代码片段前缀不能为空', trigger: 'blur' },
    { min: 1, max: 20, message: '代码片段前缀长度在 1 到 20 个字符', trigger: 'blur' }
  ]
})
const copyCode = () => {
  try {
    execCopy(saveConfig.code);
    ElMessage.success("操作代码片段复制成功");
  } catch (error) {
    ElMessage.error("操作代码片段复制失败");
    console.error(error);
  } finally {
    saveDialog.value = false;
  }
}
const saveCodeSnippets = async () => {
  const listStore = useListStore();
  if (!ruleFormRef.value) return
  if (!await ruleFormRef.value.validate()) {
    return
  }
  const id = nanoid();
  const filePath = `${await pathUtils.getInstallDir()}\\code-snippets\\${saveConfig.name +'-'+ id}.snippet.ts`;
  try {
    await fsUtils.writeFile(filePath, saveConfig.code);
    listStore.codeSnippets.push({
      id,
      name: saveConfig.name,
      description: saveConfig.description,
      prefix: saveConfig.prefix,
      filePath
    });
    ElMessage.success("操作代码片段保存成功");
  } catch (error) {
    ElMessage.error("操作代码片段保存失败");
    console.error(error);
  } finally {
    saveDialog.value = false;
    saveConfig.code = "";
    saveConfig.name = "";
    saveConfig.description = "";
    saveConfig.prefix = "";
  }
}
export const useCodeSnippetSave = ()=>{
  return {
    saveDialog,
    saveConfig,
    ruleFormRef,
    rules,
    copyCode,
    saveCodeSnippets,
    showCopyBtn
  }
}