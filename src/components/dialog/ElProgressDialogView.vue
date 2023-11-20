<template>
  <!-- 单输入框dialog -->
  <el-dialog v-model="progressDialogMod.visible" :title="progressDialogMod.title">
    
    <div>下载进度：</div>
    <el-progress :percentage="progressDialogMod.progress" />
    <div>详请：</div>
    <el-input v-model="progressDialogMod.content" disabled type="textarea" :rows="4"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="progressDialogMod.visible = false">隐藏</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

const progressDialogMod = inject<{
  visible: boolean;
  title: string;
  content: string;
  progress: number;
  taskDone: boolean;
}>("progressDialogMod")!;

</script>

