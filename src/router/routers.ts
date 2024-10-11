import ScriptIcon from "../components/Icons/ScriptIcon.vue";
import InvokeIcon from "../components/Icons/InvokeIcon.vue";
import ProjectIcon from "../components/Icons/ProjectIcon.vue";
import SettingsIcon from "../components/Icons/SettingsIcon.vue";
import InfoIcon from "../components/Icons/InfoIcon.vue";
import CodeSnippetIcon from "../components/Icons/CodeSnippetIcon.vue";
import { type RouteRecordRaw } from "vue-router";
import DevIcon from "../components/Icons/DevIcon.vue";
const routes = <RouteRecordRaw[]>[
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
      position: "top",
    },
    children: [
      {
        path: "list",
        name: "scriptList",
        component: () => import(`../views/script/list/ScriptList.vue`),
      },
      {
        path: "editor",
        name: "scriptEditor",
        component: () => import(`../views/editor/CodeEditor.vue`),
      },
      {
        path: "setting",
        name: "scriptSetting",
        component: () => import(`../views/script/setting/ScriptSetting.vue`),
      },
      {
        path: "run",
        name: "scriptRunConsole",
        component: () => import(`../views/script/console/ScriptRunConsole.vue`),
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
      position: "top",
    },
  },
  {
    path: "/codeSnippetList",
    name: "codeSnippetList",
    component: () => import(`../pages/CodeSnippet.vue`),
    meta: {
      title: "片段",
      icon: CodeSnippetIcon,
      position: "top",
    },
  },
  {
    path: "/project",
    name: "project",
    component: () => import(`../pages/ScriptProject.vue`),
    meta: {
      title: "工程",
      icon: ProjectIcon,
      position: "top",
      disabled: import.meta.env.PROD || IS_PLAYGROUND_ENV,
    },
  },
  {
    path: "/setting",
    name: "setting",
    component: () => import(`../pages/SettingPage.vue`),
    meta: {
      title: "设置",
      icon: SettingsIcon,
      position: "bottom",
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import(`../pages/About.vue`),
    meta: {
      title: "关于",
      icon: InfoIcon,
      position: "bottom",
    },
  },
  {
    path: "/scriptWindow",
    name: "scriptWindow",
    component: () => import(`../pages/windows/ScriptRunWindow.vue`),
    meta: {
      title: "脚本运行窗口",
      icon: ScriptIcon,
    },
  },
  {
    path: "/floatWindow",
    name: "floatWindow",
    component: () => import(`../pages/windows/FloatWindow.vue`),
    meta: {
      title: "悬浮窗口",
    },
  },
  {
    path: "/pointerUtil",
    name: "pointerUtil",
    component: () => import(`../pages/windows/PointerUtil.vue`),
    meta: {
      title: "鼠标工具",
    },
  },
  {
    path: "/notification",
    name: "notification",
    component: () => import(`../pages/windows/Notification.vue`),
    meta: {
      title: "通知",
    },
  },
  {
    path: "/ORW",
    name: "ORW",
    component: () => import(`../pages/windows/OperationRecordWindow.vue`),
    meta: {
      title: "操作录制悬浮窗口",
    },
  },
  {
    path: "/depManager",
    name: "depManager",
    component: () => import(`../pages/windows/DepManagerPage.vue`),
    meta: {
      title: "依赖管理器",
    },
  },
  {
    path: "/invokesManager",
    name: "invokesManager",
    component: () => import(`../pages/InvokesManager.vue`),
    meta: {
      title: "API",
      icon: DevIcon,
      position: "top",
      disabled: IS_PLAYGROUND_ENV || import.meta.env.PROD,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import(`../pages/NotFound.vue`),
  },
]
  .map((route) => {
    if (route.meta?.disabled) {
      return null;
    }
    return route;
  })
  .filter((r) => r);

export const topRoutes = routes.filter(
  (r) => r.meta?.position === "top" && !r.meta?.disabled
);

export const bottomRoutes = routes.filter(
  (r) => r.meta?.position === "bottom" && !r.meta?.disabled
);

export default routes;
