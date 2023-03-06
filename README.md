### Unity Puerts 起始项目

使用腾讯的 [puerts](https://github.com/Tencent/puerts) 的 Unity 空项目，搭建好 TypeScript 编译调试工具，IDE配置等常用手脚架，不含任何游戏框架。仅提供 [webapi 兼容层](https://github.com/GodotExplorer/WebAPI)，实现部分常用的 WebAPI，并针对 Unity 优化了 Console API。

### Features
- 基础单元测试功能
- 最常用的 WebAPI 功能实现
- 使用 Webpack 构建脚本，开发模式下默认使用[ESBuild](https://github.com/evanw/esbuild)加速代码编译
- 发布代码时混淆压缩支持
- 配置好 SourceMap 和 VSCode 调试支持, 开箱即用

### 必备知识
- Unity 基础操作
- TypeScript/JavaScript 语言
- NodeJS 和 npm/yarn

### 如何使用

0. 确保已安装如下所需的开发工具
	- NodeJS 16+
	- Visual Studio Code
	- Unity 2019.4.8f1 及以后版本
1. 克隆该项目，项目结构如下
    - `src` TypeScript 脚本目录
    - `Assets/main.unity` 入口场景
    - `Assets/StreamingAssets/scripts` 编译生成的 JavaScript 脚本
    - `Assets/Scripts/Editor/PuertsConfig.cs` puerts 导出配置
2. 使用Unity打开项目，执行菜单中的`Puerts -> Generate index.d.ts` 导出 C# API, 注意使用 require 模式
3. 安装依赖：进入项目目录执行 `npm install` 或 `yarn install`，国内推荐设置淘宝镜像
4. 使用 VSCode 打开该项目，执行以下 npm 命令编译 JavaScript 库
    - `npm run webapi:publish:` 或 `yarn webapi:publish` 编译 WebAPI 兼容库
    - `npm run bundle:dev` 或 `yarn bundle:dev` 启动项目编译服务
![](screenshot/start.png)
5. 点击运行，启动游戏，如果一切顺利可以看到如下的日志，大功告成
	```log
	已启动 JavaScript 虚拟机
		at new JavaScriptApplication (src/main.ts:23:13 )
		at main (src/main.ts:12:10 )
	```

### 调试
- Unity 顺利启动JavaScript项目后可在 VSCode 中按 `F5` 键添加到运行中的调试器，之后便可在 TypeScript 文件中设置断点。
- 如需要调试启动相关的JavaScript代码，请在入口场景中选中`main`节点，勾选 `Wait For Debugger` 选项框。启动游戏后Unity会等待VSCode调试器连接，此时到VSCode中需要调试地方设置好断点后按`F5`连接调试器。
- 如需调试远程设备（手机真机调试），则打包前确保点击一次`main.unity -> main`节点属性面板的`重置调试目录`将脚本调试目录设置为你本地目录

### npm 命令简介
| 命令  |  功能 |
|---|---|
|bundle:dev| 启动`main.ts`为入口的编译服务，项目中的脚本变动会自动增量编译到 `bundle.js` |
|bundle:publish| 使用发布模式编译 `bundle.js` |
|bundle:analyze| 使用发布模式编译 `bundle.js` 并打开源代码分析服务 |
|webapi:dev| 启动 webapi 模块的编译服务 |
|webapi:publish| 使用发布模式编译 webapi 模块 |
|test:dev| 启动单元测试的编译服务 |

上述所有命令可以在在VSCode编辑的 NPM 脚本面板中一键启动
![](screenshot/npm.png)

### 单元测试

提供简单的单元测试，支持表达式、函数、Promise 三种测试规则，能够覆盖大多数单元测试需要。测试入口在 `src/test/GameTest.ts` 脚本中，可参考现有例子使用。

执行 test 单元测试后编译单元测试代码，Unity中运行项目可以进行单元测试
![](screenshot/unittest.png)

### FAQ
- 如何加载远程脚本，热更新脚本？
	- 实现 JavaScriptLoader 对应的接口
- 如何配置 C# 导出的接口
	- 修改 `Assets/Scripts/Editor/PuertsConfig.cs` 文件
- [puerts 的 Unity 文档](，[参考文档](https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md))
