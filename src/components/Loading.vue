<template>
  <div class="loader"></div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.loader {
  position: relative;
  width: 164px;
  height: 164px;
  margin: 0 auto;
}
.loader::before,
.loader::after {
  content: "";
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: rgb(45, 180, 101);
  left: 50%;
  top: 50%;
  animation: rotate 1s ease-in infinite;
}
.loader::after {
  width: 20px;
  height: 20px;
  background-color: rgba(0, 140, 255, 0.582);
  animation: rotate 1s ease-in infinite, moveY 1s ease-in infinite;
}

@keyframes moveY {
  0%,
  100% {
    top: 10%;
  }
  45%,
  55% {
    top: 59%;
  }
  60% {
    top: 40%;
  }
}
@keyframes rotate {
  0% {
    transform: translate(-50%, -100%) rotate(0deg) scale(1, 1);
  }
  25% {
    transform: translate(-50%, 0%) rotate(180deg) scale(1, 1);
  }
  45%,
  55% {
    transform: translate(-50%, 100%) rotate(180deg) scale(3, 0.5);
  }
  60% {
    transform: translate(-50%, 100%) rotate(180deg) scale(1, 1);
  }
  75% {
    transform: translate(-50%, 0%) rotate(270deg) scale(1, 1);
  }
  100% {
    transform: translate(-50%, -100%) rotate(360deg) scale(1, 1);
  }
}
</style>
<style lang="scss"></style>
