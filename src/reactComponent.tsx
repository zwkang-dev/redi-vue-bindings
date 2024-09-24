import { type Dependency, Injector } from '@wendellhu/redi'

import type { PropType } from 'vue'
import { defineComponent, inject, provide, shallowRef } from 'vue'
import { tryOnScopeDispose } from '@vueuse/core'
import { RediContext } from './reactContext'

export function provideRediInjector(dependencies: Dependency[]) {
  const childInjectorRef = shallowRef<Injector >()
  tryOnScopeDispose(() => childInjectorRef.value?.dispose())
  const context = inject(RediContext)
  if (!context || !context.injector) {
    childInjectorRef.value = new Injector(dependencies)
    provide(RediContext, {
      injector: childInjectorRef.value,
    })
  }
  else {
    childInjectorRef.value = context.injector.createChild(dependencies)
    provide(RediContext, {
      injector: childInjectorRef.value,
    })
  }
  return {
    injector: childInjectorRef.value,
  }
}

export const connectInjector = defineComponent({
  props: {
    injector: {
      type: Object as PropType<Injector>,
      required: true,
    },
  },
  setup(props, { slots }) {
    // const { injector } = toRefs(props)
    // const injectorValue = computed(() => ({
    //   injector: injector.value,
    // }))
    provide(RediContext, props)
    return () => {
      return (
        slots.default?.()
      )
    }
  },
})

export const connectDependencies = defineComponent({
  props: {
    dependencies: {
      type: Array as PropType<Dependency[]>,
      required: true,
    },
  },
  setup(props, { slots }) {
    provideRediInjector(props.dependencies)
    return () => {
      return (
        <>
          {slots.default?.()}
        </>
      )
    }
  },
})
