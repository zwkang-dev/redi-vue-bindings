import { config } from '@vue/test-utils'

// 抑制测试中预期的 Vue 警告
config.global.config.warnHandler = (msg) => {
  // 这些警告是测试边界情况时的预期行为
  const expectedWarnings = [
    'injection "Symbol(RediContext)" not found',
    'Component is missing template or render function',
  ]

  if (expectedWarnings.some(warning => msg.includes(warning))) {
    return
  }

  // 其他警告仍然打印
  console.warn(msg)
}
