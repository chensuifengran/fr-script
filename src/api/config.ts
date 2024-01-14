import Axios, { AxiosInstance } from "axios";
import { ElMessage } from "element-plus";

export const $http: AxiosInstance = Axios.create({
  baseURL: "https://isyc.gitee.io/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
$http.interceptors.request.use(
  (config) => {
    // const token = getToken();
    // token && (config!.headers!.token = token);

    return config;
  },
  (error) => {
    ElMessage({
      showClose: true,
      message: error.data.MSG,
      type: "error",
    });
    return Promise.reject(error.data.MSG);
  }
);
