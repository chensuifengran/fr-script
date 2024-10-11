<template>
  <el-dialog v-model="saveDialog" title="保存操作记录" class="snippet-save-dialog">
    <el-text>将操作记录作为代码片段保存到代码片段仓库,或者仅复制代码片段</el-text>
    <el-form :model="saveConfig" ref="ruleFormRef" :rules="rules" label-position="right" label-width="auto" mt-3>
      <el-form-item label="代码片段名称" prop="name">
        <el-input v-model="saveConfig.name" />
      </el-form-item>
      <el-form-item label="代码片段前缀" prop="prefix">
        <el-input v-model="saveConfig.prefix" />
      </el-form-item>
      <el-form-item label="代码片段描述" prop="description">
        <el-input v-model="saveConfig.description" :autosize="{ minRows: 2 }" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="saveDialog = false">取消</el-button>
        <el-button type="primary" @click="copyCode" v-if="showCopyBtn">复制</el-button>
        <el-button type="primary" @click="saveCodeSnippets">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
const {
  saveDialog,
  saveConfig,
  ruleFormRef,
  rules,
  copyCode,
  saveCodeSnippets,
  showCopyBtn
} = useCodeSnippetSave();
</script>

<style lang="scss" scoped>

</style>