<script setup lang="ts">
import { useDependency } from '@zwkang-dev/redi-vue-binding'
import { CounterHook } from './counter.hook'

// 通过 DI 获取 Hook 实例
const counter = useDependency(CounterHook)
</script>

<template>
  <div class="p-4 border rounded-lg">
    <h2 class="text-lg font-bold mb-4">
      useFactory Hook 示例
    </h2>
    <div class="flex items-center gap-4">
      <button class="px-3 py-1 bg-blue-500 text-white rounded" @click="counter.decrement">
        -
      </button>
      <span class="text-xl">{{ counter.count }}</span>
      <button class="px-3 py-1 bg-blue-500 text-white rounded" @click="counter.increment">
        +
      </button>
    </div>
    <p class="mt-2 text-gray-600">
      Double: {{ counter.doubleCount }}
    </p>
    <button class="mt-2 px-3 py-1 bg-gray-300 rounded" @click="counter.reset">
      Reset
    </button>
  </div>
</template>
