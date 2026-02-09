import { Injector } from '@wendellhu/redi'
import { describe, expect, it, vi } from 'vitest'

import { createHookDependency, defineHookDependency } from '../src/defineHook'

function uniqueName(prefix = 'hook') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

describe('defineHookDependency', () => {
  it('uses hook.name as identifier name when custom name is not provided', () => {
    const name = uniqueName('useCounter')
    const hook = { [name]: (n: number) => n + 1 }[name] as (n: number) => number

    const { identifier, dependency } = defineHookDependency(hook, 1)

    expect(identifier.toString()).toBe(name)
    expect(dependency[0]).toBe(identifier)

    const injector = new Injector([dependency])
    expect(injector.get(identifier)).toBe(2)
  })

  it('uses the provided custom name when last arg is string and args length > hook.length', () => {
    const customName = uniqueName('CustomCounter')
    const hook = vi.fn((n: number) => n * 2)
    Object.defineProperty(hook, 'name', { value: uniqueName('originalName') })

    const { identifier, dependency } = defineHookDependency(hook, 2, customName)

    expect(identifier.toString()).toBe(customName)

    const injector = new Injector([dependency])
    expect(injector.get(identifier)).toBe(4)
    expect(hook).toHaveBeenCalledWith(2)
  })

  it('treats trailing string as a hook argument when args length <= hook.length', () => {
    const hookName = uniqueName('useFormatter')
    const hook = {
      [hookName]: (n: number, s: string) => `${n}:${s}`,
    }[hookName] as (n: number, s: string) => string

    const { identifier, dependency } = defineHookDependency(hook, 1, 'suffix')

    expect(identifier.toString()).toBe(hookName)

    const injector = new Injector([dependency])
    expect(injector.get(identifier)).toBe('1:suffix')
  })

  it('falls back to "AnonymousHook" when hook.name is empty', () => {
    const hook = vi.fn(() => 42)
    Object.defineProperty(hook, 'name', { value: '' })

    const { identifier, dependency } = defineHookDependency(hook)

    expect(identifier.toString()).toBe('AnonymousHook')

    const injector = new Injector([dependency])
    expect(injector.get(identifier)).toBe(42)
  })

  it('caches factory result in Injector (hook invoked once for multiple get calls)', () => {
    const customName = uniqueName('CachedHook')
    const hook = vi.fn(() => ({ value: Math.random() }))
    Object.defineProperty(hook, 'name', { value: uniqueName('hookFn') })

    const { identifier, dependency } = defineHookDependency(hook, customName)
    const injector = new Injector([dependency])

    const first = injector.get(identifier)
    const second = injector.get(identifier)

    expect(first).toBe(second)
    expect(hook).toHaveBeenCalledTimes(1)
  })

  it('supports hooks with no arguments', () => {
    const hookName = uniqueName('useNoArgs')
    const hook = { [hookName]: () => 'no-args-result' }[hookName] as () => string

    const { identifier, dependency } = defineHookDependency(hook)
    const injector = new Injector([dependency])

    expect(injector.get(identifier)).toBe('no-args-result')
  })

  it('supports hooks with multiple arguments', () => {
    const hookName = uniqueName('useMultiArgs')
    const hook = {
      [hookName]: (a: number, b: string, c: boolean) => `${a}-${b}-${c}`,
    }[hookName] as (a: number, b: string, c: boolean) => string

    const { identifier, dependency } = defineHookDependency(hook, 1, 'test', true)
    const injector = new Injector([dependency])

    expect(injector.get(identifier)).toBe('1-test-true')
  })
})

describe('createHookDependency', () => {
  it('returns an identifier decorator with an asDependency() helper', () => {
    const name = uniqueName('useCreateHook')
    const hook = vi.fn((n: number) => n * 3)
    Object.defineProperty(hook, 'name', { value: name })

    const dep = createHookDependency(hook, 2)

    expect(typeof dep).toBe('function')
    expect(dep.toString()).toBe(name)
    expect(typeof dep.asDependency).toBe('function')

    const injector = new Injector([dep.asDependency()])
    expect(injector.get(dep)).toBe(6)
  })

  it('asDependency() uses default args when called without arguments', () => {
    const name = uniqueName('useDefaultArgs')
    const hook = vi.fn((n: number) => n + 10)
    Object.defineProperty(hook, 'name', { value: name })

    const dep = createHookDependency(hook, 5)
    const injector = new Injector([dep.asDependency()])

    expect(injector.get(dep)).toBe(15)
  })

  it('asDependency(...args) overrides default args', () => {
    const name = uniqueName('useOverrideArgs')
    const hook = vi.fn((n: number) => n + 10)
    Object.defineProperty(hook, 'name', { value: name })

    const dep = createHookDependency(hook, 1)

    const injector1 = new Injector([dep.asDependency()])
    expect(injector1.get(dep)).toBe(11)

    const injector2 = new Injector([dep.asDependency(5)])
    expect(injector2.get(dep)).toBe(15)
  })

  it('falls back to "AnonymousHook" when hook.name is empty', () => {
    const hook = vi.fn(() => 'anonymous')
    Object.defineProperty(hook, 'name', { value: '' })

    const dep = createHookDependency(hook)

    expect(dep.toString()).toBe('AnonymousHook')
  })

  it('can be used directly as identifier in useDependency patterns', () => {
    const name = uniqueName('useDirectId')
    const hook = vi.fn(() => ({ id: 123 }))
    Object.defineProperty(hook, 'name', { value: name })

    const dep = createHookDependency(hook)
    const injector = new Injector([dep.asDependency()])

    const result = injector.get(dep)
    expect(result).toEqual({ id: 123 })
  })
})
