import { Cpu,ChromeFilled,Printer,Setting,InfoFilled } from '@element-plus/icons-vue';
const routes = [
  {
    path: "/",
    redirect: "/script",
  },


  {
    path: "/script",
    name: "script",
    component: () => import(`../pages/ScriptConsole.vue`),
    meta: {
      title: "脚本",
      icon:Cpu
    },
  },
  {
    path: "/apiTest",
    name: "apiTest",
    component: () => import(`../pages/APITest.vue`),
    meta: {
      title: "调试",
      icon: ChromeFilled
    },
  },
  {
    path: "/project",
    name: "project",
    component: () => import(`../pages/ScriptProject.vue`),
    meta: {
      title: "工程",
      icon: Printer
    },
  },



  {
    path: "/setting",
    name: "setting",
    component: () => import(`../pages/SettingPage.vue`),
    meta: {
      title: "设置",
      icon:Setting
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import(`../pages/About.vue`),
    meta: {
      title: "关于",
      icon: InfoFilled
    },
  },

  {
    path: "/scriptWindow",
    name: "scriptWindow",
    component: () => import(`../pages/ScriptRunWindow.vue`),
    meta: {
      title: "脚本运行窗口",
      icon:Cpu
    },
  },
];
export const topRoutes = [routes[1],routes[2],routes[3]];
export const bottomRoutes = [routes[4],routes[5]];
export const hideRoutes = [routes[6]];


export default routes;
