<template>
  <!-- 单输入框dialog -->
  <el-dialog v-model="dialogMod.visible" :title="dialogMod.title">
    <div>{{ dialogMod.content }}</div>
    <el-input v-model="dialogMod.input" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogMod.visible = false">取消</el-button>
        <el-button type="primary" @click="dialogMod.callback"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// import { ElLoading } from "element-plus";

const dialogMod = inject<{
  visible: boolean;
  title: string;
  content: string;
  input: string;
  callback: Function | null;
  loading: boolean;
}>("dialogMod")!;
</script>
