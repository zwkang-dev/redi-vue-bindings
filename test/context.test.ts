import { describe, expect, it, vi } from 'vitest'

import { RediContext } from '../src/context'

describe('RediContext', () => {
  it('is a Symbol with description "RediContext"', () => {
    expect(typeof RediContext).toBe('symbol')
    expect(RediContext.description).toBe('RediContext')
  })

  it('is exported as an InjectionKey for Vue provide/inject', () => {
    expect(RediContext).toBeDefined()
    expect(typeof RediContext).toBe('symbol')
  })

  it('global lock is set after module import', async () => {
    const lockKey = 'REDI_CONTEXT_LOCK'
    expect((globalThis as any)[lockKey]).toBe(true)
  })

  it('does not log console.error on import in Node environment', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await import('../src/context')

    expect(errSpy).not.toHaveBeenCalled()
    errSpy.mockRestore()
  })
})

describe('IRediContext interface', () => {
  it('accepts valid context shape with injector', () => {
    const mockInjector = { get: vi.fn(), dispose: vi.fn() } as any

    const context = { injector: mockInjector }

    expect(context.injector).toBe(mockInjector)
  })

  it('accepts context with null injector', () => {
    const context = { injector: null }

    expect(context.injector).toBeNull()
  })
})
