import type { Dependency } from '@wendellhu/redi'

import type { PropType } from 'vue'
import { injectLocal, provideLocal, tryOnScopeDispose } from '@vueuse/core'
import { Injector } from '@wendellhu/redi'
import { defineComponent, shallowRef } from 'vue'
import { RediContext } from './context'

export function provideRediInjector(dependencies: Dependency[]) {
  const childInjectorRef = shallowRef<Injector>()
  tryOnScopeDispose(() => childInjectorRef.value?.dispose())
  const context = injectLocal(RediContext)
  if (!context || !context.injector) {
    childInjectorRef.value = new Injector(dependencies)
    provideLocal(RediContext, {
      injector: childInjectorRef.value,
    })
  }
  else {
    childInjectorRef.value = context.injector.createChild(dependencies)
    provideLocal(RediContext, {
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
    provideLocal(RediContext, props)
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
        slots.default?.()
      )
    }
  },
})
