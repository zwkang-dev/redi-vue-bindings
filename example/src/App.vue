<script setup lang="ts">
import { Injector } from '@wendellhu/redi'

import { connectInjector } from '@zwkang-dev/redi-vue-binding'
import { ref } from 'vue'

import { CounterHook } from './components/counter-hook/counter.hook'
import CounterDemo from './components/counter-hook/CounterDemo.vue'
import { UserAuthModule } from './components/user-auth/user-auth-module'
import UserAuthDialog from './components/user-auth/UserAuthDialog.vue'
import UserAuthDialogControl from './components/user-auth/UserAuthDialogControl.vue'

const injector = new Injector([
  // 类形式（原有）
  [UserAuthModule],
  // useFactory 形式（简化版）—— 使用 createHookDependency
  CounterHook.asDependency(),
])

const inputValue = ref('')
</script>

<template>
  <div class=" w-full h-screen flex flex-row">
    <div class="w-[300px] h-full" />
    <connectInjector :injector="injector">
      <!-- useFactory Hook 示例 -->
      <CounterDemo />
      <!-- 类形式示例 -->
      <UserAuthDialog />
      <UserAuthDialogControl username="wenkangzhou" />
    </connectInjector>
    <div class="flex-1 h-full flex flex-col">
      <p class="p-[10px] border-[1px] border-back border-solid">
        查看左右侧内容是否一致 check left/right value
      </p>
      <textarea v-model="inputValue" class="w-full flex-1 min-h-0" />
    </div>
  </div>
</template>

<style scoped>
</style>
