<script setup lang="ts">
import { ref } from 'vue'

import { Injector } from '@wendellhu/redi'
import { connectInjector } from '../../'

import { A, B } from './modules'

import ACom from './ACom.vue'
import UserAuthDialog from './components/user-auth/UserAuthDialog.vue'
import UserAuthDialogControl from './components/user-auth/UserAuthDialogControl.vue'
import { UserAuthModule } from './components/user-auth/user-auth-module'

const injector = new Injector([[UserAuthModule]])
// console.log(injector)
const inputValue = ref('')
</script>

<template>
  <div class=" w-full h-screen flex flex-row">
    <div class="w-[300px] h-full" />
    <connectInjector :injector="injector">
      <!-- <ACom /> -->
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
