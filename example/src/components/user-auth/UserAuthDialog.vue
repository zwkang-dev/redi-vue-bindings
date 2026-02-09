<script lang="ts" setup>
import { useDependency } from '@zwkang-dev/redi-vue-binding'
import { Dialog, Form, FormItem, Input } from 'tdesign-vue-next'
import { UserAuthModule } from './user-auth-module'

const { visible, store, handleCancel, handleConfirm } = useDependency(UserAuthModule)
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
