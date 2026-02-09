import type { Dependency, IdentifierDecorator } from '@wendellhu/redi'
import { createIdentifier } from '@wendellhu/redi'

type HookFunction<T, Args extends any[]> = (...args: Args) => T

interface HookDependency<T> {
  /** 用于 useDependency 获取实例 */
  identifier: IdentifierDecorator<T>
  /** 用于 Injector 注册 */
  dependency: Dependency<T>
}

/**
 * 将 Vue Hook 函数转换为可注入的依赖
 *
 * @param hook Vue Hook 函数
 * @param args Hook 的默认参数
 * @param name 依赖标识符名称（可选，默认使用函数名）
 *
 * @example
 * ```ts
 * // 定义（自动使用 useCounter 作为标识符名称）
 * const CounterHook = defineHookDependency(useCounter, 0)
 *
 * // 或自定义名称
 * const CounterHook = defineHookDependency(useCounter, 0, 'MyCounter')
 *
 * // 注册
 * const injector = new Injector([CounterHook.dependency])
 *
 * // 使用
 * const counter = useDependency(CounterHook.identifier)
 * ```
 */
export function defineHookDependency<T, Args extends any[] = []>(
  hook: HookFunction<T, Args>,
  ...argsAndName: [...Args] | [...Args, string]
): HookDependency<T> {
  const lastArg = argsAndName[argsAndName.length - 1]
  const hasCustomName = typeof lastArg === 'string' && argsAndName.length > hook.length
  const name = hasCustomName ? lastArg as string : hook.name || 'AnonymousHook'
  const args = (hasCustomName ? argsAndName.slice(0, -1) : argsAndName) as Args

  const identifier = createIdentifier<T>(name)
  const dependency: Dependency<T> = [
    identifier,
    { useFactory: () => hook(...args) },
  ]
  return { identifier, dependency }
}

/**
 * 简化版：直接返回可用作标识符的对象
 *
 * @param hook Vue Hook 函数
 * @param defaultArgs Hook 的默认参数
 *
 * @example
 * ```ts
 * // 定义（自动使用函数名作为标识符）
 * const CounterHook = createHookDependency(useCounter, 0)
 *
 * // 注册
 * const injector = new Injector([CounterHook.asDependency()])
 *
 * // 使用
 * const counter = useDependency(CounterHook)
 * ```
 */
export function createHookDependency<T, Args extends any[] = []>(
  hook: HookFunction<T, Args>,
  ...defaultArgs: Args extends [] ? [] : Args
): IdentifierDecorator<T> & {
  asDependency: (...args: Args | []) => Dependency<T>
} {
  const name = hook.name || 'AnonymousHook'
  const identifier = createIdentifier<T>(name)

  return Object.assign(identifier, {
    /** 获取可注册的依赖项 */
    asDependency: (...args: Args | []): Dependency<T> => [
      identifier,
      { useFactory: () => hook(...(args.length ? args : defaultArgs) as Args) },
    ],
  })
}
