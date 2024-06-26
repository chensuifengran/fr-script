import ScriptIcon from "../components/Icons/ScriptIcon.vue";
import InvokeIcon from "../components/Icons/InvokeIcon.vue";
import ProjectIcon from "../components/Icons/ProjectIcon.vue";
import SettingsIcon from "../components/Icons/SettingsIcon.vue";
import InfoIcon from "../components/Icons/InfoIcon.vue";
import CodeSnippetIcon from "../components/Icons/CodeSnippetIcon.vue";
const routes = [
  {
    path: "/",
    redirect: "/script/list",
  },

  {
    path: "/script",
    name: "script",
    component: () => import(`../pages/ScriptConsole.vue`),
    meta: {
      title: "脚本",
      icon: ScriptIcon,
    },
    children: [
      {
        path: "list",
        name: "scriptList",
        component: () => import(`../components/script/ScriptList.vue`),
      },
      {
        path: "editor",
        name: "scriptEditor",
        component: () => import(`../components/script/CodeEditor.vue`),
      },
      {
        path: "setting",
        name: "scriptSetting",
        component: () => import(`../components/script/ScriptSetting.vue`),
      },
      {
        path: "run",
        name: "scriptRunConsole",
        component: () => import(`../components/script/ScriptRunConsole.vue`),
      },
    ],
  },
  {
    path: "/apiTest",
    name: "apiTest",
    component: () => import(`../pages/APITest.vue`),
    meta: {
      title: "调试",
      icon: InvokeIcon,
    },
  },
  {
    path: "/project",
    name: "project",
    component: () => import(`../pages/ScriptProject.vue`),
    meta: {
      title: "工程",
      icon: ProjectIcon,
    },
  },

  {
    path: "/setting",
    name: "setting",
    component: () => import(`../pages/SettingPage.vue`),
    meta: {
      title: "设置",
      icon: SettingsIcon,
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import(`../pages/About.vue`),
    meta: {
      title: "关于",
      icon: InfoIcon,
    },
  },

  {
    path: "/scriptWindow",
    name: "scriptWindow",
    component: () => import(`../pages/ScriptRunWindow.vue`),
    meta: {
      title: "脚本运行窗口",
      icon: ScriptIcon,
    },
  },
  {
    path: "/floatWindow",
    name: "floatWindow",
    component: () => import(`../pages/FloatWindow.vue`),
    meta: {
      title: "悬浮窗口",
    },
  },
  {
    path: "/pointerUtil",
    name: "pointerUtil",
    component: () => import(`../pages/PointerUtil.vue`),
    meta: {
      title: "鼠标工具",
    },
  },
  {
    path: "/notification",
    name: "notification",
    component: () => import(`../pages/Notification.vue`),
    meta: {
      title: "通知",
    },
  },
  {
    path: "/ORW",
    name: "ORW",
    component: () => import(`../pages/OperationRecordWindow.vue`),
    meta: {
      title: "操作录制悬浮窗口",
    },
  },
  {
    path: "/depManager",
    name: "depManager",
    component: () => import(`../pages/DepManagerPage.vue`),
    meta: {
      title: "依赖管理器",
    },
  },
  {
    path: "/codeSnippetList",
    name: "codeSnippetList",
    component: () => import(`../pages/CodeSnippetList.vue`),
    meta: {
      title: "片段",
      icon: CodeSnippetIcon,
    },
  },
];
export const topRoutes = [routes[1], routes[2], routes[12], routes[3]];
export const bottomRoutes = [routes[4], routes[5]];
export const hideRoutes = [routes[6]];

export default routes;
