<script lang="ts" setup>
import { defineEmits, defineProps, toRefs } from 'vue'
import { Dialog, Form, FormItem, Input, Select, SelectOption } from 'tdesign-vue-next'
import { useDependency, useInjector } from '../../../../dist'
import { UserAuthModule } from './user-auth-module'

const injector = useInjector()!
const { visible, store, handleCancel, handleConfirm } = injector.get(UserAuthModule)
const userAuthModule = useDependency(UserAuthModule)
// userAuthModule.value.openDialog
</script>

<template>
  <Dialog :visible="visible" title="用户信息填写" @confirm="handleConfirm" @cancel="handleCancel">
    <Form :data="store!">
      <FormItem label="用户名" name="name">
        <Input v-model="store!.name" type="text" />
      </FormItem>

      <FormItem label="email" name="email">
        <Input v-model="store!.email" type="text" />
      </FormItem>
    </Form>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
