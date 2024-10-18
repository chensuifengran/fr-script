import type { FormRules } from "element-plus";
import { useLocalStorageState } from "vue-hooks-plus";
import { decrypt, encrypt } from "../utils/crypto";
export type LastUserInfo = {
  username: string;
  password: string;
  autoLogin: boolean;
};
const autoLogin = ref(false);
const form = reactive({
  username: "",
  password: "",
  rePassword: "",
});
const formShow = ref<"login" | "register">("login");
const [lastUserInfo, setLastUserInfo] = useLocalStorageState<LastUserInfo>(
  "lastUserInfo",
  {
    defaultValue: {
      username: "",
      password: "",
      autoLogin: false,
    },
  }
);
const saveLastUserInfo = () => {
  setLastUserInfo({
    username: form.username,
    password: encrypt(form.password),
    autoLogin: true,
  });
};
const resetLastUserInfoToForm = () => {
  form.username = lastUserInfo.value?.username || "";
  form.password = decrypt(lastUserInfo.value?.password || "");
  return lastUserInfo.value?.autoLogin || false;
};
const isLogin = ref(false);
const username = ref("");
const validateUsername = (_: any, value: string, callback: any) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  if (!value) {
    callback(new Error("用户名不能为空"));
  } else if (!usernameRegex.test(value)) {
    callback(new Error("用户名必须是3到16个字符的字母、数字或下划线"));
  } else {
    callback();
  }
};

const validatePassword = (_: any, value: string, callback: any) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
  if (!value) {
    callback(new Error("密码不能为空"));
  } else if (!passwordRegex.test(value)) {
    callback(new Error("密码必须是8到20个字符，且至少包含一个字母和一个数字"));
  } else {
    callback();
  }
};

const validateRePassword = (_: any, value: string, callback: any) => {
  if (formShow.value === "login") {
    callback();
    return;
  }
  if (!value) {
    callback(new Error("确认密码不能为空"));
  } else if (value !== form.password) {
    callback(new Error("确认密码与密码不匹配"));
  } else {
    callback();
  }
};
const formRules = reactive<FormRules<typeof form>>({
  username: [{ validator: validateUsername, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  rePassword: [{ validator: validateRePassword, trigger: "blur" }],
});
const logout = () => {
  setLastUserInfo({
    username: form.username,
    password: encrypt(form.password),
    autoLogin: false,
  });
  isLogin.value = false;
  setToken("");
  autoLogin.value = false;
  useWss().closeWs();
};

export const useAccount = () => {
  return {
    form,
    formShow,
    isLogin,
    username,
    formRules,
    logout,
    saveLastUserInfo,
    resetLastUserInfoToForm,
    autoLogin,
  };
};
