<script lang="ts" setup>
import { useInjector } from '@zwkang-dev/redi-vue-binding'
import { Button } from 'tdesign-vue-next'
import { UserAuthModule } from './user-auth-module'

interface IProps {
  username: string
}

defineProps<IProps>()

const injector = useInjector()!

const { openDialog } = injector.get(UserAuthModule)

async function handleClick() {
  const result = await openDialog('wenkangzhou')
  if (result.isCanceled) {
    console.log('canceled')
    return
  }

  console.log(result.data)
  // console.log('123123')
}
</script>

<template>
  <Button @click="handleClick">
    填写用户信息
  </Button>
</template>

<style lang="scss" scoped>

</style>
