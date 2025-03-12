// import * as React from 'react'
import type { ComputedRef, Ref } from 'vue'
import { computed, inject, unref } from 'vue'
import type {
  DependencyIdentifier,
  Injector,
  LookUp,
  Quantity,
} from '@wendellhu/redi'
import {
  RediError,
} from '@wendellhu/redi'

import { RediContext } from './reactContext'

type MaybeRef<T> = T | Ref<T>

class HooksNotInRediContextError extends RediError {
  constructor() {
    super('Using dependency injection outside of a RediContext.')
  }
}

export function useInjector(): Injector {
  const injectionContext = inject(RediContext)!
  if (!injectionContext.injector)
    throw new HooksNotInRediContextError()
  return injectionContext.injector!
}

export function useDependency<T>(
  id: MaybeRef<DependencyIdentifier<T>>,
  lookUp?: MaybeRef<LookUp>
): ComputedRef<T>
export function useDependency<T>(
  id: MaybeRef<DependencyIdentifier<T>>,
  quantity: MaybeRef<Quantity.MANY>,
  lookUp?: MaybeRef<LookUp>
): ComputedRef<T[]>
export function useDependency<T>(
  id: MaybeRef<DependencyIdentifier<T>>,
  quantity: MaybeRef<Quantity.OPTIONAL>,
  lookUp?: MaybeRef<LookUp>
): ComputedRef<T | null>
export function useDependency<T>(
  id: MaybeRef<DependencyIdentifier<T>>,
  quantity: MaybeRef<Quantity.REQUIRED>,
  lookUp?: MaybeRef<LookUp>
): ComputedRef<T>
export function useDependency<T>(
  id: MaybeRef<DependencyIdentifier<T>>,
  quantity: MaybeRef<Quantity>,
  lookUp?: MaybeRef<LookUp>
): ComputedRef<T | T[] | null>
export function useDependency<T>(
  id: MaybeRef<DependencyIdentifier<T>>,
  quantity?: MaybeRef<Quantity>,
  lookUp?: MaybeRef<LookUp>
): ComputedRef<T | T[] | null>
export function useDependency<T>(
  id: MaybeRef<DependencyIdentifier<T>>,
  quantityOrLookUp?: MaybeRef<Quantity | LookUp>,
  lookUp?: MaybeRef<LookUp>,
): ComputedRef<T | T[] | null> {
  const injector = useInjector()
  return computed(() => injector.get<T>(unref(id), unref(quantityOrLookUp), unref(lookUp)))
}
