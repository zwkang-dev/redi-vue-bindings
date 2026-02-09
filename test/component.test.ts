import type { Dependency } from '@wendellhu/redi'

import { createIdentifier, Injector } from '@wendellhu/redi'
import { mount } from '@vue/test-utils'
import { defineComponent, h, provide } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { RediContext } from '../src/context'
import { connectDependencies, connectInjector, provideRediInjector } from '../src/component'
import { useDependency, useInjector } from '../src/hooks'

function uniqueId(prefix = 'Id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

describe('connectInjector', () => {
  it('provides the passed injector to descendants via RediContext', () => {
    const Id = createIdentifier<string>(uniqueId('TestId'))
    const dep: Dependency<string> = [Id, { useValue: 'injected-value' }]
    const injector = new Injector([dep])

    const capturedValues: { injector?: Injector, value?: string } = {}

    const Child = defineComponent({
      setup() {
        capturedValues.injector = useInjector()
        capturedValues.value = useDependency(Id)
        return () => h('div', capturedValues.value)
      },
    })

    const wrapper = mount(connectInjector, {
      props: { injector },
      slots: { default: () => h(Child) },
    })

    expect(capturedValues.injector).toBeInstanceOf(Injector)
    expect(capturedValues.value).toBe('injected-value')
    expect(wrapper.text()).toBe('injected-value')
  })

  it('renders slot content correctly', () => {
    const injector = new Injector([])

    const wrapper = mount(connectInjector, {
      props: { injector },
      slots: { default: () => h('span', 'slot-content') },
    })

    expect(wrapper.find('span').text()).toBe('slot-content')
  })
})

describe('connectDependencies', () => {
  it('creates a new injector when no parent context exists', () => {
    const Id = createIdentifier<string>(uniqueId('NewInjectorId'))
    const deps: Dependency[] = [[Id, { useValue: 'new-value' }]]

    const capturedValues: { injector?: Injector, value?: string } = {}

    const Child = defineComponent({
      setup() {
        capturedValues.injector = useInjector()
        capturedValues.value = useDependency(Id)
        return () => h('div', capturedValues.value)
      },
    })

    mount(connectDependencies, {
      props: { dependencies: deps },
      slots: { default: () => h(Child) },
    })

    expect(capturedValues.injector).toBeInstanceOf(Injector)
    expect(capturedValues.value).toBe('new-value')
  })

  it('creates a child injector when parent context exists and resolves both parent and child deps', () => {
    const ParentId = createIdentifier<string>(uniqueId('ParentId'))
    const ChildId = createIdentifier<string>(uniqueId('ChildId'))

    const parentInjector = new Injector([[ParentId, { useValue: 'parent-value' }]])
    const childDeps: Dependency[] = [[ChildId, { useValue: 'child-value' }]]

    const capturedValues: { injector?: Injector, parentValue?: string, childValue?: string } = {}

    const Child = defineComponent({
      setup() {
        capturedValues.injector = useInjector()
        capturedValues.parentValue = useDependency(ParentId)
        capturedValues.childValue = useDependency(ChildId)
        return () => h('div', `${capturedValues.parentValue}-${capturedValues.childValue}`)
      },
    })

    const wrapper = mount(connectInjector, {
      props: { injector: parentInjector },
      slots: {
        default: () => h(connectDependencies, { dependencies: childDeps }, {
          default: () => h(Child),
        }),
      },
    })

    expect(capturedValues.injector).not.toBe(parentInjector)
    expect(capturedValues.injector).toBeInstanceOf(Injector)
    expect(capturedValues.parentValue).toBe('parent-value')
    expect(capturedValues.childValue).toBe('child-value')
    expect(wrapper.text()).toBe('parent-value-child-value')
  })

  it('child injector can override parent dependencies', () => {
    const Id = createIdentifier<string>(uniqueId('OverrideId'))

    const parentInjector = new Injector([[Id, { useValue: 'parent' }]])
    const childDeps: Dependency[] = [[Id, { useValue: 'child' }]]

    const capturedValues: { value?: string } = {}

    const Child = defineComponent({
      setup() {
        capturedValues.value = useDependency(Id)
        return () => h('div', capturedValues.value)
      },
    })

    mount(connectInjector, {
      props: { injector: parentInjector },
      slots: {
        default: () => h(connectDependencies, { dependencies: childDeps }, {
          default: () => h(Child),
        }),
      },
    })

    expect(capturedValues.value).toBe('child')
  })

  it('disposes the created injector on unmount', async () => {
    const disposeSpy = vi.spyOn(Injector.prototype, 'dispose')
    const Id = createIdentifier<string>(uniqueId('DisposeId'))
    const deps: Dependency[] = [[Id, { useValue: 'disposable' }]]

    const wrapper = mount(connectDependencies, {
      props: { dependencies: deps },
      slots: { default: () => h('div', 'content') },
    })

    expect(disposeSpy).not.toHaveBeenCalled()

    wrapper.unmount()

    expect(disposeSpy).toHaveBeenCalled()
    disposeSpy.mockRestore()
  })
})

describe('provideRediInjector', () => {
  it('creates and provides a new injector when no parent context exists', () => {
    const Id = createIdentifier<string>(uniqueId('ProvideNewId'))
    const deps: Dependency[] = [[Id, { useValue: 'provided-value' }]]

    const capturedValues: { returnedInjector?: Injector, value?: string } = {}

    const Comp = defineComponent({
      setup() {
        const { injector } = provideRediInjector(deps)
        capturedValues.returnedInjector = injector
        return () => {
          const ChildComp = defineComponent({
            setup() {
              capturedValues.value = useDependency(Id)
              return () => h('div', capturedValues.value)
            },
          })
          return h(ChildComp)
        }
      },
    })

    mount(Comp)

    expect(capturedValues.returnedInjector).toBeInstanceOf(Injector)
    expect(capturedValues.value).toBe('provided-value')
  })

  it('creates a child injector when parent context exists', () => {
    const ParentId = createIdentifier<string>(uniqueId('ProvideParentId'))
    const ChildId = createIdentifier<string>(uniqueId('ProvideChildId'))
    const parentInjector = new Injector([[ParentId, { useValue: 'P' }]])

    const capturedValues: { returnedInjector?: Injector, parentValue?: string, childValue?: string } = {}

    const Child = defineComponent({
      setup() {
        const { injector } = provideRediInjector([[ChildId, { useValue: 'C' }]])
        capturedValues.returnedInjector = injector
        return () => {
          const GrandChild = defineComponent({
            setup() {
              capturedValues.parentValue = useDependency(ParentId)
              capturedValues.childValue = useDependency(ChildId)
              return () => h('div', `${capturedValues.parentValue}${capturedValues.childValue}`)
            },
          })
          return h(GrandChild)
        }
      },
    })

    const Parent = defineComponent({
      setup() {
        provide(RediContext, { injector: parentInjector })
        return () => h(Child)
      },
    })

    const wrapper = mount(Parent)

    expect(capturedValues.returnedInjector).not.toBe(parentInjector)
    expect(capturedValues.returnedInjector).toBeInstanceOf(Injector)
    expect(capturedValues.parentValue).toBe('P')
    expect(capturedValues.childValue).toBe('C')
    expect(wrapper.text()).toBe('PC')
  })

  it('returns injector that can resolve dependencies immediately', () => {
    const Id = createIdentifier<string>(uniqueId('ImmediateId'))
    const deps: Dependency[] = [[Id, { useValue: 'immediate' }]]

    let directResult: string | undefined

    const Comp = defineComponent({
      setup() {
        const { injector } = provideRediInjector(deps)
        directResult = injector.get(Id)
        return () => h('div')
      },
    })

    mount(Comp)

    expect(directResult).toBe('immediate')
  })

  it('disposes child injector on scope dispose', async () => {
    const disposeSpy = vi.spyOn(Injector.prototype, 'dispose')
    const Id = createIdentifier<string>(uniqueId('ScopeDisposeId'))
    const deps: Dependency[] = [[Id, { useValue: 'scope' }]]

    const Comp = defineComponent({
      setup() {
        provideRediInjector(deps)
        return () => h('div')
      },
    })

    const wrapper = mount(Comp)
    wrapper.unmount()

    expect(disposeSpy).toHaveBeenCalled()
    disposeSpy.mockRestore()
  })
})
