# fr-script

## 介绍

本项目用于制作和运行PC端以及安卓模拟器的自动化脚本，以减轻用户在高重复性操作场景的负担，例如：数据自动录入脚本、游戏日常任务的自动化脚本等。

除此之外，内置的api还提供了独立调用测试的窗口，该窗口能够查询API文档以及调用测试，测试调用中填写的参数在调用完成后会自动生成调用示例，可以直接复制到脚本中使用，脚本使用TypeScript编写，并提供了内置API的类型声明。

图像模板匹配使用c++平台的opencv库，OCR识别使用的是基于百度飞桨开源的PaddlePaddleOCR c++部署。以上基于c++平台的均生成动态链接库由Rust调用并提供给前端使用。

模拟器的模拟操作基于ADB，PC端的模拟操作基于Rust以及C++的Windows API。

## 运行条件

- Windows 10/11 x64
- Rust[安装](https://tauri.app/zh-cn/v1/guides/getting-started/prerequisites) >= 1.81.0 
- pnpm 9.8.0(其它版本自测)
- Node.js v18.12.1(其它版本自测)

## 本地开发

- 克隆或fork本项目
- 安装依赖：`pnpm install`
- 安装dll依赖，详见：[项目依赖](./docs/dependents.md)
- 执行`pnpm tauri`启动项目