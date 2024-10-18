import { $request } from "./config";
const { isLogin, username } = useAccount();
export const userLogin = async (_username: string, password: string) => {
  try {
    const res = await $request.post<{
      message: string;
      token: string;
    }>("auth/login", {
      username:_username,
      password,
    });
    if (res.data.message && res.data.message.includes("login successful")) {
      setToken(res.data.token);
      isLogin.value = true;
      username.value = _username;
      return true;
    }
    return false;
  } catch (error:any) {
    ElMessage.error("登录失败:" + error.response?.data?.message);
    return false;
  }
};

export const userRegister = async (username: string, password: string) => {
  try {
    const res = await $request.post<{
      message: string;
      token: string;
    }>("auth/register", {
      username,
      password,
    });
    if (
      res.data.message &&
      res.data.message.includes("registered successfully")
    ) {
      return true;
    }
    return false;
  } catch (error:any) {
    ElMessage.error("注册失败:" + error.response?.data?.message);
    return false;
  }
};
