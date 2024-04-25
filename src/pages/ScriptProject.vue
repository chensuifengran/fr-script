<template>
  <div class="script-project">
    <div class="draggable" draggable="true">拖动我</div>
    <div class="dropzone">放置区域</div>
  </div>
</template>

<script setup lang="ts">
onMounted(async () => {
  // const draggables = document.querySelectorAll('.draggable');
  // const dropzones = document.querySelectorAll('.dropzone');

  // draggables.forEach(draggable => {
  //   draggable.addEventListener('dragstart', function (event) {
  //     event.dataTransfer.setData('text/plain', event.target.innerText);
  //   });
  // });

  // dropzones.forEach(dropzone => {
  //   dropzone.addEventListener('dragover', function (event) {
  //     event.preventDefault(); // 允许放置
  //     event.dataTransfer.dropEffect = 'move'; // 设置可视效果为移动
  //   });

  //   dropzone.addEventListener('drop', function (event) {
  //     event.preventDefault(); // 阻止默认行为
  //     const text = event.dataTransfer.getData('text/plain');
  //     dropzone.appendChild(document.createTextNode(text));
  //   });
  // });
  
});
</script>

<style lang="scss" scoped>
.script-project {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px;
  box-sizing: border-box;

  .draggable {
    width: 150px;
    height: 150px;
    background-color: #f00;
    color: #fff;
    text-align: center;
    line-height: 150px;
    border: 2px dashed #000;
    cursor: move;
    margin: 10px;
  }

  .dropzone {
    width: 150px;
    height: 150px;
    background-color: #0f0;
    border: 2px dashed #000;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
}
</style>
