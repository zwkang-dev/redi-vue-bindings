import type {
  DependencyIdentifier,
  Injector,
  LookUp,
  Quantity,
} from '@wendellhu/redi'
import { RediError } from '@wendellhu/redi'
import { injectLocal } from '@vueuse/core'

import { RediContext } from './context'

class HooksNotInRediContextError extends RediError {
  constructor() {
    super('Using dependency injection outside of a RediContext.')
  }
}

export function useInjector(): Injector {
  const injectionContext = injectLocal(RediContext)
  if (!injectionContext || !injectionContext.injector)
    throw new HooksNotInRediContextError()
  return injectionContext.injector
}

export function useDependency<T>(
  id: DependencyIdentifier<T>,
  lookUp?: LookUp
): T
export function useDependency<T>(
  id: DependencyIdentifier<T>,
  quantity: Quantity.MANY,
  lookUp?: LookUp
): T[]
export function useDependency<T>(
  id: DependencyIdentifier<T>,
  quantity: Quantity.OPTIONAL,
  lookUp?: LookUp
): T | null
export function useDependency<T>(
  id: DependencyIdentifier<T>,
  quantity: Quantity.REQUIRED,
  lookUp?: LookUp
): T
export function useDependency<T>(
  id: DependencyIdentifier<T>,
  quantity: Quantity,
  lookUp?: LookUp
): T | T[] | null
export function useDependency<T>(
  id: DependencyIdentifier<T>,
  quantity?: Quantity,
  lookUp?: LookUp
): T | T[] | null
export function useDependency<T>(
  id: DependencyIdentifier<T>,
  quantityOrLookUp?: Quantity | LookUp,
  lookUp?: LookUp,
): T | T[] | null {
  const injector = useInjector()
  return injector.get<T>(id, quantityOrLookUp, lookUp)
}
