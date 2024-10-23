<template>
  <template v-if="unspport">
    <el-empty description="playground环境不支持当前功能" />
  </template>
  <template v-else>
    <h1>用户{{ formShow === "login" ? "登录" : "注册" }}</h1>
    <el-form
      inline-message
      :model="form"
      className="form"
      :rules="formRules"
      ref="formEl"
    >
      <el-form-item
        label="用户名"
        prop="username"
        label-position="top"
        class="form-item"
      >
        <el-input v-model="form.username" clearable />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        label-position="top"
        class="form-item"
      >
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item
        label="重复密码"
        prop="rePassword"
        label-position="top"
        class="form-item"
        v-if="formShow === 'register'"
      >
        <el-input v-model="form.rePassword" type="password" show-password />
      </el-form-item>
    </el-form>
    <el-checkbox
      v-model="autoLogin"
      v-if="formShow === 'login'"
      label="自动登录"
      size="large"
    />
    <el-button type="primary" class="btn" @click="submit">
      {{ formShow === "login" ? "登录" : "注册" }}
    </el-button>
    <el-button type="primary" link @click="toggleForm" class="btn">
      前往{{ formShow === "login" ? "注册" : "登录" }}
    </el-button>
  </template>
</template>
<script lang="ts" setup>
import { templateRef } from "@vueuse/core";
const unspport = IS_PLAYGROUND_ENV && !ENABLE_ACCOUNT_MODE;
const {
  autoLogin,
  form,
  formShow,
  formRules,
  resetLastUserInfoToForm,
  saveLastUserInfo,
} = useAccount();
const formEl = templateRef("formEl");
const toggleForm = () => {
  formShow.value = formShow.value === "login" ? "register" : "login";
  formEl.value?.resetFields();
};
const submit = () => {
  formEl.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (formShow.value === "login") {
        const res = await userLogin(form.username, form.password);
        if (res) {
          if (autoLogin.value) {
            saveLastUserInfo();
          }
          ElMessage.success("登录成功");
        }
      } else {
        const res = await userRegister(form.username, form.password);
        if (res) {
          ElMessage.success("注册成功");
          formShow.value = "login";
        }
      }
    }
  });
};
onMounted(() => {
  autoLogin.value = resetLastUserInfoToForm();
  if (autoLogin.value) {
    submit();
  }
});
</script>

<style lang="scss" scoped>
.btn {
  margin: 0;
  margin-top: 10px;
  width: 200px;
}
.form {
  width: 275px;
  .form-item {
    margin-bottom: 10px;
  }
}
</style>
