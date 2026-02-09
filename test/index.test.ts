import { assert, it } from 'vitest'
import {
  connectDependencies,
  connectInjector,
  createHookDependency,
  defineHookDependency,
  RediContext,
  useDependency,
  useInjector,
} from '../src'

it('should export all public APIs', () => {
  assert.ok(connectDependencies)
  assert.ok(connectInjector)
  assert.ok(defineHookDependency)
  assert.ok(createHookDependency)
  assert.ok(RediContext)
  assert.ok(useDependency)
  assert.ok(useInjector)
})
