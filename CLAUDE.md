# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

`@zwkang-dev/redi-vue-binding` 是一个将 [redi](https://github.com/nicebro/redi) 依赖注入框架适配到 Vue 3 的绑定库。

## 常用命令

```bash
# 开发（监听模式）
pnpm dev

# 构建
pnpm build

# 运行测试
pnpm test

# 类型检查
pnpm typecheck

# 代码格式化
pnpm lint:fix

# 版本升级
pnpm bump:version

# 发布（需先 build）
pnpm release
```

## 核心架构

### 导出 API（src/index.ts）

```
src/
├── index.ts          # 入口，重导出所有公共 API
├── publicApi.ts      # 公共 API 聚合
├── context.tsx       # RediContext - Vue provide/inject 的 InjectionKey
├── component.tsx     # connectInjector / connectDependencies 组件
├── hooks.tsx         # useDependency / useInjector hooks
└── defineHook.ts     # createHookDependency - Vue Hook 转 DI 依赖
```

### 核心概念

1. **RediContext** - 通过 Vue 的 `provide/inject` 传递 Injector 实例
2. **connectInjector** - 根组件，接收 Injector 实例并注入到组件树
3. **connectDependencies** - 创建子 Injector，支持依赖覆盖
4. **useDependency(id)** - 从 Injector 获取依赖实例
5. **useInjector()** - 获取当前 Injector 实例
6. **createHookDependency(hook, ...args)** - 将 Vue Composition Hook 转换为可注入依赖

### 使用模式

```typescript
// 类形式
const injector = new Injector([[MyService]])

// Hook 形式（通过 useFactory）
const CounterHook = createHookDependency(useCounter, 0)
const injector = new Injector([CounterHook.asDependency()])
```

## Peer Dependencies

- `vue` >= 3.3.0
- `@wendellhu/redi` ^1.0.0
- `@vueuse/core` >= 9.0.0

## example 目录

`example/` 是独立的 Vue 项目，用于演示库的使用方式。开发时通过 tsconfig paths 和 vite alias 指向 `src/` 源码。
