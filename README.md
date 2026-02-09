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

## 📄 License

[MIT](./LICENSE) License © 2022-present [zwkang](https://github.com/zwkang)

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️**

</div>
