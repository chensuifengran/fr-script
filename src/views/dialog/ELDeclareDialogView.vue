<template>
  <!-- 添加文件声明的弹窗 -->
  <el-dialog v-model="declareMod.visible" :title="declareMod.title">
    <div>脚本名称</div>
    <el-input v-model="declareMod.name" />
    <div>脚本版本</div>
    <el-input v-model="declareMod.version" />
    <div>脚本描述</div>
    <el-input v-model="declareMod.description" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="declareMod.visible = false">取消</el-button>
        <el-button type="primary" @click="declareMod.targetFn"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

const { declareMod } = useScriptInfo();
</script>

<style lang="scss" scoped></style>
<style lang="scss"></style>
