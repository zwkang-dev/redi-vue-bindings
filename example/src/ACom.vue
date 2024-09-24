<script lang="ts" setup>
import { defineEmits, defineProps, inject, toRefs } from 'vue'
import { LookUp, Quantity } from '@wendellhu/redi'
import type { RediContext } from '../../'
import { useDependency, useInjector } from '../../'
import { A, B } from './modules'

const props = defineProps<IProps>()
// @WithDependency(IStateService, Quantity.Optional, LookUp.SkipSelf);

// useInjector
// const xxx = useDependency(A, Quantity.OPTIONAL, LookUp.SKIP_SELF)
interface IProps {

}

// const context = inject<RediContext>('rediContext')!
const context = useInjector()!
// console.log(injector.value.get(B))
const { inc, dec, count } = context.value.injector.get(B)
// const { } = toRefs(props)
// const BModule = injector.get(B)
// console.log(BModule)
</script>

<template>
  <div>
    {{ count }}
    <button @click="inc">
      增加
    </button>
    <button @click="dec">
      减少
    </button>
    <!-- {{ injector }} -->
  </div>
</template>

<style lang="scss" scoped>

</style>
