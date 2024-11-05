<p align="center"><a href="https://chensuifengran.github.io/"><img width="100" src="https://chensuifengran.github.io/icon.ico" alt="fr-script"></a></p>
<h1 align="center">fr-script(风染脚本)</h1>

## 介绍

本项目用于**制作**和**运行** PC 端以及安卓模拟器的**自动化脚本**，以减轻用户在高重复性操作场景的负担，例如：按键宏、数据自动录入脚本、游戏日常任务的自动化脚本等。

**主要功能**：

- **脚本管理**：脚本导入、创建、编辑、删除、运行、设置
- **脚本录制**：鼠标键盘操作录制，将操作转换为脚本代码
- **内置 API**：提供常用的 API 供脚本调用，如 OCR、模板匹配等方法，支持测试调用、编辑器类型声明、参数快捷输入、API 文档渲染
- **交互表单**：脚本执行可以构建交互表单，提高脚本的灵活性、支持图形化定义表单
- **代码片段**：可以管理代码片段，提高代码复用性

**在线预览**：[playground](https://chensuifengran.github.io/)

**更新日志**：[CHANGELOG](https://github.com/chensuifengran/fr-script/blob/dev/CHANGELOG.zh-CN.md)

目前正在寻找感兴趣的小伙伴一起开发，期待您的加入！
如果您对本项目感兴趣或者想进行技术交流：

- QQ：2529720581
- 微信：WX2529720581
- 邮箱：2529720581@qq.com

## 技术栈

_主要的技术栈如下_

- 前端：Vue3 + Vite5 + Tauri2 + TypeScript + monaco-editor
- 后端：Rust + winapi + libloading + enigo
- DLL：基于 C++封装 PaddlePaddleOCR、OpenCV 等库

## 亮点

- 易于扩展的内置 API 核心：
  - 提供图形化界面对**内置 API**进行**管理**（增删改）
  - 在核心注册的 API **自动完成**如下功能：注入脚本运行上下文、API 文档渲染、测试调用功能的支持、编辑器类型声明的注入、编辑器内快速修改/编辑参数功能的支持
- 优秀的脚本编写体验：
  - 脚本基于 TypeScript 编写，在编辑器中，内置 API 具有**良好的代码提示**。
  - 编辑器内使用 AST 分析脚本节点树，结合 WebWorker 对内置 API 进行解析，提供图形化弹窗对参数进行快捷输入或修改
  - 支持打开测试工具对内置 API 进行调用测试
- 自动化：编写了**Vite 插件**对内置 API 的更改进行监听，**自动生成**对应的内置 API 的类型和**提供给编辑器的类型声明**
- OCR 识别：支持 CPU 和 GPU 加速模式。

## 本地开发

- 克隆或 fork 本项目
- 安装依赖：

```bash
pnpm install
```

- 安装 dll 依赖，详见：[项目依赖](./docs/dependents.md)
- 启动项目

```bash
pnpm tauri
```

## 运行条件

- Windows 10/11 x64
- Rust[安装](https://tauri.app/zh-cn/v1/guides/getting-started/prerequisites) >= 1.81.0
- pnpm 9.8.0(其它版本自测)
- Node.js v18.12.1(其它版本自测)

## 许可证

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2024 尘随风染
