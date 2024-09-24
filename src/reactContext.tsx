// import * as React from 'react'
import type { InjectionKey } from 'vue'
import type { Injector } from '@wendellhu/redi'

const __REDI_CONTEXT_LOCK__ = 'REDI_CONTEXT_LOCK'
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

const globalObject: any
  = (typeof globalThis !== 'undefined' && globalThis)
  || (typeof window !== 'undefined' && window)
  || (typeof global !== 'undefined' && global)

if (!globalObject[__REDI_CONTEXT_LOCK__])

  globalObject[__REDI_CONTEXT_LOCK__] = true

else if (!isNode)

  console.error('[redi]: "RediContext" is already created. You may import "RediContext" from different paths. Use "import { RediContext } from \'@wendellhu/redi/react-bindings\'; instead."')

export interface IRediContext {
  injector: Injector | null
}

export const RediContext: InjectionKey<IRediContext> = Symbol('RediContext')
