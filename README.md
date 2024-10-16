# fr-script

## 预览

软件前端预览可前往：[风染脚本](https://chensuifengran.github.io/)

## 介绍

本项目用于制作和运行 PC 端以及安卓模拟器的自动化脚本，以减轻用户在高重复性操作场景的负担，例如：数据自动录入脚本、游戏日常任务的自动化脚本等。

图像模板匹配使用 c++平台的 opencv 库，OCR 识别使用的是基于百度飞桨开源的 PaddlePaddleOCR c++部署。以上基于 c++平台的均生成动态链接库由 Rust 调用并提供给前端使用。

模拟器的模拟操作基于 ADB，PC 端的模拟操作基于 Rust 以及 C++的 Windows API。

### 亮点

- 易于扩展的内置 API 核心：
  - 提供图形化界面对内置 API 进行管理（增删改）
  - 在核心注册的 API 自动完成如下功能：注入脚本运行上下文、API 文档渲染、测试调用功能的支持、编辑器类型声明的注入、编辑器内快速修改/编辑参数功能的支持
- 优秀的脚本编写体验：
  - 脚本基于 TypeScript 编写，具有优秀的代码提示。
  - 编辑器内使用 AST 分析脚本节点树，结合 WebWorker 对内置 API 进行识别，提供图形化弹窗对参数进行快捷输入或修改
  - 支持打开测试工具对内置 API 进行调用测试
- 自动化：开发环境下，定义了 Vite 插件对内置 API 的更改进行监听，自动生成对应的内置 API 的类型和提供给编辑器的类型声明，一定程度上减少开发者的工作量
- 脚本制作低代码化：使用可视化编辑器辅助脚本制作，同时支持对鼠键操作进行操作录制，降低脚本制作门槛，提高脚本制作效率
- 脚本交互：脚本支持构建交互表单与用户交互，使脚本执行更加灵活。
- OCR 识别：支持 CPU 和 GPU 加速模式。

## 本地开发

- 克隆或 fork 本项目
- 安装依赖：`pnpm install`
- 安装 dll 依赖，详见：[项目依赖](./docs/dependents.md)
- 执行`pnpm tauri`启动项目

  ### 运行条件

  - Windows 10/11 x64
  - Rust[安装](https://tauri.app/zh-cn/v1/guides/getting-started/prerequisites) >= 1.81.0
  - pnpm 9.8.0(其它版本自测)
  - Node.js v18.12.1(其它版本自测)

## 许可证

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2024 尘随风染
