import type { ComputedRef } from 'vue'
import { createHookDependency, useDependency } from '@zwkang-dev/redi-vue-binding'
import { computed, ref } from 'vue'
import { UserAuthModule } from '../user-auth/user-auth-module'

// 1. 定义 Hook 返回类型
export interface ICounterHook {
  count: ReturnType<typeof ref<number>>
  doubleCount: ComputedRef<number>
  increment: () => void
  decrement: () => void
  reset: () => void
}

// 2. Vue 函数式 Hook
export function useCounter(initialValue = 0): ICounterHook {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)

  const userAuthModule = useDependency(UserAuthModule)
  console.log(userAuthModule)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset,
  }
}

// 3. 一行搞定：创建可注入的 Hook 依赖（自动使用函数名作为标识符）
export const CounterHook = createHookDependency(useCounter, 0)
