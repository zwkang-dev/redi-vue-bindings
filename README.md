<div align="center">

# @zwkang-dev/redi-vue-binding

<img src="https://img.shields.io/npm/v/@zwkang-dev/redi-vue-binding?style=flat-square&color=00dc82" alt="npm version" />
<img src="https://img.shields.io/npm/dm/@zwkang-dev/redi-vue-binding?style=flat-square&color=00dc82" alt="npm downloads" />
<img src="https://img.shields.io/badge/vue-3.3+-00dc82?style=flat-square" alt="vue version" />
<img src="https://img.shields.io/github/license/zwkang-dev/redi-vue-bindings?style=flat-square&color=00dc82" alt="license" />

**将 [redi](https://github.com/nicebro/redi) 依赖注入框架无缝集成到 Vue 3**

[安装](#-安装) · [快速开始](#-快速开始) · [API](#-api) · [示例](#-示例)

</div>

---

## ✨ 特性

- 🎯 **类型安全** - 完整的 TypeScript 支持
- 🪝 **Hook 友好** - 支持 Vue Composition API 风格
- 🌲 **层级注入** - 支持父子 Injector 依赖覆盖
- 🔄 **自动清理** - 组件卸载时自动 dispose
- 📦 **体积小巧** - 零运行时依赖

---

## 📦 安装

```bash
# pnpm
pnpm add @zwkang-dev/redi-vue-binding @wendellhu/redi

# npm
npm install @zwkang-dev/redi-vue-binding @wendellhu/redi

# yarn
yarn add @zwkang-dev/redi-vue-binding @wendellhu/redi
```

---

## 🚀 快速开始

### 1. 定义服务

```typescript
// user.service.ts
import { ref } from 'vue'

export class UserService {
  user = ref<string | null>(null)

  login(name: string) {
    this.user.value = name
  }

  logout() {
    this.user.value = null
  }
}
```

### 2. 注入到组件树

```vue
<!-- App.vue -->
<script setup lang="ts">
import { Injector } from '@wendellhu/redi'
import { connectInjector } from '@zwkang-dev/redi-vue-binding'
import { UserService } from './user.service'

const injector = new Injector([[UserService]])
</script>

<template>
  <connectInjector :injector="injector">
    <ChildComponent />
  </connectInjector>
</template>
```

### 3. 在子组件中使用

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
import { useDependency } from '@zwkang-dev/redi-vue-binding'
import { UserService } from './user.service'

const userService = useDependency(UserService)
</script>

<template>
  <div>
    <p>当前用户: {{ userService.user }}</p>
    <button @click="userService.login('张三')">
      登录
    </button>
  </div>
</template>
```

---

## 📖 API

### 组件

| 组件 | 描述 |
|------|------|
| `<connectInjector>` | 将 Injector 实例注入到组件树 |
| `<connectDependencies>` | 创建子 Injector，支持依赖覆盖 |

### Hooks

| Hook | 描述 |
|------|------|
| `useDependency(id)` | 获取依赖实例 |
| `useInjector()` | 获取当前 Injector |

### 工具函数

| 函数 | 描述 |
|------|------|
| `createHookDependency(hook, ...args)` | 将 Vue Hook 转换为可注入依赖 |

---

## 🪝 使用 Vue Hook 作为依赖

除了类，你还可以使用 **Vue Composition API** 风格组织代码：

```typescript
import { createHookDependency } from '@zwkang-dev/redi-vue-binding'
// counter.hook.ts
import { computed, ref } from 'vue'

function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const double = computed(() => count.value * 2)
  const increment = () => count.value++
  return { count, double, increment }
}

// 一行创建可注入依赖
export const CounterHook = createHookDependency(useCounter, 0)
```

```typescript
// 注册
const injector = new Injector([
  CounterHook.asDependency(),
])

// 使用
const counter = useDependency(CounterHook)
counter.increment()
```

---

## 🎯 示例

<details>
<summary><b>层级依赖覆盖</b></summary>

```vue
<template>
  <connectInjector :injector="parentInjector">
    <!-- 使用父级 Logger -->
    <LoggerConsumer />

    <connectDependencies :dependencies="childDeps">
      <!-- 使用子级覆盖的 Logger -->
      <LoggerConsumer />
    </connectDependencies>
  </connectInjector>
</template>
```

</details>

<details>
<summary><b>可选依赖</b></summary>

```typescript
import { Quantity } from '@wendellhu/redi'

// 可选（不存在返回 null）
const optional = useDependency(MyService, Quantity.OPTIONAL)

// 获取所有实现（数组）
const all = useDependency(MyService, Quantity.MANY)
```

</details>

---

## ❓ 常见问题

<details>
<summary><b>使用 createHookDependency 时类型推断为 any</b></summary>

### 问题描述

当你的项目使用 `moduleResolution: "node"` 时，`createHookDependency` 返回的类型可能会被推断为 `any`：

```typescript
// ❌ useGlobalEnv 类型为 any
export const useGlobalEnv = createHookDependency(useGlobalEnvLocal);
```

### 原因

`moduleResolution: "node"` 是为 CommonJS 时代设计的旧解析算法，对现代 ESM 包的类型解析支持有限。当 TypeScript 解析跨包的泛型类型时（`redi-vue-binding` → `@wendellhu/redi` 的 `IdentifierDecorator<T>`），类型链容易断裂，导致泛型 `T` 丢失并退化为 `any`。

### 解决方案

**方案一：升级 moduleResolution（推荐）**

在 `tsconfig.json` 中将 `moduleResolution` 改为 `bundler`：

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

**方案二：添加 paths 映射**

如果无法修改 `moduleResolution`，可以在 `tsconfig.json` 中添加 paths 映射，直接指向源码：

```json
{
  "compilerOptions": {
    "paths": {
      "@zwkang-dev/redi-vue-binding": ["/path/to/redi-vue-binding/src/index.ts"],
      "@wendellhu/redi": ["./node_modules/@wendellhu/redi/dist/esm/index.d.ts"]
    }
  }
}
```

### moduleResolution 对比

| 特性 | `"node"` | `"bundler"` |
|------|----------|-------------|
| 适用场景 | Node.js / CommonJS | Vite / Webpack / ESM |
| `exports` 字段支持 | 有限 | 完整 |
| ESM 类型追踪 | 容易断链 | 正常 |
| 泛型跨包传递 | 易丢失 | 正常 |

</details>

---

## 📄 License

[MIT](./LICENSE) License © 2022-present [zwkang](https://github.com/zwkang)

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️**

</div>
