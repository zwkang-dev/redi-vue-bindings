import type { DependencyIdentifier } from '@wendellhu/redi'

import { LookUp, Quantity } from '@wendellhu/redi'
import { mount } from '@vue/test-utils'
import { defineComponent, h, provide } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { RediContext } from '../src/context'
import { useDependency, useInjector } from '../src/hooks'

function uniqueId(prefix = 'dep') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function createChildComponent<T>(testFn: () => T, resultHolder: { value?: T }) {
  return defineComponent({
    setup() {
      resultHolder.value = testFn()
      return () => h('div', 'child')
    },
  })
}

function mountWithContext(contextValue: any, testFn: () => any, resultHolder: { value?: any }) {
  const Child = createChildComponent(testFn, resultHolder)
  const Parent = defineComponent({
    setup() {
      provide(RediContext, contextValue)
      return () => h(Child)
    },
  })
  return mount(Parent)
}

describe('useInjector', () => {
  it('returns injector from RediContext', () => {
    const mockInjector = { get: vi.fn() }
    const result: { value?: any } = {}

    mountWithContext({ injector: mockInjector }, () => useInjector(), result)

    expect(result.value).toBe(mockInjector)
  })

  it('throws HooksNotInRediContextError when context.injector is null', () => {
    const result: { value?: any } = {}

    expect(() => {
      mountWithContext({ injector: null }, () => useInjector(), result)
    }).toThrowError('Using dependency injection outside of a RediContext.')
  })

  it('throws when used outside of any RediContext provider', () => {
    expect(() => {
      mount(defineComponent({
        setup() {
          useInjector()
          return () => h('div')
        },
      }))
    }).toThrow()
  })
})

describe('useDependency', () => {
  it('delegates to injector.get(id) and returns its result', () => {
    const id: DependencyIdentifier<string> = uniqueId('stringDep')
    const mockInjector = {
      get: vi.fn().mockReturnValue('resolved-value'),
    }
    const result: { value?: string } = {}

    mountWithContext({ injector: mockInjector }, () => useDependency(id), result)

    expect(result.value).toBe('resolved-value')
    expect(mockInjector.get).toHaveBeenCalledWith(id, undefined, undefined)
  })

  it('supports Quantity.MANY overload', () => {
    const id: DependencyIdentifier<string> = uniqueId('manyDep')
    const mockInjector = {
      get: vi.fn().mockReturnValue(['A', 'B', 'C']),
    }
    const result: { value?: string[] } = {}

    mountWithContext({ injector: mockInjector }, () => useDependency(id, Quantity.MANY), result)

    expect(result.value).toEqual(['A', 'B', 'C'])
    expect(mockInjector.get).toHaveBeenCalledWith(id, Quantity.MANY, undefined)
  })

  it('supports Quantity.OPTIONAL overload', () => {
    const id: DependencyIdentifier<string> = uniqueId('optionalDep')
    const mockInjector = {
      get: vi.fn().mockReturnValue(null),
    }
    const result: { value?: string | null } = {}

    mountWithContext({ injector: mockInjector }, () => useDependency(id, Quantity.OPTIONAL), result)

    expect(result.value).toBeNull()
    expect(mockInjector.get).toHaveBeenCalledWith(id, Quantity.OPTIONAL, undefined)
  })

  it('supports Quantity.REQUIRED overload', () => {
    const id: DependencyIdentifier<string> = uniqueId('requiredDep')
    const mockInjector = {
      get: vi.fn().mockReturnValue('required-value'),
    }
    const result: { value?: string } = {}

    mountWithContext({ injector: mockInjector }, () => useDependency(id, Quantity.REQUIRED), result)

    expect(result.value).toBe('required-value')
    expect(mockInjector.get).toHaveBeenCalledWith(id, Quantity.REQUIRED, undefined)
  })

  it('supports LookUp.SELF as second argument', () => {
    const id: DependencyIdentifier<string> = uniqueId('selfDep')
    const mockInjector = {
      get: vi.fn().mockReturnValue('self-value'),
    }
    const result: { value?: string } = {}

    mountWithContext({ injector: mockInjector }, () => useDependency(id, LookUp.SELF), result)

    expect(mockInjector.get).toHaveBeenCalledWith(id, LookUp.SELF, undefined)
  })

  it('supports LookUp.SKIP_SELF as second argument', () => {
    const id: DependencyIdentifier<string> = uniqueId('skipSelfDep')
    const mockInjector = {
      get: vi.fn().mockReturnValue('skip-self-value'),
    }
    const result: { value?: string } = {}

    mountWithContext({ injector: mockInjector }, () => useDependency(id, LookUp.SKIP_SELF), result)

    expect(mockInjector.get).toHaveBeenCalledWith(id, LookUp.SKIP_SELF, undefined)
  })

  it('supports Quantity + LookUp combination', () => {
    const id: DependencyIdentifier<string> = uniqueId('comboDepManyself')
    const mockInjector = {
      get: vi.fn().mockReturnValue(['X', 'Y']),
    }
    const result: { value?: string[] } = {}

    mountWithContext({ injector: mockInjector }, () => useDependency(id, Quantity.MANY, LookUp.SELF), result)

    expect(mockInjector.get).toHaveBeenCalledWith(id, Quantity.MANY, LookUp.SELF)
  })

  it('supports Quantity.OPTIONAL + LookUp.SKIP_SELF combination', () => {
    const id: DependencyIdentifier<string> = uniqueId('comboDep')
    const mockInjector = {
      get: vi.fn().mockReturnValue(null),
    }
    const result: { value?: string | null } = {}

    mountWithContext({ injector: mockInjector }, () => useDependency(id, Quantity.OPTIONAL, LookUp.SKIP_SELF), result)

    expect(mockInjector.get).toHaveBeenCalledWith(id, Quantity.OPTIONAL, LookUp.SKIP_SELF)
  })
})
